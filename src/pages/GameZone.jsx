import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SnakeGame from '../components/games/SnakeGame';
import PuzzleGame from '../components/games/PuzzleGame';
import MemoryGame from '../components/games/MemoryGame';

const GameZone = () => {
  const [activeGame, setActiveGame] = useState(null);

  const games = [
    {
      id: 'snake',
      name: 'Snake Game',
      description: 'Classic snake game - eat food and grow longer!',
      icon: '🐍',
      difficulty: 'Easy'
    },
    {
      id: 'puzzle',
      name: 'Sliding Puzzle',
      description: 'Arrange the numbers in correct order',
      icon: '🧩',
      difficulty: 'Medium'
    },
    {
      id: 'memory',
      name: 'Memory Game',
      description: 'Test your memory with card matching',
      icon: '🧠',
      difficulty: 'Hard'
    }
  ];

  const renderGame = () => {
    switch (activeGame) {
      case 'snake':
        return <SnakeGame onClose={() => setActiveGame(null)} />;
      case 'puzzle':
        return <PuzzleGame onClose={() => setActiveGame(null)} />;
      case 'memory':
        return <MemoryGame onClose={() => setActiveGame(null)} />;
      default:
        return null;
    }
  };

  if (activeGame) {
    return renderGame();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold mb-6">Game Zone</h1>
            <p className="text-xl max-w-3xl mx-auto">
              Take a break and enjoy some quick games! Test your skills with these 
              fun and challenging mini-games.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Games Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {games.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => setActiveGame(game.id)}
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">{game.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">{game.name}</h3>
                  <p className="text-gray-600 mb-4">{game.description}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      game.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                      game.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {game.difficulty}
                    </span>
                  </div>
                  <button className="w-full bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors">
                    Play Now
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Instructions */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">How to Play</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose any game above to start playing. Each game has its own controls and objectives.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🎮</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Choose Your Game</h3>
              <p className="text-gray-600">Select from our collection of fun mini-games</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Follow Instructions</h3>
              <p className="text-gray-600">Each game will show you the controls and rules</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Beat Your Score</h3>
              <p className="text-gray-600">Challenge yourself to improve your best score</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default GameZone;