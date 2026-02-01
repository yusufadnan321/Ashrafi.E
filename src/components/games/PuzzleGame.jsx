import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const PuzzleGame = ({ onClose }) => {
  const SIZE = 4;
  const EMPTY_TILE = 16;

  const [tiles, setTiles] = useState([]);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);

  const initializeGame = () => {
    const initialTiles = Array.from({ length: SIZE * SIZE }, (_, i) => i + 1);
    initialTiles[SIZE * SIZE - 1] = EMPTY_TILE;
    
    // Shuffle the tiles
    const shuffled = [...initialTiles];
    for (let i = 0; i < 1000; i++) {
      const emptyIndex = shuffled.indexOf(EMPTY_TILE);
      const neighbors = getNeighbors(emptyIndex);
      const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
      [shuffled[emptyIndex], shuffled[randomNeighbor]] = [shuffled[randomNeighbor], shuffled[emptyIndex]];
    }
    
    setTiles(shuffled);
    setMoves(0);
    setGameWon(false);
  };

  const getNeighbors = (index) => {
    const neighbors = [];
    const row = Math.floor(index / SIZE);
    const col = index % SIZE;

    if (row > 0) neighbors.push(index - SIZE); // Up
    if (row < SIZE - 1) neighbors.push(index + SIZE); // Down
    if (col > 0) neighbors.push(index - 1); // Left
    if (col < SIZE - 1) neighbors.push(index + 1); // Right

    return neighbors;
  };

  const moveTile = (index) => {
    if (gameWon) return;

    const emptyIndex = tiles.indexOf(EMPTY_TILE);
    const neighbors = getNeighbors(emptyIndex);

    if (neighbors.includes(index)) {
      const newTiles = [...tiles];
      [newTiles[emptyIndex], newTiles[index]] = [newTiles[index], newTiles[emptyIndex]];
      setTiles(newTiles);
      setMoves(moves + 1);

      // Check if game is won
      const isWon = newTiles.every((tile, i) => tile === i + 1);
      if (isWon) {
        setGameWon(true);
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
          <h2 className="text-2xl font-bold text-gray-800">Sliding Puzzle</h2>
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

        <div 
          className="grid grid-cols-4 gap-2 mx-auto bg-gray-300 p-2 rounded-lg"
          style={{ width: 'fit-content' }}
        >
          {tiles.map((tile, index) => (
            <div
              key={index}
              onClick={() => moveTile(index)}
              className={`
                w-16 h-16 flex items-center justify-center text-xl font-bold rounded cursor-pointer transition-colors
                ${tile === EMPTY_TILE 
                  ? 'bg-transparent' 
                  : 'bg-white hover:bg-gray-100 border-2 border-gray-400'
                }
              `}
            >
              {tile !== EMPTY_TILE && tile}
            </div>
          ))}
        </div>

        <div className="mt-4 text-center text-sm text-gray-600">
          <p>Click on tiles adjacent to the empty space to move them</p>
          <p>Arrange numbers 1-15 in order to win</p>
        </div>
      </div>
    </div>
  );
};

export default PuzzleGame;