import Image from "next/image";
import QuizComponent from "@/components/QuizComponent";

export default function Home() {
	return (
		<div className="container mx-auto p-4">
			<h1 className="text-3xl font-bold underline mb-4">Hello world!</h1>
			<QuizComponent />
		</div>
	);
}
