import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Testbook collections",
	description: "Testbook collections",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<nav className="bg-gray-800 p-4">
					<div className="container mx-auto flex justify-between items-center">
						<Link href="/" className="text-white font-bold">Testbook</Link>
						<ul className="flex space-x-4">
							<li><Link href="/" className="text-white hover:text-gray-300">Home</Link></li>
							<li><Link href="/anki" className="text-white hover:text-gray-300">Anki</Link></li>
						</ul>
					</div>
				</nav>
				<main className="container mx-auto mt-4">
					{children}
				</main>
			</body>
		</html>
	);
}
