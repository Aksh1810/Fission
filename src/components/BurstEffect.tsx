'use client';

import { motion } from 'framer-motion';
import { Direction, Player } from '@/core/types';

interface BurstEffectProps {
    direction: Direction;
    color: Player;
    onComplete: () => void;
}

export function BurstEffect({ direction, color, onComplete }: BurstEffectProps) {
    const displacement = 65;

    const getTargetPosition = () => {
        switch (direction) {
            case 'up': return { x: 0, y: -displacement };
            case 'down': return { x: 0, y: displacement };
            case 'left': return { x: -displacement, y: 0 };
            case 'right': return { x: displacement, y: 0 };
        }
    };

    const target = getTargetPosition();

    const colors = {
        R: {
            main: '#f87171',
            bright: '#fca5a5',
            glow: 'rgba(248, 113, 113, 0.7)',
            trail: 'rgba(248, 113, 113, 0.35)',
        },
        B: {
            main: '#60a5fa',
            bright: '#93c5fd',
            glow: 'rgba(96, 165, 250, 0.7)',
            trail: 'rgba(96, 165, 250, 0.35)',
        },
    };

    const colorSet = colors[color];

    return (
        <>
            <motion.div
                className="absolute w-3 h-3 sm:w-4 sm:h-4 rounded-full pointer-events-none"
                style={{
                    background: colorSet.trail,
                    filter: 'blur(6px)',
                }}
                initial={{ x: 0, y: 0, opacity: 0.9, scale: 1 }}
                animate={{
                    x: target.x * 0.5,
                    y: target.y * 0.5,
                    opacity: 0,
                    scale: 0.2,
                }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
            />

            <motion.div
                className="absolute w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full z-50 pointer-events-none"
                style={{
                    background: `radial-gradient(circle at 35% 35%, white, ${colorSet.bright}, ${colorSet.main})`,
                    boxShadow: `0 0 16px ${colorSet.glow}, 0 0 32px ${colorSet.trail}`,
                }}
                initial={{ x: 0, y: 0, opacity: 1, scale: 1.6 }}
                animate={{
                    x: target.x,
                    y: target.y,
                    opacity: 0,
                    scale: 0.3,
                }}
                transition={{
                    duration: 0.32,
                    ease: [0.25, 0.46, 0.45, 0.94],
                }}
                onAnimationComplete={onComplete}
            />

            {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full pointer-events-none"
                    style={{
                        background: i < 2 ? 'white' : colorSet.bright,
                        boxShadow: `0 0 4px ${colorSet.main}`,
                    }}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                    animate={{
                        x: target.x * (0.2 + i * 0.18) + (i - 2) * 6,
                        y: target.y * (0.2 + i * 0.18) + (i - 2) * 6,
                        opacity: 0,
                        scale: 0,
                    }}
                    transition={{
                        duration: 0.28,
                        delay: i * 0.02,
                        ease: 'easeOut',
                    }}
                />
            ))}
        </>
    );
}
