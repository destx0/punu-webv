"use client";
import React, { useEffect, useState } from 'react';
import DeckList from '@/components/DeckList';
import useQuizStore from '@/stores/quizStore';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { app } from "@/lib/firebaseConfig";

export default function AnkiPage() {
  const { playlists, fetchData, setUserId } = useQuizStore();
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
        console.log("AnkiPage: Loading data for user ID:", user.uid);
        await fetchData();
      }
    };

    loadData();
  }, [user, fetchData]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please log in to view your Anki decks.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Anki Flashcards</h1>
      <p className="mb-4">Select a deck to start studying:</p>
      <DeckList decks={playlists} />
    </div>
  );
}