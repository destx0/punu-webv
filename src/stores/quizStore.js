import { create } from "zustand";
import { db } from "@/lib/firebaseConfig";
import {
	doc,
	getDoc,
	deleteDoc,
	updateDoc,
	arrayRemove,
} from "firebase/firestore";
import { getPlaylistNames, getQuizzesForPlaylist } from "@/lib/firebaseConfig";

const useQuizStore = create((set, get) => ({
	playlists: [],
	questions: {},
	openAccordions: {},
	hideDeleteButtons: false,
	userId: null,

	setPlaylists: (playlists) => set({ playlists }),
	setQuestions: (questions) => set({ questions }),
	setOpenAccordions: (openAccordions) => set({ openAccordions }),
	setHideDeleteButtons: (hideDeleteButtons) => set({ hideDeleteButtons }),
	setUserId: (userId) => {
		console.log("Setting user ID:", userId);
		set({ userId });
	},

	toggleAllAccordions: (playlistId) =>
		set((state) => {
			const allClosed = state.questions[playlistId].every(
				(_, index) => !state.openAccordions[`${playlistId}-${index}`]
			);
			const newOpenAccordions = { ...state.openAccordions };
			state.questions[playlistId].forEach((_, index) => {
				newOpenAccordions[`${playlistId}-${index}`] = allClosed;
			});
			return { openAccordions: newOpenAccordions };
		}),

	toggleAccordion: (accordionId) =>
		set((state) => ({
			openAccordions: {
				...state.openAccordions,
				[accordionId]: !state.openAccordions[accordionId],
			},
		})),

	deleteQuestion: async (playlistId, questionId) => {
		const { userId } = useQuizStore.getState();
		try {
			await deleteDoc(doc(db, "quizzes", questionId));
			const userRef = doc(db, "users", userId);
			await updateDoc(userRef, {
				[`playlists.${playlistId}.quizIds`]: arrayRemove(questionId),
			});
			set((state) => ({
				questions: {
					...state.questions,
					[playlistId]: state.questions[playlistId].filter(
						(q) => q.id !== questionId
					),
				},
			}));
		} catch (error) {
			console.error("Error deleting question:", error);
		}
	},

	toggleHideDeleteButtons: () =>
		set((state) => ({ hideDeleteButtons: !state.hideDeleteButtons })),

	fetchData: async () => {
		const userId = get().userId;
		console.log("Fetching data for user ID:", userId);
		if (!userId) {
			console.error("User ID not set, cannot fetch data");
			return;
		}
		try {
			console.log("Fetching playlist names");
			const playlistsData = await getPlaylistNames(userId);
			console.log("Fetched playlists:", playlistsData);
			set({ playlists: playlistsData });

			const questionsData = {};
			for (const playlist of playlistsData) {
				console.log(`Fetching quizzes for playlist: ${playlist.id}`);
				const quizzes = await getQuizzesForPlaylist(userId, playlist.id);
				console.log(`Fetched quizzes for playlist ${playlist.id}:`, quizzes);
				questionsData[playlist.id] = quizzes;
			}
			console.log("Setting questions data:", questionsData);
			set({ questions: questionsData });
		} catch (error) {
			console.error("Error fetching data from Firestore:", error);
		}
	},
}));

export default useQuizStore;
