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

	return (
		<AccordionItem
			value={accordionId}
			className="border-b print:border-b-black"
		>
			<AccordionTrigger
				onClick={() => toggleAccordion(accordionId)}
				className="py-1 px-0"
			>
				<div className="flex w-full items-start text-left">
					<span className="font-bold mr-2 text-gray-700 print:text-black">
						{serialNumber}.
					</span>
					<div
						className="flex-1"
						dangerouslySetInnerHTML={{ __html: quiz.question }}
					/>
				</div>
			</AccordionTrigger>
			<AccordionContent>
				<div className="flex flex-wrap gap-x-2 gap-y-1 py-1">
					{quiz.options.map((option, optionIndex) => (
						<div
							key={optionIndex}
							className={`flex items-center p-0.5 rounded ${
								optionIndex === quiz.correctAnswer
									? "bg-gray-200 print:bg-gray-300 font-bold underline"
									: ""
							}`}
						>
							{optionIndex === quiz.correctAnswer && (
								<span className="mr-1 font-bold">✓</span>
							)}
							<span className="font-semibold mr-1">
								{optionLetters[optionIndex]}.
							</span>
							<span
								dangerouslySetInnerHTML={{ __html: option }}
							/>
						</div>
					))}
				</div>
				{quiz.explanation && (
					<div className="mt-1 text-sm italic print:text-gray-700">
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
							<Button
								variant="destructive"
								size="sm"
								className="mt-1 print:hidden"
							>
								Delete
							</Button>
						</AlertDialogTrigger>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>
									Confirm Deletion
								</AlertDialogTitle>
								<AlertDialogDescription>
									This will permanently delete the question.
									Are you sure?
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
