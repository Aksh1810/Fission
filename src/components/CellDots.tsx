'use client';

import { motion } from 'framer-motion';

interface CellDotsProps {
    value: number;
}

export function CellDots({ value }: CellDotsProps) {
    if (value === 0) return null;

    const dotBaseClass = `
        rounded-full
        bg-gradient-to-br from-white via-gray-50 to-gray-300
        shadow-[inset_-1px_-2px_3px_rgba(0,0,0,0.35),0_1px_3px_rgba(0,0,0,0.5)]
        border border-white/60
    `;

    const sizeClass = 'w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 lg:w-4 lg:h-4';
    const dotClass = `${dotBaseClass} ${sizeClass}`;

    const dotVariants = {
        initial: { scale: 0, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
    };

    const springTransition = {
        type: 'spring' as const,
        stiffness: 500,
        damping: 22,
    };

    const shouldWobble = value >= 2;
    const wobbleStyle = shouldWobble ? { animation: 'atom-wobble 2.5s ease-in-out infinite' } : {};

    switch (value) {
        case 1:
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
            return (
                <div className="absolute inset-0 flex items-center justify-center gap-1.5 sm:gap-2 md:gap-2.5" style={wobbleStyle}>
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
                        transition={{ ...springTransition, delay: 0.06 }}
                    />
                </div>
            );

        case 3:
            return (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 sm:gap-1" style={wobbleStyle}>
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
                            transition={{ ...springTransition, delay: 0.06 }}
                        />
                        <motion.div
                            className={dotClass}
                            variants={dotVariants}
                            initial="initial"
                            animate="animate"
                            transition={{ ...springTransition, delay: 0.12 }}
                        />
                    </div>
                </div>
            );

        case 4:
        default:
            return (
                <div className="absolute inset-1.5 sm:inset-2 md:inset-2.5 lg:inset-3" style={wobbleStyle}>
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
                        transition={{ ...springTransition, delay: 0.04 }}
                    />
                    <motion.div
                        className={`${dotClass} absolute bottom-0 left-0`}
                        variants={dotVariants}
                        initial="initial"
                        animate="animate"
                        transition={{ ...springTransition, delay: 0.08 }}
                    />
                    <motion.div
                        className={`${dotClass} absolute bottom-0 right-0`}
                        variants={dotVariants}
                        initial="initial"
                        animate="animate"
                        transition={{ ...springTransition, delay: 0.12 }}
                    />
                </div>
            );
    }
}
