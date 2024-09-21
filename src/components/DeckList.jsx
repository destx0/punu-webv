import React from 'react';
import Link from 'next/link';

const DeckList = ({ decks }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {decks.map((deck) => (
        <Link href={`/anki/${deck.id}`} key={deck.id}>
          <div className="bg-white p-4 rounded shadow hover:shadow-md transition-shadow cursor-pointer">
            <h2 className="text-xl font-semibold">{deck.name}</h2>
            <p className="text-gray-600">Click to open deck</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default DeckList;