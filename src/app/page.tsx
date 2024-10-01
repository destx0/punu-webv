"use client";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/lib/firebaseConfig";
import QuizComponent from "@/components/QuizComponent";
import LoginComponent from "@/components/LoginComponent";
import UserProfile from "@/components/UserProfile";

export default function Home() {
	const [user, setUser] = useState(null);

	useEffect(() => {
		const auth = getAuth(app);
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			setUser(currentUser);
		});

		return () => unsubscribe();
	}, []);

	const handleLogin = (loggedInUser) => {
		setUser(loggedInUser);
	};

	const handleLogout = () => {
		setUser(null);
	};

	return (
		<div className="container mx-auto px-4">
			{user ? (
				<>
					<UserProfile user={user} onLogout={handleLogout} />
					<QuizComponent />
				</>
			) : (
				<LoginComponent onLogin={handleLogin} />
			)}
		</div>
	);
}
