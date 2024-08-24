"use client";
import React, { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import QuestionItem from "./QuestionItem";
import useQuizStore from "@/stores/quizStore";

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
	} = useQuizStore();

	useEffect(() => {
		fetchData();
	}, [fetchData]);

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
					<div className="flex space-x-2 mb-4">
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
