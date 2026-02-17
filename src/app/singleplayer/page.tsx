'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useGame, useAudio } from '@/hooks';
import { GameBoard, ColorBar, Navigation, GameOverModal, DifficultyModal } from '@/components';
import { Difficulty } from '@/core/types';

const pageVariants = {
    hidden: { opacity: 0, y: 12 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
    },
};

export default function SinglePlayer() {
    const router = useRouter();
    const [difficulty, setDifficulty] = useState<Difficulty>('medium');
    const [showDifficultyModal, setShowDifficultyModal] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);

    const { initAudio, playClick, playExplosion, toggleSound } = useAudio();

    // AI goes first in Medium/Hard modes for balanced gameplay
    const playerColor = difficulty === 'easy' ? 'B' : 'R';

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
        playerColor,
    });

    const handleCellClick = useCallback(async (row: number, col: number) => {
        await initAudio();
        playClick();
        originalHandleCellClick(row, col);
    }, [initAudio, playClick, originalHandleCellClick]);

    useEffect(() => {
        if (burstDots.length > 0) {
            playExplosion();
        }
    }, [burstDots.length, playExplosion]);

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

    if (!isClient) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <div className="text-slate-500 text-sm">Loading...</div>
            </main>
        );
    }

    const isGameOver = gameState.status === 'game_over';
    const isPlayerWinner = gameState.winner === playerColor;
    const isDisabled = isProcessing || isAiTurn || isGameOver;

    const turnColor = gameState.currentPlayer === 'B' ? 'text-blue-400' : 'text-red-400';
    const turnText = isProcessing
        ? 'Processing...'
        : isAiTurn
            ? 'AI is thinking'
            : 'Your Turn';

    return (
        <motion.main
            className="min-h-screen flex flex-col items-center pt-6 pb-16 px-4 game-no-select"
            variants={pageVariants}
            initial="hidden"
            animate="show"
        >
            <Navigation />

            <div className="hud-bar flex items-center gap-3 mb-5">
                <button
                    onClick={() => setShowDifficultyModal(true)}
                    className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-200 transition-colors px-2 py-1 rounded-lg hover:bg-white/[0.04]"
                >
                    <span className={`w-2 h-2 rounded-full ${difficulty === 'easy' ? 'bg-green-400' :
                        difficulty === 'medium' ? 'bg-yellow-400' : 'bg-red-400'
                        }`} />
                    <span className="font-medium text-white capitalize text-xs">{difficulty}</span>
                    <svg className="w-3 h-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                <div className="w-px h-4 bg-white/[0.06]" />

                <div className="flex items-center gap-2 px-2">
                    {isAiTurn ? (
                        <motion.div
                            className="flex gap-0.5"
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
                        >
                            {[0, 1, 2].map(i => (
                                <div key={i} className="w-1 h-1 rounded-full bg-blue-400" />
                            ))}
                        </motion.div>
                    ) : (
                        <div className={`w-2 h-2 rounded-full ${gameState.currentPlayer === 'B' ? 'bg-blue-400' : 'bg-red-400'}`}
                            style={{ boxShadow: `0 0 6px ${gameState.currentPlayer === 'B' ? 'rgba(96,165,250,0.5)' : 'rgba(248,113,113,0.5)'}` }}
                        />
                    )}
                    <span className={`text-xs font-semibold ${turnColor}`}>{turnText}</span>
                </div>

                <div className="w-px h-4 bg-white/[0.06]" />

                <button
                    onClick={handleToggleSound}
                    className="p-1.5 text-slate-500 hover:text-slate-200 rounded-lg hover:bg-white/[0.04] transition-colors"
                    aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
                >
                    {soundEnabled ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072M12 6l-4 4H4v4h4l4 4V6z" />
                        </svg>
                    ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                        </svg>
                    )}
                </button>
            </div>

            <GameBoard
                grid={gameState.grid}
                onCellClick={handleCellClick}
                disabled={isDisabled}
                burstDots={burstDots}
                onBurstComplete={removeBurst}
            />

            <ColorBar colorCount={gameState.colorCount} turn={displayedTurn} />

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
                onRematch={resetGame}
                onMainMenu={() => router.push('/')}
            />
        </motion.main>
    );
}
