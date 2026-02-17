'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useGame, useAudio } from '@/hooks';
import { GameBoard, ColorBar, Navigation, Modal } from '@/components';

const pageVariants = {
    hidden: { opacity: 0, y: 12 },
    show: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
    },
};

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
    }, []);

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
    const isDisabled = isProcessing || isGameOver;
    const winnerColor = gameState.winner === 'B' ? 'Blue' : 'Red';
    const turnColor = gameState.currentPlayer === 'B' ? 'text-blue-400' : 'text-red-400';
    const turnPlayerName = gameState.currentPlayer === 'B' ? 'Blue' : 'Red';

    return (
        <motion.main
            className="min-h-screen flex flex-col items-center pt-6 pb-16 px-4 game-no-select"
            variants={pageVariants}
            initial="hidden"
            animate="show"
        >
            <Navigation />

            {/* Unified HUD Bar */}
            <div className="hud-bar flex items-center gap-3 mb-5">
                {/* Turn Indicator */}
                <div className="flex items-center gap-2 px-2">
                    <div className={`w-2 h-2 rounded-full ${gameState.currentPlayer === 'B' ? 'bg-blue-400' : 'bg-red-400'}`}
                        style={{ boxShadow: `0 0 6px ${gameState.currentPlayer === 'B' ? 'rgba(96,165,250,0.5)' : 'rgba(248,113,113,0.5)'}` }}
                    />
                    <span className={`text-xs font-semibold ${turnColor}`}>
                        {isProcessing ? 'Processing...' : `${turnPlayerName}'s Turn`}
                    </span>
                </div>

                {/* Divider */}
                <div className="w-px h-4 bg-white/[0.06]" />

                {/* Sound toggle */}
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

            {/* Game Board */}
            <GameBoard
                grid={gameState.grid}
                onCellClick={handleCellClick}
                disabled={isDisabled}
                burstDots={burstDots}
                onBurstComplete={removeBurst}
            />

            {/* Color Bar */}
            <ColorBar colorCount={gameState.colorCount} turn={displayedTurn} />

            {/* Game Over Modal */}
            <Modal
                isOpen={isGameOver}
                title=""
                showCloseButton={false}
            >
                {/* Trophy */}
                <motion.div
                    className="text-center mb-2"
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.15 }}
                >
                    <span className="text-5xl">🏆</span>
                </motion.div>

                <motion.h3
                    className="text-3xl font-black text-center mb-2"
                    style={{
                        background: gameState.winner === 'B'
                            ? 'linear-gradient(135deg, #3b82f6, #60a5fa)'
                            : 'linear-gradient(135deg, #ef4444, #f87171)',
                        WebkitBackgroundClip: 'text',
                        backgroundClip: 'text',
                        color: 'transparent',
                    }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    {winnerColor} Wins!
                </motion.h3>

                <motion.p
                    className="text-center text-slate-400 text-sm mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    Victory achieved in {displayedTurn} turns
                </motion.p>

                <motion.div
                    className="flex flex-col gap-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                >
                    <motion.button
                        onClick={resetGame}
                        className="w-full py-3.5 px-4 text-white font-semibold rounded-xl relative overflow-hidden"
                        style={{
                            background: gameState.winner === 'B'
                                ? 'linear-gradient(135deg, #3b82f6, #60a5fa)'
                                : 'linear-gradient(135deg, #ef4444, #f87171)',
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <span className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                        <span className="relative">Rematch</span>
                    </motion.button>

                    <motion.button
                        onClick={() => router.push('/')}
                        className="w-full py-3 px-4 text-slate-300 font-medium rounded-xl 
                            bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Main Menu
                    </motion.button>
                </motion.div>
            </Modal>
        </motion.main>
    );
}
