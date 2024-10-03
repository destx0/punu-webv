import React, { useState, useEffect, useCallback } from 'react';

export default function QuizCard({ question, options, correctAnswer, explanation, onNext }) {
  const [showAnswer, setShowAnswer] = useState(false);

  const handleNext = useCallback(() => {
    setShowAnswer(false);
    onNext();
  }, [onNext]);

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.code === 'Space') {
        event.preventDefault();
        setShowAnswer(true);
      } else if (event.code === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleNext]);

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Question:</h2>
        <div dangerouslySetInnerHTML={{ __html: question }} />
      </div>
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Options:</h3>
        <ul className="list-disc pl-5">
          {options.map((option, index) => (
            <li 
              key={index} 
              className={showAnswer && index == correctAnswer ? 'bg-green-200' : ''}
            >
              <span dangerouslySetInnerHTML={{ __html: option }} />
              {showAnswer && index === correctAnswer && ' ✓'}
            </li>
          ))}
        </ul>
      </div>
      {!showAnswer ? (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setShowAnswer(true)}
        >
          Show Answer
        </button>
      ) : (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Explanation:</h3>
          <div dangerouslySetInnerHTML={{ __html: explanation }} />
        </div>
      )}
      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
        onClick={handleNext}
      >
        Next Question
      </button>
    </div>
  );
}