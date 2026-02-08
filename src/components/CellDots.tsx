'use client';

import { motion } from 'framer-motion';

interface CellDotsProps {
    value: number;
}

/**
 * Renders the dot pattern inside a cell
 * 1 dot = center, 2 dots = left/right, 3 dots = triangle, 4 dots = corners
 */
export function CellDots({ value }: CellDotsProps) {
    if (value === 0) return null;

    const dotClass = "w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 lg:w-4 lg:h-4 rounded-full bg-slate-900 shadow-[0_0_4px_rgba(0,0,0,0.8)]";

    const dotVariants = {
        initial: { scale: 0 },
        animate: { scale: 1 },
    };

    switch (value) {
        case 1:
            return (
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                        className={dotClass}
                        variants={dotVariants}
                        initial="initial"
                        animate="animate"
                        transition={{ duration: 0.2 }}
                    />
                </div>
            );

        case 2:
            return (
                <div className="absolute inset-0 flex items-center justify-center gap-2 sm:gap-3 md:gap-4">
                    <motion.div
                        className={dotClass}
                        variants={dotVariants}
                        initial="initial"
                        animate="animate"
                        transition={{ duration: 0.2, delay: 0 }}
                    />
                    <motion.div
                        className={dotClass}
                        variants={dotVariants}
                        initial="initial"
                        animate="animate"
                        transition={{ duration: 0.2, delay: 0.05 }}
                    />
                </div>
            );

        case 3:
            return (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.div
                        className={dotClass}
                        variants={dotVariants}
                        initial="initial"
                        animate="animate"
                        transition={{ duration: 0.2, delay: 0 }}
                    />
                    <div className="flex gap-2 sm:gap-3 md:gap-4 mt-1">
                        <motion.div
                            className={dotClass}
                            variants={dotVariants}
                            initial="initial"
                            animate="animate"
                            transition={{ duration: 0.2, delay: 0.05 }}
                        />
                        <motion.div
                            className={dotClass}
                            variants={dotVariants}
                            initial="initial"
                            animate="animate"
                            transition={{ duration: 0.2, delay: 0.1 }}
                        />
                    </div>
                </div>
            );

        case 4:
        default:
            return (
                <div className="absolute inset-2 sm:inset-3 md:inset-4">
                    <motion.div
                        className={`${dotClass} absolute top-0 left-0`}
                        variants={dotVariants}
                        initial="initial"
                        animate="animate"
                        transition={{ duration: 0.2, delay: 0 }}
                    />
                    <motion.div
                        className={`${dotClass} absolute top-0 right-0`}
                        variants={dotVariants}
                        initial="initial"
                        animate="animate"
                        transition={{ duration: 0.2, delay: 0.05 }}
                    />
                    <motion.div
                        className={`${dotClass} absolute bottom-0 left-0`}
                        variants={dotVariants}
                        initial="initial"
                        animate="animate"
                        transition={{ duration: 0.2, delay: 0.1 }}
                    />
                    <motion.div
                        className={`${dotClass} absolute bottom-0 right-0`}
                        variants={dotVariants}
                        initial="initial"
                        animate="animate"
                        transition={{ duration: 0.2, delay: 0.15 }}
                    />
                </div>
            );
    }
}
