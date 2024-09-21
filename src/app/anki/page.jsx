import React from 'react';
import DeckList from '@/components/DeckList';
import useQuizStore from '@/stores/quizStore';

export default async function AnkiPage() {
  // Use the server-side version of the store to fetch data
  const { playlists, fetchData } = useQuizStore.getState();
  await fetchData();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Anki Flashcards</h1>
      <p className="mb-4">Select a deck to start studying:</p>
      <DeckList decks={playlists} />
    </div>
  );
}