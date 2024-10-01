"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import QuestionItem from "./QuestionItem";
import useQuizStore from "@/stores/quizStore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/lib/firebaseConfig";

export default function QuizComponent() {
	const {
		playlists,
		questions,
		openAccordions,
		hideDeleteButtons,
		toggleAllAccordions,
		toggleAccordion,
		deleteQuestion,
		toggleHideDeleteButtons,
		fetchData,
		setUserId,
	} = useQuizStore();

	const [isLoading, setIsLoading] = useState(true);
	const [user, setUser] = useState(null);

	useEffect(() => {
		const auth = getAuth(app);
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				console.log("User is signed in:", user.uid);
				setUser(user);
				setUserId(user.uid);
			} else {
				console.log("User is signed out");
				setUser(null);
				setUserId(null);
			}
			setIsLoading(false);
		});

		return () => unsubscribe();
	}, [setUserId]);

	useEffect(() => {
		const loadData = async () => {
			if (user) {
				console.log("QuizComponent: Loading data for user ID:", user.uid);
				await fetchData();
			}
		};

		loadData();
	}, [user, fetchData]);

	useEffect(() => {
		console.log("QuizComponent: Playlists updated:", playlists);
		console.log("QuizComponent: Questions updated:", questions);
	}, [playlists, questions]);

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (!user) {
		return <div>Please log in to view your quizzes.</div>;
	}

	if (playlists.length === 0) {
		return <div>No playlists found. Please create a playlist.</div>;
	}

	return (
		<Tabs defaultValue={playlists[0]?.id}>
			<TabsList className="print:hidden">
				{playlists.map((playlist) => (
					<TabsTrigger key={playlist.id} value={playlist.id}>
						{playlist.name}
					</TabsTrigger>
				))}
			</TabsList>
			{playlists.map((playlist) => (
				<TabsContent key={playlist.id} value={playlist.id}>
					<div className="flex space-x-2 mb-4 print:hidden">
						<Button
							onClick={() => toggleAllAccordions(playlist.id)}
						>
							Toggle All Questions
						</Button>
						<Button onClick={toggleHideDeleteButtons}>
							{hideDeleteButtons
								? "Show Delete Buttons"
								: "Hide Delete Buttons"}
						</Button>
					</div>
					<h2 className="hidden print:block text-2xl font-bold mb-4">
						{playlist.name}
					</h2>
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
								hideDeleteButton={hideDeleteButtons}
								serialNumber={index + 1}
							/>
						))}
					</Accordion>
				</TabsContent>
			))}
		</Tabs>
	);
}
