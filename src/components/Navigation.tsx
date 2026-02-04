'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

interface NavItem {
    href: string;
    label: string;
}

const navItems: NavItem[] = [
    { href: '/', label: 'Home' },
    { href: '/singleplayer', label: 'vs AI' },
    { href: '/twoplayer', label: '2 Players' },
];

/**
 * Navigation component for switching between game modes
 */
export function Navigation() {
    const pathname = usePathname();

    return (
        <nav className="flex justify-center mb-6">
            <div className="flex gap-2 bg-gray-800/50 p-1.5 rounded-xl backdrop-blur-sm">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;

                    return (
                        <Link key={item.href} href={item.href}>
                            <motion.div
                                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${isActive
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                                    }
                `}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {item.label}
                            </motion.div>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
