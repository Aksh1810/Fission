'use client';

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

/**
 * Game board component - renders the grid of cells
 */
export function GameBoard({
    grid,
    onCellClick,
    disabled,
    burstDots,
    onBurstComplete,
}: GameBoardProps) {
    const size = grid.length;

    return (
        <div
            className={`grid gap-2 sm:gap-2.5 md:gap-3 lg:gap-4`}
            style={{
                gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
            }}
        >
            {grid.map((row, rowIndex) =>
                row.map((cell, colIndex) => {
                    // Filter burst dots for this cell
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
    );
}
