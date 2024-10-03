'use client';

import React, { useEffect, useState } from 'react';
import useQuizStore from '@/stores/quizStore';
import QuizCard from '@/components/QuizCard';

export default function DeckPage({ params }) {
  const { deckId } = params;
  const { questions, fetchData, userId } = useQuizStore();
  const [loading, setLoading] = useState(true);
  const [questionQueue, setQuestionQueue] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    async function loadData() {
      if (userId) {
        await fetchData();
        setLoading(false);
      }
    }
    loadData();
  }, [userId, fetchData]);

  useEffect(() => {
    if (!loading && questions[deckId]) {
      const shuffledQuestions = [...questions[deckId]].sort(() => Math.random() - 0.5);
      setQuestionQueue(shuffledQuestions.map(q => q.id));
    }
  }, [loading, questions, deckId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const deckQuestions = questions[deckId] || [];

  if (deckQuestions.length === 0) {
    return <div>Deck not found or empty</div>;
  }

  const currentQuestion = deckQuestions.find(q => q.id === questionQueue[currentQuestionIndex]);

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % questionQueue.length);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Deck: {deckId}</h1>
      <p className="mb-4">Total cards: {deckQuestions.length}</p>
      {currentQuestion && (
        <QuizCard
          question={currentQuestion.question}
          options={currentQuestion.options}
          correctAnswer={currentQuestion.correctAnswer}
          explanation={currentQuestion.explanation}
          onNext={handleNextQuestion}
        />
      )}
    </div>
  );
}