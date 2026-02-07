'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Player } from '@/core/types';

interface ExplosionRingProps {
    isExploding: boolean;
    color: Player;
    onComplete?: () => void;
}

/**
 * Expanding ring effect when a cell explodes
 */
export function ExplosionRing({ isExploding, color, onComplete }: ExplosionRingProps) {
    const ringColor = color === 'R'
        ? 'rgba(239, 68, 68, 0.8)'
        : 'rgba(59, 130, 246, 0.8)';

    return (
        <AnimatePresence>
            {isExploding && (
                <>
                    {/* Primary expanding ring */}
                    <motion.div
                        className="absolute inset-0 rounded-full pointer-events-none"
                        style={{
                            border: `3px solid ${ringColor}`,
                            boxShadow: `0 0 20px ${ringColor}`,
                        }}
                        initial={{ scale: 0.5, opacity: 1 }}
                        animate={{ scale: 2.5, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{
                            duration: 0.4,
                            ease: [0.25, 0.1, 0.25, 1],
                        }}
                        onAnimationComplete={onComplete}
                    />

                    {/* Secondary ring for depth */}
                    <motion.div
                        className="absolute inset-0 rounded-full pointer-events-none"
                        style={{
                            border: `2px solid ${ringColor}`,
                        }}
                        initial={{ scale: 0.8, opacity: 0.6 }}
                        animate={{ scale: 2, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{
                            duration: 0.35,
                            delay: 0.05,
                            ease: 'easeOut',
                        }}
                    />

                    {/* Center flash */}
                    <motion.div
                        className="absolute inset-2 rounded-full pointer-events-none"
                        style={{
                            background: `radial-gradient(circle, white 0%, ${ringColor} 50%, transparent 100%)`,
                        }}
                        initial={{ opacity: 1, scale: 1 }}
                        animate={{ opacity: 0, scale: 1.5 }}
                        exit={{ opacity: 0 }}
                        transition={{
                            duration: 0.2,
                            ease: 'easeOut',
                        }}
                    />
                </>
            )}
        </AnimatePresence>
    );
}
