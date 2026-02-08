'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Cell as CellType, Direction, Player } from '@/core/types';
import { CellDots } from './CellDots';
import { BurstEffect } from './BurstEffect';
import { ExplosionRing } from './ExplosionRing';


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
 * Individual cell component with enhanced animations and explosion effects
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
    // Explosion is happening when there are burst dots from this cell
    const isExploding = burstDots.length > 0;


    const colors = {
        R: {
            bg: 'rgb(239, 68, 68)',
            glow: 'rgba(239, 68, 68, 0.4)',
        },
        B: {
            bg: 'rgb(59, 130, 246)',
            glow: 'rgba(59, 130, 246, 0.4)',
        },
        N: {
            bg: 'rgb(55, 65, 81)',
            glow: 'transparent',
        },
    };

    const colorSet = colors[cell.color];

    // Increased glow when near critical mass
    const isNearCritical = cell.value >= 3 && cell.color !== 'N';
    const pulseGlow = isNearCritical ? `0 0 20px ${colorSet.glow}` : 'none';

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
                focus:outline-none focus:ring-2 focus:ring-white/50
                overflow-visible
            `}
            whileHover={!disabled ? { scale: 1.08 } : {}}
            whileTap={!disabled ? { scale: 0.92 } : {}}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        >
            <div className="relative flex justify-center items-center w-full h-full">
                {/* Cell background circle with glow */}
                <motion.div
                    className="absolute inset-1 rounded-full"
                    initial={false}
                    animate={{
                        backgroundColor: colorSet.bg,
                        boxShadow: pulseGlow,
                    }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                />

                {/* Pulse animation for cells near critical mass */}
                <AnimatePresence>
                    {isNearCritical && (
                        <motion.div
                            className="absolute inset-1 rounded-full pointer-events-none"
                            initial={{ opacity: 0, scale: 1 }}
                            animate={{
                                opacity: [0.3, 0.6, 0.3],
                                scale: [1, 1.05, 1],
                            }}
                            exit={{ opacity: 0 }}
                            transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                            style={{
                                background: `radial-gradient(circle, transparent 50%, ${colorSet.glow} 100%)`,
                            }}
                        />
                    )}
                </AnimatePresence>

                {/* Dot pattern with smooth transitions */}
                <motion.div
                    className="relative z-10 w-full h-full"
                    animate={{ scale: isExploding ? 0 : 1 }}
                    transition={{ duration: 0.15 }}
                >
                    <CellDots value={cell.value} />
                </motion.div>

                {/* Explosion ring effect */}
                <ExplosionRing
                    isExploding={isExploding}
                    color={cell.color === 'N' ? 'B' : cell.color}
                />

                {/* Burst animations flying outward */}
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
