'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useGame } from '@/hooks/useGame';
import { GameBoard, ColorBar, Navigation, Modal } from '@/components';
import { motion } from 'framer-motion';

export default function TwoPlayer() {
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);

    const {
        gameState,
        burstDots,
        isProcessing,
        displayedTurn,
        handleCellClick,
        removeBurst,
        resetGame,
    } = useGame({
        mode: 'twoplayer',
    });

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Don't render until client-side
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
