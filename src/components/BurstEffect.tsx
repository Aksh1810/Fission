'use client';

import { motion } from 'framer-motion';
import { Direction, Player } from '@/core/types';

interface BurstEffectProps {
    direction: Direction;
    color: Player;
    onComplete: () => void;
}

/**
 * Enhanced burst effect with particle trail and glow
 */
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
            main: 'rgb(239, 68, 68)',
            glow: 'rgba(239, 68, 68, 0.6)',
            trail: 'rgba(239, 68, 68, 0.3)',
        },
        B: {
            main: 'rgb(59, 130, 246)',
            glow: 'rgba(59, 130, 246, 0.6)',
            trail: 'rgba(59, 130, 246, 0.3)',
        },
    };

    const colorSet = colors[color];

    return (
        <>
            {/* Trail effect */}
            <motion.div
                className="absolute w-2 h-2 sm:w-3 sm:h-3 rounded-full pointer-events-none"
                style={{
                    background: colorSet.trail,
                    filter: 'blur(4px)',
                }}
                initial={{ x: 0, y: 0, opacity: 0.8, scale: 1 }}
                animate={{
                    x: target.x * 0.6,
                    y: target.y * 0.6,
                    opacity: 0,
                    scale: 0.3,
                }}
                transition={{
                    duration: 0.25,
                    ease: 'easeOut',
                }}
            />

            {/* Main burst dot with glow */}
            <motion.div
                className="absolute w-3 h-3 sm:w-4 sm:h-4 rounded-full z-50 pointer-events-none"
                style={{
                    background: `radial-gradient(circle at 30% 30%, white, ${colorSet.main})`,
                    boxShadow: `0 0 12px ${colorSet.glow}, 0 0 24px ${colorSet.trail}`,
                }}
                initial={{
                    x: 0,
                    y: 0,
                    opacity: 1,
                    scale: 1.8,
                }}
                animate={{
                    x: target.x,
                    y: target.y,
                    opacity: 0,
                    scale: 0.4,
                }}
                transition={{
                    duration: 0.35,
                    ease: [0.25, 0.46, 0.45, 0.94], // Smooth easeOutQuad
                }}
                onAnimationComplete={onComplete}
            />

            {/* Sparkle particles */}
            {[0, 1, 2].map((i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 rounded-full pointer-events-none"
                    style={{
                        background: 'white',
                        boxShadow: `0 0 4px ${colorSet.main}`,
                    }}
                    initial={{
                        x: 0,
                        y: 0,
                        opacity: 0.9,
                        scale: 1,
                    }}
                    animate={{
                        x: target.x * (0.3 + i * 0.25) + (i - 1) * 8,
                        y: target.y * (0.3 + i * 0.25) + (i - 1) * 8,
                        opacity: 0,
                        scale: 0,
                    }}
                    transition={{
                        duration: 0.3,
                        delay: i * 0.03,
                        ease: 'easeOut',
                    }}
                />
            ))}
        </>
    );
}
