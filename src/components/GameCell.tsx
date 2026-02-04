'use client';

import { motion } from 'framer-motion';
import { Cell as CellType, Direction, Player } from '@/core/types';
import { CellDots } from './CellDots';
import { BurstEffect } from './BurstEffect';

interface BurstDot {
    id: number;
    direction: Direction;
    color: Player;
}

interface CellProps {
    cell: CellType;
    rowIndex: number;
    colIndex: number;
    onClick: () => void;
    disabled: boolean;
    burstDots: BurstDot[];
    onBurstComplete: (id: number) => void;
}

/**
 * Individual cell component with animations
 */
export function GameCell({
    cell,
    rowIndex,
    colIndex,
    onClick,
    disabled,
    burstDots,
    onBurstComplete,
}: CellProps) {
    const getBgColor = () => {
        switch (cell.color) {
            case 'R': return 'bg-red-500';
            case 'B': return 'bg-blue-500';
            case 'N': return 'bg-gray-700';
        }
    };

    return (
        <motion.button
            aria-label={`Cell ${rowIndex}, ${colIndex}`}
            onClick={onClick}
            disabled={disabled}
            className={`
        relative p-1 sm:p-1.5 md:p-2
        rounded-xl bg-gray-800
        h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 lg:h-20 lg:w-20
        ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
        transition-transform active:scale-95
        focus:outline-none focus:ring-2 focus:ring-white/50
      `}
            whileHover={!disabled ? { scale: 1.05 } : {}}
            whileTap={!disabled ? { scale: 0.95 } : {}}
        >
            <div className="relative flex justify-center items-center w-full h-full">
                {/* Cell background circle */}
                <motion.div
                    className={`absolute inset-1 rounded-full ${getBgColor()}`}
                    initial={false}
                    animate={{
                        backgroundColor: cell.color === 'R'
                            ? 'rgb(239 68 68)'
                            : cell.color === 'B'
                                ? 'rgb(59 130 246)'
                                : 'rgb(55 65 81)',
                    }}
                    transition={{ duration: 0.2 }}
                />

                {/* Dot pattern */}
                <CellDots value={cell.value} />

                {/* Burst animations */}
                {burstDots.map((burst) => (
                    <BurstEffect
                        key={burst.id}
                        direction={burst.direction}
                        color={burst.color}
                        onComplete={() => onBurstComplete(burst.id)}
                    />
                ))}
            </div>
        </motion.button>
    );
}
