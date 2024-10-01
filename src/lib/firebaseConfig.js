import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteField,
  addDoc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export async function createUserDocument(userId, email) {
	try {
		const userRef = doc(db, "users", userId);
		const userDoc = await getDoc(userRef);
		
		if (!userDoc.exists()) {
			await setDoc(userRef, {
				email,
				playlists: {},
			});
		}
	} catch (e) {
		console.error("Error creating user document: ", e);
		throw e;
	}
}

export async function createPlaylist(userId, name) {
	try {
		const userRef = doc(db, "users", userId);
		const playlistId = Date.now().toString();
		
		await updateDoc(userRef, {
			[`playlists.${playlistId}`]: { name, quizIds: [] },
		});
		
		return playlistId;
	} catch (e) {
		console.error("Error creating playlist: ", e);
		throw e;
	}
}

export async function addQuizToPlaylist(userId, playlistId, quizData) {
	try {
		const quizzesRef = collection(db, "quizzes");
		const quizDocRef = await addDoc(quizzesRef, quizData);
		const quizId = quizDocRef.id;

		const userRef = doc(db, "users", userId);
		await updateDoc(userRef, {
			[`playlists.${playlistId}.quizIds`]: arrayUnion(quizId),
		});
		
		return quizId;
	} catch (e) {
		console.error("Error adding quiz to playlist: ", e);
		throw e;
	}
}

export async function getPlaylistNames(userId) {
	try {
		const userDoc = await getDoc(doc(db, "users", userId));
		if (!userDoc.exists()) {
			return [];
		}
		const userData = userDoc.data();
		const playlists = userData.playlists || {};
		return Object.entries(playlists).map(([id, playlist]) => ({
			id,
			name: playlist.name,
		}));
	} catch (e) {
		console.error("Error getting playlist names: ", e);
		throw e;
	}
}

export async function updatePlaylistName(userId, playlistId, newName) {
	try {
		const userRef = doc(db, "users", userId);
		await updateDoc(userRef, {
			[`playlists.${playlistId}.name`]: newName,
		});
	} catch (e) {
		console.error("Error updating playlist name: ", e);
		throw e;
	}
}

export async function deletePlaylist(userId, playlistId) {
	try {
		const userRef = doc(db, "users", userId);
		await updateDoc(userRef, {
			[`playlists.${playlistId}`]: deleteField(),
		});
	} catch (e) {
		console.error("Error deleting playlist: ", e);
		throw e;
	}
}

export async function getQuizzesForPlaylist(userId, playlistId) {
	try {
		const userDoc = await getDoc(doc(db, "users", userId));
		const playlist = userDoc.data().playlists[playlistId];
		if (!playlist) return [];

		const quizPromises = playlist.quizIds.map(quizId => 
			getDoc(doc(db, "quizzes", quizId))
		);
		const quizDocs = await Promise.all(quizPromises);
		return quizDocs.map(doc => ({ id: doc.id, ...doc.data() }));
	} catch (e) {
		console.error("Error getting quizzes for playlist: ", e);
		throw e;
	}
}

export { db, app };
