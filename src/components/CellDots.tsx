'use client';

import { motion } from 'framer-motion';

interface CellDotsProps {
    value: number;
}

/**
 * Renders professional-looking atoms (dots) inside a cell
 * Uses white orbs with shadows and smooth animations for a polished look
 */
export function CellDots({ value }: CellDotsProps) {
    if (value === 0) return null;

    // Professional orb styling with gradient and shadow for depth
    const dotBaseClass = `
        rounded-full
        bg-gradient-to-br from-white via-gray-100 to-gray-300
        shadow-[inset_-1px_-1px_3px_rgba(0,0,0,0.3),0_2px_4px_rgba(0,0,0,0.4)]
        border border-white/50
    `;

    // Size classes for different screen sizes
    const sizeClass = "w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4";

    const dotClass = `${dotBaseClass} ${sizeClass}`;

    const dotVariants = {
        initial: { scale: 0, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
    };

    const springTransition = {
        type: "spring" as const,
        stiffness: 500,
        damping: 25,
    };

    switch (value) {
        case 1:
            // Single centered dot
            return (
                <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                        className={dotClass}
                        variants={dotVariants}
                        initial="initial"
                        animate="animate"
                        transition={springTransition}
                    />
                </div>
            );

        case 2:
            // Two dots side by side
            return (
                <div className="absolute inset-0 flex items-center justify-center gap-1.5 sm:gap-2 md:gap-2.5">
                    <motion.div
                        className={dotClass}
                        variants={dotVariants}
                        initial="initial"
                        animate="animate"
                        transition={{ ...springTransition, delay: 0 }}
                    />
                    <motion.div
                        className={dotClass}
                        variants={dotVariants}
                        initial="initial"
                        animate="animate"
                        transition={{ ...springTransition, delay: 0.05 }}
                    />
                </div>
            );

        case 3:
            // Triangle formation (1 on top, 2 on bottom)
            return (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 sm:gap-1">
                    <motion.div
                        className={dotClass}
                        variants={dotVariants}
                        initial="initial"
                        animate="animate"
                        transition={{ ...springTransition, delay: 0 }}
                    />
                    <div className="flex gap-1.5 sm:gap-2 md:gap-2.5">
                        <motion.div
                            className={dotClass}
                            variants={dotVariants}
                            initial="initial"
                            animate="animate"
                            transition={{ ...springTransition, delay: 0.05 }}
                        />
                        <motion.div
                            className={dotClass}
                            variants={dotVariants}
                            initial="initial"
                            animate="animate"
                            transition={{ ...springTransition, delay: 0.1 }}
                        />
                    </div>
                </div>
            );

        case 4:
        default:
            // Four corners (critical mass visual)
            return (
                <div className="absolute inset-1.5 sm:inset-2 md:inset-2.5 lg:inset-3">
                    <motion.div
                        className={`${dotClass} absolute top-0 left-0`}
                        variants={dotVariants}
                        initial="initial"
                        animate="animate"
                        transition={{ ...springTransition, delay: 0 }}
                    />
                    <motion.div
                        className={`${dotClass} absolute top-0 right-0`}
                        variants={dotVariants}
                        initial="initial"
                        animate="animate"
                        transition={{ ...springTransition, delay: 0.03 }}
                    />
                    <motion.div
                        className={`${dotClass} absolute bottom-0 left-0`}
                        variants={dotVariants}
                        initial="initial"
                        animate="animate"
                        transition={{ ...springTransition, delay: 0.06 }}
                    />
                    <motion.div
                        className={`${dotClass} absolute bottom-0 right-0`}
                        variants={dotVariants}
                        initial="initial"
                        animate="animate"
                        transition={{ ...springTransition, delay: 0.09 }}
                    />
                </div>
            );
    }
}
