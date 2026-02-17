'use client';

import { motion } from 'framer-motion';
import { Cell, Direction, Player } from '@/core/types';
import { GameCell } from './GameCell';

interface BurstDot {
    id: number;
    row: number;
    col: number;
    direction: Direction;
    color: Player;
}

interface GameBoardProps {
    grid: readonly (readonly Cell[])[];
    onCellClick: (row: number, col: number) => void;
    disabled: boolean;
    burstDots: BurstDot[];
    onBurstComplete: (id: number) => void;
}

export function GameBoard({
    grid,
    onCellClick,
    disabled,
    burstDots,
    onBurstComplete,
}: GameBoardProps) {
    const size = grid.length;

    return (
        <motion.div
            className="board-frame"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
            }}
        >
            <div
                className="grid gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3"
                style={{
                    gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
                }}
            >
                {grid.map((row, rowIndex) =>
                    row.map((cell, colIndex) => {
                        const cellBursts = burstDots
                            .filter(b => b.row === rowIndex && b.col === colIndex)
                            .map(b => ({
                                id: b.id,
                                direction: b.direction,
                                color: b.color,
                            }));

                        return (
                            <GameCell
                                key={`${rowIndex}-${colIndex}`}
                                cell={cell}
                                rowIndex={rowIndex}
                                colIndex={colIndex}
                                onClick={() => onCellClick(rowIndex, colIndex)}
                                disabled={disabled}
                                burstDots={cellBursts}
                                onBurstComplete={onBurstComplete}
                            />
                        );
                    })
                )}
            </div>
        </motion.div>
    );
}
