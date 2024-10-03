"use client";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { app } from "@/lib/firebaseConfig";
import QuizComponent from "@/components/QuizComponent";
import LoginComponent from "@/components/LoginComponent";

export default function Home() {
	const [user, setUser] = useState(null);

	useEffect(() => {
		const auth = getAuth(app);
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			setUser(currentUser as User | null);
		});

		return () => unsubscribe();
	}, []);

	return (
		<div className="container mx-auto px-4">
			{user ? (
				<QuizComponent />
			) : (
				<LoginComponent />
			)}
		</div>
	);
}
