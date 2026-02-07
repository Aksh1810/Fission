'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useGame, useAudio } from '@/hooks';
import { GameBoard, ColorBar, Navigation, GameOverModal, DifficultyModal } from '@/components';
import { Difficulty } from '@/core/types';

export default function SinglePlayer() {
    const router = useRouter();
    const [difficulty, setDifficulty] = useState<Difficulty>('medium');
    const [showDifficultyModal, setShowDifficultyModal] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);

    const { initAudio, playClick, playExplosion, toggleSound } = useAudio();

    const {
        gameState,
        burstDots,
        isProcessing,
        displayedTurn,
        isAiTurn,
        handleCellClick: originalHandleCellClick,
        removeBurst,
        resetGame,
    } = useGame({
        mode: 'singleplayer',
        difficulty,
        playerColor: 'B',
    });

    // Wrap cell click with audio
    const handleCellClick = useCallback(async (row: number, col: number) => {
        await initAudio();
        playClick();
        originalHandleCellClick(row, col);
    }, [initAudio, playClick, originalHandleCellClick]);

    // Play explosion sound when bursts happen
    useEffect(() => {
        if (burstDots.length > 0) {
            playExplosion();
        }
    }, [burstDots.length, playExplosion]);

    // Load difficulty from localStorage on mount
    useEffect(() => {
        setIsClient(true);
        const savedDifficulty = localStorage.getItem('fission-difficulty');
        if (savedDifficulty && ['easy', 'medium', 'hard'].includes(savedDifficulty)) {
            setDifficulty(savedDifficulty as Difficulty);
        } else {
            setShowDifficultyModal(true);
        }
    }, []);

    const handleDifficultySelect = (newDifficulty: Difficulty) => {
        setDifficulty(newDifficulty);
        localStorage.setItem('fission-difficulty', newDifficulty);
        setShowDifficultyModal(false);
        resetGame();
    };

    const handleToggleSound = async () => {
        await initAudio();
        const newState = toggleSound();
        setSoundEnabled(newState);
    };

    const handleRematch = () => {
        resetGame();
    };

    const handleMainMenu = () => {
        router.push('/');
    };

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

            {/* Top controls */}
            <div className="flex items-center gap-4 mb-4">
                {/* Difficulty selector */}
                <button
                    onClick={() => setShowDifficultyModal(true)}
                    className="px-4 py-2 text-sm text-gray-400 hover:text-white 
                       bg-gray-800 rounded-lg transition-colors flex items-center gap-2"
                >
                    <span>Difficulty:</span>
                    <span className="font-semibold text-white capitalize">{difficulty}</span>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {/* Sound toggle */}
                <button
                    onClick={handleToggleSound}
                    className="p-2 text-gray-400 hover:text-white bg-gray-800 rounded-lg transition-colors"
                    aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
                >
                    {soundEnabled ? (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M15.536 8.464a5 5 0 010 7.072M12 6l-4 4H4v4h4l4 4V6z" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                        </svg>
                    )}
                </button>
            </div>

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
