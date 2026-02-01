import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const MemoryGame = ({ onClose }) => {
  const symbols = ['🔧', '🔨', '⚙️', '🔩', '🛠️', '🏗️', '🔥', '⚡'];
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  const initializeGame = () => {
    const gameCards = [];
    symbols.forEach((symbol, index) => {
      // Add two cards for each symbol
      gameCards.push(
        { id: index * 2, symbol, isFlipped: false, isMatched: false },
        { id: index * 2 + 1, symbol, isFlipped: false, isMatched: false }
      );
    });

    // Shuffle cards
    for (let i = gameCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]];
    }

    setCards(gameCards);
    setFlippedCards([]);
    setMoves(0);
    setGameWon(false);
  };

  const flipCard = (cardId) => {
    if (flippedCards.length === 2 || gameWon) return;
    if (flippedCards.includes(cardId)) return;
    if (cards.find(card => card.id === cardId)?.isMatched) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    setCards(prevCards =>
      prevCards.map(card =>
        card.id === cardId ? { ...card, isFlipped: true } : card
      )
    );

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards.find(card => card.id === firstId);
      const secondCard = cards.find(card => card.id === secondId);

      if (firstCard?.symbol === secondCard?.symbol) {
        // Match found
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              card.id === firstId || card.id === secondId
                ? { ...card, isMatched: true }
                : card
            )
          );
          setFlippedCards([]);
          
          // Check if game is won
          const updatedCards = cards.map(card =>
            card.id === firstId || card.id === secondId
              ? { ...card, isMatched: true }
              : card
          );
          if (updatedCards.every(card => card.isMatched)) {
            setGameWon(true);
          }
        }, 1000);
      } else {
        // No match
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map(card =>
              card.id === firstId || card.id === secondId
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  useEffect(() => {
    initializeGame();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Memory Game</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <div className="text-center mb-4">
          <p className="text-lg font-semibold">Moves: {moves}</p>
          {gameWon && (
            <div>
              <p className="text-green-600 font-semibold">Congratulations! You won!</p>
              <button
                onClick={initializeGame}
                className="mt-2 bg-gray-800 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                New Game
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-4 gap-3 mx-auto" style={{ width: 'fit-content' }}>
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => flipCard(card.id)}
              className={`
                w-16 h-16 flex items-center justify-center text-2xl font-bold rounded-lg cursor-pointer transition-all duration-300
                ${card.isFlipped || card.isMatched
                  ? 'bg-blue-100 border-2 border-blue-400'
                  : 'bg-gray-200 hover:bg-gray-300 border-2 border-gray-400'
                }
                ${card.isMatched ? 'opacity-50' : ''}
              `}
            >
              {(card.isFlipped || card.isMatched) ? card.symbol : '?'}
            </div>
          ))}
        </div>

        <div className="mt-4 text-center text-sm text-gray-600">
          <p>Click on cards to flip them and find matching pairs</p>
          <p>Match all pairs to win the game</p>
        </div>
      </div>
    </div>
  );
};

export default MemoryGame;