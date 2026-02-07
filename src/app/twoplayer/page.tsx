'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useGame, useAudio } from '@/hooks';
import { GameBoard, ColorBar, Navigation, Modal } from '@/components';
import { motion } from 'framer-motion';

export default function TwoPlayer() {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const [soundEnabled, setSoundEnabled] = useState(true);

    const { initAudio, playClick, playExplosion, toggleSound } = useAudio();

    const {
        gameState,
        burstDots,
        isProcessing,
        displayedTurn,
        handleCellClick: originalHandleCellClick,
        removeBurst,
        resetGame,
    } = useGame({
        mode: 'twoplayer',
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

    useEffect(() => {
        setIsClient(true);
    }, []);

    const handleToggleSound = async () => {
        await initAudio();
        const newState = toggleSound();
        setSoundEnabled(newState);
    };

    if (!isClient) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <div className="text-gray-400">Loading...</div>
            </main>
        );
    }

    const isGameOver = gameState.status === 'game_over';
    const isDisabled = isProcessing || isGameOver;
    const winnerColor = gameState.winner === 'B' ? 'Blue' : 'Red';

    return (
        <main className="min-h-screen flex flex-col items-center pt-8 pb-16 px-4">
            <Navigation />

            {/* Sound toggle */}
            <div className="mb-4">
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
                        : `${gameState.currentPlayer === 'B' ? 'Blue' : 'Red'}'s Turn`
                    }
                </p>
            </div>

            {/* Game Over Modal */}
            <Modal
                isOpen={isGameOver}
                title={`${winnerColor} Wins!`}
                showCloseButton={false}
            >
                <p className="text-center mb-6">
                    {winnerColor} has won the game in {displayedTurn} turns!
                </p>

                <div className="flex flex-col gap-3">
                    <motion.button
                        onClick={resetGame}
                        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 
                           text-white font-semibold rounded-lg transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Rematch
                    </motion.button>

                    <motion.button
                        onClick={() => router.push('/')}
                        className="w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 
                           text-white font-semibold rounded-lg transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Main Menu
                    </motion.button>
                </div>
            </Modal>
        </main>
    );
}
