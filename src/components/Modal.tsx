'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface ModalProps {
    isOpen: boolean;
    title: string;
    children: ReactNode;
    onClose?: () => void;
    showCloseButton?: boolean;
}

export function Modal({
    isOpen,
    title,
    children,
    onClose,
    showCloseButton = true,
}: ModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        className="fixed inset-0 z-40"
                        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    <motion.div
                        className="fixed inset-0 flex items-center justify-center z-50 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="glass-strong rounded-3xl p-6 sm:p-8 w-full max-w-md relative overflow-hidden"
                            initial={{ scale: 0.9, y: 40, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.95, y: 20, opacity: 0 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div
                                className="absolute top-0 left-0 right-0 h-[2px]"
                                style={{ background: 'linear-gradient(90deg, var(--blue), var(--purple), var(--red))' }}
                            />

                            <div className="flex items-center justify-between mb-5">
                                <h2 className="text-2xl font-bold text-white">{title}</h2>
                                {showCloseButton && onClose && (
                                    <button
                                        onClick={onClose}
                                        className="text-slate-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/5"
                                        aria-label="Close modal"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>

                            <div className="text-slate-300">
                                {children}
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

interface GameOverModalProps {
    isOpen: boolean;
    winner: 'R' | 'B' | null;
    turns: number;
    isPlayerWinner: boolean;
    onRematch: () => void;
    onMainMenu: () => void;
    isLoading?: boolean;
}

export function GameOverModal({
    isOpen,
    winner,
    turns,
    isPlayerWinner,
    onRematch,
    onMainMenu,
    isLoading = false,
}: GameOverModalProps) {
    const title = isPlayerWinner ? 'Victory!' : 'Defeat';
    const emoji = isPlayerWinner ? '🏆' : '💀';
    const winnerColor = winner === 'B' ? 'Blue' : 'Red';
    const accentGradient = isPlayerWinner
        ? 'linear-gradient(135deg, #3b82f6, #60a5fa)'
        : 'linear-gradient(135deg, #ef4444, #f87171)';

    return (
        <Modal isOpen={isOpen} title="" showCloseButton={false}>
            <motion.div
                className="text-center mb-2"
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.15 }}
            >
                <span className="text-5xl">{emoji}</span>
            </motion.div>

            <motion.h3
                className="text-3xl font-black text-center mb-2"
                style={{
                    background: accentGradient,
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    color: 'transparent',
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                {title}
            </motion.h3>

            <motion.p
                className="text-center text-slate-400 text-sm mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                {isPlayerWinner
                    ? `You won as ${winnerColor} in ${turns} turns`
                    : `${winnerColor} wins after ${turns} turns`
                }
            </motion.p>

            <motion.div
                className="flex flex-col gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
            >
                <motion.button
                    onClick={onRematch}
                    disabled={isLoading}
                    className="w-full py-3.5 px-4 text-white font-semibold rounded-xl transition-colors relative overflow-hidden"
                    style={{ background: accentGradient }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <span className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
                    <span className="relative">{isLoading ? 'Loading...' : 'Rematch'}</span>
                </motion.button>

                <motion.button
                    onClick={onMainMenu}
                    className="w-full py-3 px-4 text-slate-300 font-medium rounded-xl 
                        bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.06] transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    Main Menu
                </motion.button>
            </motion.div>
        </Modal>
    );
}

interface DifficultyModalProps {
    isOpen: boolean;
    currentDifficulty: string;
    onSelect: (difficulty: 'easy' | 'medium' | 'hard') => void;
    onClose: () => void;
}

export function DifficultyModal({
    isOpen,
    currentDifficulty,
    onSelect,
    onClose,
}: DifficultyModalProps) {
    const difficulties = [
        { id: 'easy' as const, label: 'Easy', description: 'AI thinks 2 moves ahead', color: '#4ade80', dotColor: 'bg-green-400' },
        { id: 'medium' as const, label: 'Medium', description: 'AI thinks 4 moves ahead', color: '#fbbf24', dotColor: 'bg-yellow-400' },
        { id: 'hard' as const, label: 'Hard', description: 'AI thinks 6 moves ahead', color: '#f87171', dotColor: 'bg-red-400' },
    ];

    return (
        <Modal isOpen={isOpen} title="Select Difficulty" onClose={onClose}>
            <div className="flex flex-col gap-3">
                {difficulties.map((diff) => {
                    const isActive = currentDifficulty === diff.id;
                    return (
                        <motion.button
                            key={diff.id}
                            onClick={() => onSelect(diff.id)}
                            className={`w-full py-4 px-4 rounded-xl text-left transition-all duration-200 border ${isActive
                                ? 'border-white/15 bg-white/[0.06]'
                                : 'border-transparent bg-white/[0.02] hover:bg-white/[0.05]'
                                }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-2.5 h-2.5 rounded-full ${diff.dotColor} ${isActive ? 'ring-2 ring-offset-1 ring-offset-transparent' : ''}`}
                                    style={isActive ? { boxShadow: `0 0 8px ${diff.color}` } : {}} />
                                <div>
                                    <div className="font-semibold text-white text-sm">{diff.label}</div>
                                    <div className="text-xs text-slate-500">{diff.description}</div>
                                </div>
                                {isActive && (
                                    <svg className="w-4 h-4 text-white/60 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                                    </svg>
                                )}
                            </div>
                        </motion.button>
                    );
                })}
            </div>
        </Modal>
    );
}
