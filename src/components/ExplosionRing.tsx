'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Player } from '@/core/types';

interface ExplosionRingProps {
    isExploding: boolean;
    color: Player;
    onComplete?: () => void;
}

export function ExplosionRing({ isExploding, color, onComplete }: ExplosionRingProps) {
    const ringColor = color === 'R'
        ? 'rgba(248, 113, 113, 0.85)'
        : 'rgba(96, 165, 250, 0.85)';

    const flashColor = color === 'R'
        ? 'rgba(248, 113, 113, 0.6)'
        : 'rgba(96, 165, 250, 0.6)';

    return (
        <AnimatePresence>
            {isExploding && (
                <>
                    <motion.div
                        className="absolute inset-0 rounded-full pointer-events-none"
                        style={{
                            border: `2.5px solid ${ringColor}`,
                            boxShadow: `0 0 24px ${ringColor}, inset 0 0 12px ${ringColor}`,
                        }}
                        initial={{ scale: 0.5, opacity: 1 }}
                        animate={{ scale: 2.8, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.38, ease: [0.25, 0.1, 0.25, 1] }}
                        onAnimationComplete={onComplete}
                    />

                    <motion.div
                        className="absolute inset-0 rounded-full pointer-events-none"
                        style={{ border: `1.5px solid ${ringColor}` }}
                        initial={{ scale: 0.7, opacity: 0.5 }}
                        animate={{ scale: 2.2, opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.32, delay: 0.04, ease: 'easeOut' }}
                    />

                    <motion.div
                        className="absolute inset-1 rounded-full pointer-events-none"
                        style={{
                            background: `radial-gradient(circle, rgba(255,255,255,0.9) 0%, ${flashColor} 40%, transparent 80%)`,
                        }}
                        initial={{ opacity: 1, scale: 0.8 }}
                        animate={{ opacity: 0, scale: 1.6 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                    />
                </>
            )}
        </AnimatePresence>
    );
}
