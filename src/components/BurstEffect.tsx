'use client';

import { motion } from 'framer-motion';
import { Direction, Player } from '@/core/types';

interface BurstEffectProps {
    direction: Direction;
    color: Player;
    onComplete: () => void;
}

/**
 * Animated burst dot that flies in a direction during explosions
 */
export function BurstEffect({ direction, color, onComplete }: BurstEffectProps) {
    // Calculate displacement based on direction
    const displacement = 60; // pixels

    const getTargetPosition = () => {
        switch (direction) {
            case 'up': return { x: 0, y: -displacement };
            case 'down': return { x: 0, y: displacement };
            case 'left': return { x: -displacement, y: 0 };
            case 'right': return { x: displacement, y: 0 };
        }
    };

    const target = getTargetPosition();
    const bgColor = color === 'R' ? 'bg-red-500' : 'bg-blue-500';

    return (
        <motion.div
            className={`absolute w-3 h-3 sm:w-4 sm:h-4 rounded-full ${bgColor} z-50 pointer-events-none shadow-lg`}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1.5 }}
            animate={{
                x: target.x,
                y: target.y,
                opacity: 0.3,
                scale: 0.5
            }}
            transition={{
                duration: 0.35,
                ease: 'easeOut'
            }}
            onAnimationComplete={onComplete}
        />
    );
}
