'use client';

import { motion } from 'framer-motion';
import { ColorCount } from '@/core/types';

interface ColorBarProps {
    colorCount: ColorCount;
    turn: number;
}

/**
 * Premium color bar with glass container, gradient fills, and animated counts
 */
export function ColorBar({ colorCount, turn }: ColorBarProps) {
    const total = colorCount.R + colorCount.B;

    const bluePercent = total === 0 ? 50 : (colorCount.B / total) * 100;
    const redPercent = total === 0 ? 50 : (colorCount.R / total) * 100;

    return (
        <div className="w-full max-w-md mx-auto mt-5">
            <div className="hud-bar">
                {/* Score labels */}
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'linear-gradient(135deg, #60a5fa, #3b82f6)' }} />
                        <motion.span
                            key={colorCount.B}
                            className="text-sm font-semibold text-blue-400 tabular-nums"
                            initial={{ scale: 1.3, opacity: 0.5 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                        >
                            {colorCount.B}
                        </motion.span>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/[0.04]">
                        <span className="text-[11px] text-slate-500 uppercase tracking-wider font-medium">Turn</span>
                        <motion.span
                            key={turn}
                            className="text-xs font-bold text-slate-300 tabular-nums"
                            initial={{ y: -8, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        >
                            {turn}
                        </motion.span>
                    </div>

                    <div className="flex items-center gap-2">
                        <motion.span
                            key={colorCount.R}
                            className="text-sm font-semibold text-red-400 tabular-nums"
                            initial={{ scale: 1.3, opacity: 0.5 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                        >
                            {colorCount.R}
                        </motion.span>
                        <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'linear-gradient(135deg, #f87171, #ef4444)' }} />
                    </div>
                </div>

                {/* Progress bar */}
                <div className="flex h-2.5 rounded-full overflow-hidden bg-white/[0.04]">
                    <motion.div
                        className="relative"
                        style={{
                            background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
                            boxShadow: '0 0 12px rgba(96,165,250,0.3)',
                        }}
                        initial={false}
                        animate={{ width: `${bluePercent}%` }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                        {/* Shine effect */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                    </motion.div>
                    <motion.div
                        className="relative"
                        style={{
                            background: 'linear-gradient(90deg, #ef4444, #f87171)',
                            boxShadow: '0 0 12px rgba(248,113,113,0.3)',
                        }}
                        initial={false}
                        animate={{ width: `${redPercent}%` }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
