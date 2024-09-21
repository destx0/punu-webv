import React from 'react';
import useQuizStore from '@/stores/quizStore';

export default async function DeckPage({ params }) {
  const { deckId } = params;
  const { playlists, questions, fetchData } = useQuizStore.getState();
  await fetchData();

  const deck = playlists.find(playlist => playlist.id === deckId);
  const deckQuestions = questions[deckId] || [];

  if (!deck) {
    return <div>Deck not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Deck: {deck.name}</h1>
      <p className="mb-4">Total cards: {deckQuestions.length}</p>
      {/* Add flashcard components and study logic here */}
      <ul>
        {deckQuestions.map((question, index) => (
          <li key={question.id} className="mb-2">
            <strong>Q{index + 1}:</strong> {question.question}
          </li>
        ))}
      </ul>
    </div>
  );
}