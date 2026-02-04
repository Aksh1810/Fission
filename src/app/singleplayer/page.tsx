'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGame } from '@/hooks/useGame';
import { GameBoard, ColorBar, Navigation, GameOverModal, DifficultyModal } from '@/components';
import { Difficulty } from '@/core/types';

export default function SinglePlayer() {
    const router = useRouter();
    const [difficulty, setDifficulty] = useState<Difficulty>('medium');
    const [showDifficultyModal, setShowDifficultyModal] = useState(false);
    const [isClient, setIsClient] = useState(false);

    const {
        gameState,
        burstDots,
        isProcessing,
        displayedTurn,
        isAiTurn,
        handleCellClick,
        removeBurst,
        resetGame,
    } = useGame({
        mode: 'singleplayer',
        difficulty,
        playerColor: 'B',
    });

    // Load difficulty from localStorage on mount
    useEffect(() => {
        setIsClient(true);
        const savedDifficulty = localStorage.getItem('fission-difficulty');
        if (savedDifficulty && ['easy', 'medium', 'hard'].includes(savedDifficulty)) {
            setDifficulty(savedDifficulty as Difficulty);
        } else {
            // First time - show difficulty modal
            setShowDifficultyModal(true);
        }
    }, []);

    const handleDifficultySelect = (newDifficulty: Difficulty) => {
        setDifficulty(newDifficulty);
        localStorage.setItem('fission-difficulty', newDifficulty);
        setShowDifficultyModal(false);
        resetGame();
    };

    const handleRematch = () => {
        resetGame();
    };

    const handleMainMenu = () => {
        router.push('/');
    };

    // Don't render until client-side to avoid hydration issues
    if (!isClient) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <div className="text-gray-400">Loading...</div>
            </main>
        );
    }

    const isGameOver = gameState.status === 'game_over';
    const isPlayerWinner = gameState.winner === 'B';
    const isDisabled = isProcessing || isAiTurn || isGameOver;

    return (
        <main className="min-h-screen flex flex-col items-center pt-8 pb-16 px-4">
            <Navigation />

            {/* Difficulty selector */}
            <button
                onClick={() => setShowDifficultyModal(true)}
                className="mb-4 px-4 py-2 text-sm text-gray-400 hover:text-white 
                   bg-gray-800 rounded-lg transition-colors flex items-center gap-2"
            >
                <span>Difficulty:</span>
                <span className="font-semibold text-white capitalize">{difficulty}</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Game Board */}
            <div className="mt-4">
                <GameBoard
                    grid={gameState.grid}
                    onCellClick={handleCellClick}
                    disabled={isDisabled}
                    burstDots={burstDots}
                    onBurstComplete={removeBurst}
                />
            </div>

            {/* Color Bar */}
            <ColorBar colorCount={gameState.colorCount} turn={displayedTurn} />

            {/* Turn Indicator */}
            <div className="mt-6 text-center">
                <p className={`text-xl font-semibold ${gameState.currentPlayer === 'B' ? 'text-blue-400' : 'text-red-400'
                    }`}>
                    {isProcessing
                        ? 'Processing...'
                        : isAiTurn
                            ? "AI's Turn"
                            : 'Your Turn'
                    }
                </p>
            </div>

            {/* Modals */}
            <DifficultyModal
                isOpen={showDifficultyModal}
                currentDifficulty={difficulty}
                onSelect={handleDifficultySelect}
                onClose={() => setShowDifficultyModal(false)}
            />

            <GameOverModal
                isOpen={isGameOver}
                winner={gameState.winner}
                turns={displayedTurn}
                isPlayerWinner={isPlayerWinner}
                onRematch={handleRematch}
                onMainMenu={handleMainMenu}
            />
        </main>
    );
}
