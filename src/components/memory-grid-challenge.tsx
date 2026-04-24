'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const GRID_SIZE = 3;
const TILE_COLORS = [
  '#ef4444', // red-500
  '#f97316', // orange-500
  '#eab308', // yellow-500
  '#84cc16', // lime-500
  '#22c55e', // green-500
  '#10b981', // emerald-500
  '#14b8a6', // teal-500
  '#06b6d4', // cyan-500
  '#3b82f6', // blue-500
];

type GameState = 'start' | 'watching' | 'repeating' | 'gameover';
type Tile = { id: number; color: string };

const generateGrid = (): Tile[] => {
  const grid: Tile[] = [];
  for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
    grid.push({ id: i, color: TILE_COLORS[i % TILE_COLORS.length] });
  }
  return grid;
};

const MemoryGridChallenge: React.FC = () => {
  const [grid] = useState(generateGrid);
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [litTile, setLitTile] = useState<number | null>(null);
  const [gameState, setGameState] = useState<GameState>('start');
  const [level, setLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const startNextLevel = useCallback(() => {
    setPlayerSequence([]);
    const nextTile = Math.floor(Math.random() * (GRID_SIZE * GRID_SIZE));
    const newSequence = [...sequence, nextTile];
    setSequence(newSequence);
    setGameState('watching');

    newSequence.forEach((tileId, index) => {
      setTimeout(() => {
        setLitTile(tileId);
        setTimeout(() => {
          setLitTile(null);
          if (index === newSequence.length - 1) {
            setGameState('repeating');
          }
        }, 400);
      }, (index + 1) * 700);
    });
  }, [sequence]);

  const startGame = () => {
    setSequence([]);
    setLevel(1);
    setScore(0);
    startNextLevel();
  };

  const handleTileClick = (tileId: number) => {
    if (gameState !== 'repeating') return;

    if (sequence[playerSequence.length] === tileId) {
      const newPlayerSequence = [...playerSequence, tileId];
      setPlayerSequence(newPlayerSequence);
      setScore(s => s + 10);

      // Check if level is complete
      if (newPlayerSequence.length === sequence.length) {
        setGameState('watching'); // Brief pause before next level
        setLevel(l => l + 1);
        setScore(s => s + 50); // Bonus for level completion
        setTimeout(() => {
          startNextLevel();
        }, 1000);
      }
    } else {
      // Game Over
      setGameState('gameover');
      if (score > highScore) {
        setHighScore(score);
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex justify-around w-full max-w-md">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Score</p>
          <p className="text-2xl font-bold">{score}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Level</p>
          <p className="text-2xl font-bold">{level}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">High Score</p>
          <p className="text-2xl font-bold">{highScore}</p>
        </div>
      </div>

      <Card className="p-2 bg-card/50 backdrop-blur-sm border-primary/20 shadow-lg relative overflow-hidden">
        <CardContent className="p-0">
          <div className="grid grid-cols-3 gap-2">
            {grid.map((tile) => (
              <motion.button
                key={tile.id}
                onClick={() => handleTileClick(tile.id)}
                disabled={gameState !== 'repeating'}
                className="w-16 h-16 rounded-lg shadow-inner disabled:cursor-not-allowed"
                style={{ backgroundColor: tile.color }}
                initial={{ opacity: 0.8 }}
                animate={{
                  opacity: litTile === tile.id ? 1 : 0.6,
                  scale: litTile === tile.id ? 1.1 : 1,
                  boxShadow: litTile === tile.id 
                    ? `0 0 20px ${tile.color}` 
                    : 'inset 0 2px 4px rgba(0,0,0,0.2)',
                }}
                transition={{ duration: 0.2 }}
                whileTap={{ scale: gameState === 'repeating' ? 0.95 : 1 }}
              />
            ))}
          </div>
          <AnimatePresence>
            {gameState !== 'repeating' && gameState !== 'watching' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm"
              >
                {gameState === 'start' && (
                  <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4">Memory Grid</h2>
                    <Button onClick={startGame} size="lg">Start Game</Button>
                  </div>
                )}
                {gameState === 'gameover' && (
                  <div className="text-center">
                    <h2 className="text-3xl font-bold mb-4 text-destructive">Game Over</h2>
                    <p className="mb-4">You reached level {level}.</p>
                    <Button onClick={startGame} size="lg">Play Again</Button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
      
      <div className="h-6 text-center text-muted-foreground font-medium">
        {gameState === 'watching' && <p>Watch the sequence...</p>}
        {gameState === 'repeating' && <p>Your turn!</p>}
      </div>
    </div>
  );
};

export default MemoryGridChallenge;
