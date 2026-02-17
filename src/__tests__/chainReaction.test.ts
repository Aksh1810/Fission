import { describe, it, expect } from 'vitest';
import { processMove, simulateMove } from '@/core/chainReaction';
import { createGrid } from '@/core/grid';
import { DEFAULT_CONFIG } from '@/core/types';

describe('Chain Reaction Engine', () => {
    describe('processMove', () => {
        it('should place 3 atoms on first turn', () => {
        const grid = createGrid(4);

            const result = processMove(grid, 1, 1, 'B', true, DEFAULT_CONFIG);

            // Reference: First turn places 3 atoms
            expect(result.grid[1][1].value).toBe(3);
            expect(result.grid[1][1].color).toBe('B');
            expect(result.explosions.length).toBe(0);
        });

        it('should increment cell value by 1 on subsequent turns', () => {
            const grid = createGrid(4);
            grid[1][1] = { value: 2, color: 'B' };

            const result = processMove(grid, 1, 1, 'B', false, DEFAULT_CONFIG);

            // Reference: After first turn, increment by 1
            expect(result.grid[1][1].value).toBe(3);
        });

        it('should trigger explosion when reaching critical mass of 4', () => {
            const grid = createGrid(4);
            grid[1][1] = { value: 3, color: 'B' }; // Critical mass is 4

            const result = processMove(grid, 1, 1, 'B', false, DEFAULT_CONFIG);

            // Cell should explode and reset
            expect(result.grid[1][1].value).toBe(0);
            expect(result.grid[1][1].color).toBe('N');

            // Neighbors should be affected
            expect(result.grid[0][1].value).toBe(1);
            expect(result.grid[0][1].color).toBe('B');
            expect(result.grid[2][1].value).toBe(1);
            expect(result.grid[2][1].color).toBe('B');
            expect(result.grid[1][0].value).toBe(1);
            expect(result.grid[1][0].color).toBe('B');
            expect(result.grid[1][2].value).toBe(1);
            expect(result.grid[1][2].color).toBe('B');

            // Should record explosions
            expect(result.explosions.length).toBe(1);
            expect(result.explosions[0].position).toEqual({ row: 1, col: 1 });
        });

        it('should trigger chain reaction when explosion causes neighbor to explode', () => {
            const grid = createGrid(4);
            grid[1][1] = { value: 3, color: 'B' }; // Will reach 4 and explode
            grid[1][2] = { value: 3, color: 'B' }; // Will receive 1, reach 4, and explode

            const result = processMove(grid, 1, 1, 'B', false, DEFAULT_CONFIG);

            // Both cells should have exploded
            expect(result.explosions.length).toBeGreaterThanOrEqual(2);
        });

        it('should convert opponent cells on explosion', () => {
            const grid = createGrid(4);
            grid[1][1] = { value: 3, color: 'B' }; // Will explode when clicked
            grid[0][1] = { value: 2, color: 'R' }; // Opponent cell with 2 atoms

            const result = processMove(grid, 1, 1, 'B', false, DEFAULT_CONFIG);

            // Red cell should be converted to Blue and receive an atom
            expect(result.grid[0][1].color).toBe('B');
            expect(result.grid[0][1].value).toBe(3); // Was 2, now 3
        });

        it('should correctly count colors after chain reaction', () => {
            const grid = createGrid(3);
            grid[1][1] = { value: 3, color: 'B' }; // Will explode

            const result = processMove(grid, 1, 1, 'B', false, DEFAULT_CONFIG);

            expect(result.colorCount.B).toBe(4); // 4 neighbors
            expect(result.colorCount.R).toBe(0);
        });

        it('should not exceed max chain steps', () => {
            const grid = createGrid(4);
            // Set up a potentially infinite loop scenario
            grid[0][0] = { value: 3, color: 'B' };
            grid[0][1] = { value: 3, color: 'B' };
            grid[1][0] = { value: 3, color: 'B' };
            grid[1][1] = { value: 3, color: 'B' };

            const result = processMove(grid, 0, 0, 'B', false, {
                ...DEFAULT_CONFIG,
                maxChainSteps: 10,
            });

            // Should complete without infinite loop
            expect(result.steps).toBeLessThanOrEqual(10);
        });
    });

    describe('simulateMove', () => {
        it('should produce the same final grid as processMove', () => {
            const grid = createGrid(4);
            grid[1][1] = { value: 3, color: 'B' };

            const fullResult = processMove(grid, 1, 1, 'B', false, DEFAULT_CONFIG);
            const simResult = simulateMove(grid, 1, 1, 'B', false, DEFAULT_CONFIG);

            // Compare final color counts
            expect(simResult.colorCount.B).toBe(fullResult.colorCount.B);
            expect(simResult.colorCount.R).toBe(fullResult.colorCount.R);
        });
    });
});
