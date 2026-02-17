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
 * Premium game cell with refined gradients, glow effects, and critical-mass animation
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
    const isExploding = burstDots.length > 0;

    const colors = {
        R: {
            bg: 'radial-gradient(ellipse at 35% 35%, #ff6b6b 0%, #ef4444 40%, #b91c1c 100%)',
            glow: 'rgba(248, 113, 113, 0.45)',
            glowSubtle: 'rgba(248, 113, 113, 0.08)',
            ring: 'rgba(248, 113, 113, 0.25)',
        },
        B: {
            bg: 'radial-gradient(ellipse at 35% 35%, #7dd3fc 0%, #3b82f6 40%, #1d4ed8 100%)',
            glow: 'rgba(96, 165, 250, 0.45)',
            glowSubtle: 'rgba(96, 165, 250, 0.08)',
            ring: 'rgba(96, 165, 250, 0.25)',
        },
        N: {
            bg: 'radial-gradient(ellipse at 40% 40%, #283044 0%, #1a2236 60%, #111827 100%)',
            glow: 'transparent',
            glowSubtle: 'transparent',
            ring: 'rgba(255, 255, 255, 0.03)',
        },
    };

    const colorSet = colors[cell.color];
    const isOccupied = cell.color !== 'N';
    const isNearCritical = cell.value >= 3 && isOccupied;

    return (
        <motion.button
            aria-label={`Cell ${rowIndex}, ${colIndex}`}
            onClick={onClick}
            disabled={disabled}
            className={`
                relative
                rounded-xl
                h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 lg:h-[4.5rem] lg:w-[4.5rem]
                ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent
                overflow-visible game-no-select
            `}
            whileHover={!disabled ? { brightness: 1.15 } : {}}
            whileTap={!disabled ? { scale: 0.93 } : {}}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
        >
            <div className="relative flex justify-center items-center w-full h-full">
                {/* Cell background with refined styling */}
                <motion.div
                    className="absolute inset-0.5 rounded-[0.625rem]"
                    initial={false}
                    animate={{
                        boxShadow: isOccupied
                            ? `0 0 ${isNearCritical ? '18px' : '10px'} ${colorSet.glow}, inset 0 1px 0 rgba(255,255,255,0.08)`
                            : 'inset 0 2px 4px rgba(0,0,0,0.3), inset 0 -1px 0 rgba(255,255,255,0.03)',
                    }}
                    style={{
                        background: colorSet.bg,
                        border: `1px solid ${isOccupied ? colorSet.ring : 'rgba(255,255,255,0.04)'}`,
                    }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                />

                {/* Critical mass pulse */}
                <AnimatePresence>
                    {isNearCritical && (
                        <motion.div
                            className="absolute inset-0 rounded-xl pointer-events-none"
                            initial={{ opacity: 0 }}
                            animate={{
                                opacity: [0.2, 0.5, 0.2],
                                scale: [1, 1.08, 1],
                            }}
                            exit={{ opacity: 0 }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: 'easeInOut',
                            }}
                            style={{
                                background: `radial-gradient(circle, transparent 40%, ${colorSet.glow} 100%)`,
                            }}
                        />
                    )}
                </AnimatePresence>

                {/* Dot pattern */}
                <motion.div
                    className="relative z-10 w-full h-full"
                    animate={{ scale: isExploding ? 0 : 1 }}
                    transition={{ duration: 0.15 }}
                >
                    <CellDots value={cell.value} />
                </motion.div>

                {/* Explosion ring */}
                <ExplosionRing
                    isExploding={isExploding}
                    color={cell.color === 'N' ? 'B' : cell.color}
                />

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
