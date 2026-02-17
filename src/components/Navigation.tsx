'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

interface NavItem {
    href: string;
    label: string;
    icon: React.ReactNode;
}

const HomeIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </svg>
);

const AiIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
    </svg>
);

const PlayersIcon = () => (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
    </svg>
);

const navItems: NavItem[] = [
    { href: '/', label: 'Home', icon: <HomeIcon /> },
    { href: '/singleplayer', label: 'vs AI', icon: <AiIcon /> },
    { href: '/twoplayer', label: '2 Players', icon: <PlayersIcon /> },
];

/**
 * Navigation with animated sliding pill indicator
 */
export function Navigation() {
    const pathname = usePathname();

    return (
        <nav className="flex justify-center mb-6">
            <div className="glass-strong flex gap-1 p-1.5 rounded-2xl relative">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;

                    return (
                        <Link key={item.href} href={item.href} className="relative z-10">
                            {isActive && (
                                <motion.div
                                    layoutId="nav-pill"
                                    className="absolute inset-0 rounded-xl"
                                    style={{
                                        background: 'linear-gradient(135deg, rgba(96,165,250,0.2), rgba(96,165,250,0.08))',
                                        border: '1px solid rgba(96,165,250,0.2)',
                                    }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 30, mass: 0.8 }}
                                />
                            )}
                            <div
                                className={`
                                    relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
                                    transition-colors duration-200
                                    ${isActive
                                        ? 'text-white'
                                        : 'text-slate-400 hover:text-slate-200'
                                    }
                                `}
                            >
                                <span className={isActive ? 'text-blue-400' : ''}>{item.icon}</span>
                                {item.label}
                            </div>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
