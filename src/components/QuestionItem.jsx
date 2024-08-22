import React from "react";
import {
	AccordionItem,
	AccordionTrigger,
	AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function QuestionItem({
	quiz,
	playlistId,
	index,
	deleteQuestion,
	toggleAccordion,
	isOpen,
}) {
	return (
		<AccordionItem value={`${playlistId}-${index}`}>
			<AccordionTrigger
				onClick={() => toggleAccordion(`${playlistId}-${index}`)}
			>
				<div dangerouslySetInnerHTML={{ __html: quiz.question }} />
			</AccordionTrigger>
			<AccordionContent>
				<ul className="list-disc pl-5 mb-4">
					{quiz.options.map((option, optionIndex) => (
						<li
							key={optionIndex}
							className={
								option === quiz.correctAnswer ? "font-bold" : ""
							}
							dangerouslySetInnerHTML={{ __html: option }}
						/>
					))}
				</ul>
				<p className="mb-4">
					<strong>Correct Answer:</strong>
					<span
						dangerouslySetInnerHTML={{ __html: quiz.correctAnswer }}
					/>
				</p>
				{quiz.explanation && (
					<p className="mb-4">
						<strong>Explanation:</strong>
						<span
							dangerouslySetInnerHTML={{
								__html: quiz.explanation,
							}}
						/>
					</p>
				)}
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button variant="destructive">Delete Question</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>
								Are you absolutely sure?
							</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This will
								permanently delete the question from the
								database.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction
								onClick={() =>
									deleteQuestion(playlistId, quiz.id)
								}
							>
								Delete
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</AccordionContent>
		</AccordionItem>
	);
}
