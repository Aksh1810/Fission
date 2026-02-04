'use client';

import { ColorCount } from '@/core/types';

interface ColorBarProps {
    colorCount: ColorCount;
    turn: number;
}

/**
 * Color bar showing the relative cell count for each player
 */
export function ColorBar({ colorCount, turn }: ColorBarProps) {
    const total = colorCount.R + colorCount.B;

    // Avoid division by zero
    if (total === 0) {
        return (
            <div className="w-full max-w-md mx-auto mt-4">
                <div className="flex h-3 rounded-full overflow-hidden bg-gray-700">
                    <div className="w-1/2 bg-blue-500" />
                    <div className="w-1/2 bg-red-500" />
                </div>
                <div className="flex justify-between text-sm mt-2 text-gray-400">
                    <span>Blue: 0</span>
                    <span>Turn {turn}</span>
                    <span>Red: 0</span>
                </div>
            </div>
        );
    }

    const bluePercent = (colorCount.B / total) * 100;
    const redPercent = (colorCount.R / total) * 100;

    return (
        <div className="w-full max-w-md mx-auto mt-4">
            <div className="flex h-3 rounded-full overflow-hidden bg-gray-700">
                <div
                    className="bg-blue-500 transition-all duration-500 ease-out"
                    style={{ width: `${bluePercent}%` }}
                />
                <div
                    className="bg-red-500 transition-all duration-500 ease-out"
                    style={{ width: `${redPercent}%` }}
                />
            </div>
            <div className="flex justify-between text-sm mt-2 text-gray-400">
                <span className="text-blue-400 font-medium">Blue: {colorCount.B}</span>
                <span>Turn {turn}</span>
                <span className="text-red-400 font-medium">Red: {colorCount.R}</span>
            </div>
        </div>
    );
}
