import Image from "next/image";
import QuizComponent from "@/components/QuizComponent";

export default function Home() {
	return (
		<div className="container mx-auto px-4">
			<QuizComponent />
		</div>
	);
}
