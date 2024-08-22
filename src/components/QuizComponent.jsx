"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebaseConfig";
import {
	collection,
	getDocs,
	doc,
	getDoc,
	deleteDoc,
	updateDoc,
} from "firebase/firestore";
import QuestionItem from "./QuestionItem";

export default function QuizComponent() {
	const [playlists, setPlaylists] = useState([]);
	const [questions, setQuestions] = useState({});
	const [openAccordions, setOpenAccordions] = useState({});

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		try {
			const playlistsSnapshot = await getDocs(
				collection(db, "playlists")
			);
			const playlistsData = playlistsSnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setPlaylists(playlistsData);

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
			setQuestions(questionsData);
		} catch (error) {
			console.error("Error fetching data from Firestore:", error);
		}
	};

	const toggleAllAccordions = (playlistId) => {
		const allClosed = questions[playlistId].every(
			(_, index) => !openAccordions[`${playlistId}-${index}`]
		);
		const newOpenAccordions = { ...openAccordions };
		questions[playlistId].forEach((_, index) => {
			newOpenAccordions[`${playlistId}-${index}`] = allClosed;
		});
		setOpenAccordions(newOpenAccordions);
	};

	const toggleAccordion = (accordionId) => {
		setOpenAccordions((prev) => ({
			...prev,
			[accordionId]: !prev[accordionId],
		}));
	};

	const deleteQuestion = async (playlistId, questionId) => {
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
			setQuestions((prevQuestions) => ({
				...prevQuestions,
				[playlistId]: prevQuestions[playlistId].filter(
					(q) => q.id !== questionId
				),
			}));
		} catch (error) {
			console.error("Error deleting question:", error);
		}
	};

	return (
		<Tabs defaultValue={playlists[0]?.id}>
			<TabsList>
				{playlists.map((playlist) => (
					<TabsTrigger key={playlist.id} value={playlist.id}>
						{playlist.name}
					</TabsTrigger>
				))}
			</TabsList>
			{playlists.map((playlist) => (
				<TabsContent key={playlist.id} value={playlist.id}>
					<Button onClick={() => toggleAllAccordions(playlist.id)}>
						Toggle All Questions
					</Button>
					<Accordion
						type="multiple"
						value={Object.keys(openAccordions).filter(
							(key) => openAccordions[key]
						)}
					>
						{questions[playlist.id]?.map((quiz, index) => (
							<QuestionItem
								key={quiz.id}
								quiz={quiz}
								playlistId={playlist.id}
								index={index}
								deleteQuestion={deleteQuestion}
								toggleAccordion={toggleAccordion}
								isOpen={
									openAccordions[`${playlist.id}-${index}`]
								}
							/>
						))}
					</Accordion>
				</TabsContent>
			))}
		</Tabs>
	);
}
