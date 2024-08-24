import { create } from "zustand";
import { db } from "@/lib/firebaseConfig";
import {
	collection,
	getDocs,
	doc,
	getDoc,
	deleteDoc,
	updateDoc,
} from "firebase/firestore";

const useQuizStore = create((set) => ({
	playlists: [],
	questions: {},
	openAccordions: {},
	hideDeleteButtons: false,

	setPlaylists: (playlists) => set({ playlists }),
	setQuestions: (questions) => set({ questions }),
	setOpenAccordions: (openAccordions) => set({ openAccordions }),
	setHideDeleteButtons: (hideDeleteButtons) => set({ hideDeleteButtons }),

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
		try {
			await deleteDoc(doc(db, "quizzes", questionId));
			const questionlistDoc = await getDoc(
				doc(db, "questionlists", playlistId)
			);
			const updatedQuizIds = questionlistDoc
				.data()
				.quizIds.filter((id) => id !== questionId);
			await updateDoc(doc(db, "questionlists", playlistId), {
				quizIds: updatedQuizIds,
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
		try {
			const playlistsSnapshot = await getDocs(
				collection(db, "playlists")
			);
			const playlistsData = playlistsSnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			set({ playlists: playlistsData });

			const questionsData = {};
			for (const playlist of playlistsData) {
				const questionlistDoc = await getDoc(
					doc(db, "questionlists", playlist.id)
				);
				const quizIds = questionlistDoc.data().quizIds;
				const quizzes = await Promise.all(
					quizIds.map((id) => getDoc(doc(db, "quizzes", id)))
				);
				questionsData[playlist.id] = quizzes.map((quizDoc) => ({
					id: quizDoc.id,
					...quizDoc.data(),
				}));
			}
			set({ questions: questionsData });
		} catch (error) {
			console.error("Error fetching data from Firestore:", error);
		}
	},
}));

export default useQuizStore;
