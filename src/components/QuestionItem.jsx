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
import useQuizStore from "@/stores/quizStore";

export default function QuestionItem({
	quiz,
	playlistId,
	index,
	serialNumber,
}) {
	const {
		toggleAccordion,
		deleteQuestion,
		hideDeleteButtons,
		openAccordions,
	} = useQuizStore();

	const optionLetters = ["A", "B", "C", "D", "E", "F", "G", "H"];
	const accordionId = `${playlistId}-${index}`;
	const isOpen = openAccordions[accordionId];

	return (
		<AccordionItem value={accordionId}>
			<AccordionTrigger
				onClick={() => toggleAccordion(accordionId)}
				className="flex flex-col items-start text-left"
			>
				<div className="flex w-full text-left px-4 py-2">
					<span className="font-bold mr-4 text-gray-500">
						Q{serialNumber}.
					</span>
					<div
						className="flex-1"
						dangerouslySetInnerHTML={{ __html: quiz.question }}
					/>
				</div>
			</AccordionTrigger>
			<AccordionContent>
				<ul className="list-none pl-0 mb-4">
					{quiz.options.map((option, optionIndex) => (
						<li
							key={optionIndex}
							className={`mb-2 p-2 rounded ${
								optionIndex === quiz.correctAnswer
									? "bg-green-100 border-green-500 border"
									: "bg-gray-100"
							}`}
						>
							<span className="font-bold mr-2">
								{optionLetters[optionIndex]}.
							</span>
							<span
								dangerouslySetInnerHTML={{ __html: option }}
							/>
							{optionIndex === quiz.correctAnswer && (
								<span className="ml-2 text-green-600 font-bold">
									(Correct Answer)
								</span>
							)}
						</li>
					))}
				</ul>
				{quiz.explanation && (
					<div className="mb-4 p-2 bg-blue-100 rounded">
						<strong>Explanation:</strong>
						<span
							dangerouslySetInnerHTML={{
								__html: quiz.explanation,
							}}
						/>
					</div>
				)}
				{!hideDeleteButtons && (
					<AlertDialog>
						<AlertDialogTrigger asChild>
							<Button variant="destructive">
								Delete Question
							</Button>
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
				)}
			</AccordionContent>
		</AccordionItem>
	);
}
