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

/**
 * Reusable modal component with animations
 */
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
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        className="fixed inset-0 flex items-center justify-center z-50 p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-gray-800 rounded-2xl shadow-2xl p-6 sm:p-8 w-full max-w-md"
                            initial={{ scale: 0.9, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 50 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold text-white">{title}</h2>
                                {showCloseButton && onClose && (
                                    <button
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-white transition-colors p-1"
                                        aria-label="Close modal"
                                    >
                                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}
                            </div>

                            {/* Content */}
                            <div className="text-gray-300">
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

/**
 * Game over modal with win/lose messaging
 */
export function GameOverModal({
    isOpen,
    winner,
    turns,
    isPlayerWinner,
    onRematch,
    onMainMenu,
    isLoading = false,
}: GameOverModalProps) {
    const title = isPlayerWinner ? '🎉 You Win!' : 'You Lose!';
    const winnerColor = winner === 'B' ? 'Blue' : 'Red';

    return (
        <Modal isOpen={isOpen} title={title} showCloseButton={false}>
            <p className="text-center mb-6">
                {isPlayerWinner
                    ? `Congratulations! You won as ${winnerColor} in ${turns} turns.`
                    : `${winnerColor} wins after ${turns} turns. Better luck next time!`
                }
            </p>

            <div className="flex flex-col gap-3">
                <motion.button
                    onClick={onRematch}
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 
                     text-white font-semibold rounded-lg transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {isLoading ? 'Loading...' : 'Rematch'}
                </motion.button>

                <motion.button
                    onClick={onMainMenu}
                    className="w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 
                     text-white font-semibold rounded-lg transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    Main Menu
                </motion.button>
            </div>
        </Modal>
    );
}

interface DifficultyModalProps {
    isOpen: boolean;
    currentDifficulty: string;
    onSelect: (difficulty: 'easy' | 'medium' | 'hard') => void;
    onClose: () => void;
}

/**
 * Difficulty selection modal
 */
export function DifficultyModal({
    isOpen,
    currentDifficulty,
    onSelect,
    onClose,
}: DifficultyModalProps) {
    const difficulties = [
        { id: 'easy' as const, label: 'Easy', description: 'AI thinks 2 moves ahead' },
        { id: 'medium' as const, label: 'Medium', description: 'AI thinks 4 moves ahead' },
        { id: 'hard' as const, label: 'Hard', description: 'AI thinks 6 moves ahead' },
    ];

    return (
        <Modal isOpen={isOpen} title="Select Difficulty" onClose={onClose}>
            <div className="flex flex-col gap-3">
                {difficulties.map((diff) => (
                    <motion.button
                        key={diff.id}
                        onClick={() => onSelect(diff.id)}
                        className={`w-full py-4 px-4 rounded-lg text-left transition-colors
              ${currentDifficulty === diff.id
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                            }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className="font-semibold">{diff.label}</div>
                        <div className="text-sm opacity-75">{diff.description}</div>
                    </motion.button>
                ))}
            </div>
        </Modal>
    );
}
