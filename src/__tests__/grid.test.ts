import { describe, it, expect } from 'vitest';
import {
    createGrid,
    cloneGrid,
    isInBounds,
    getCell,
    getNeighbors,
    getCriticalMass,
    countColors,
    validateGrid,
} from '@/core/grid';
import { DEFAULT_CONFIG } from '@/core/types';

describe('Grid Utilities', () => {
    describe('createGrid', () => {
        it('should create a 6x6 grid by default', () => {
            const grid = createGrid();
            expect(grid.length).toBe(6);
            expect(grid[0].length).toBe(6);
        });

        it('should create a grid with specified size', () => {
            const grid = createGrid(4);
            expect(grid.length).toBe(4);
            expect(grid[0].length).toBe(4);
        });

        it('should initialize all cells as neutral with value 0', () => {
            const grid = createGrid(3);
            for (let r = 0; r < 3; r++) {
                for (let c = 0; c < 3; c++) {
                    expect(grid[r][c].color).toBe('N');
                    expect(grid[r][c].value).toBe(0);
                }
            }
        });
    });

    describe('cloneGrid', () => {
        it('should create a deep copy of the grid', () => {
            const grid = createGrid(3);
            grid[0][0] = { value: 2, color: 'B' };

            const cloned = cloneGrid(grid);

            expect(cloned[0][0].value).toBe(2);
            expect(cloned[0][0].color).toBe('B');

            // Modifying clone should not affect original
            cloned[0][0] = { value: 3, color: 'R' };
            expect(grid[0][0].value).toBe(2);
            expect(grid[0][0].color).toBe('B');
        });
    });

    describe('isInBounds', () => {
        const grid = createGrid(4);

        it('should return true for valid positions', () => {
            expect(isInBounds(grid, 0, 0)).toBe(true);
            expect(isInBounds(grid, 3, 3)).toBe(true);
            expect(isInBounds(grid, 2, 1)).toBe(true);
        });

        it('should return false for out-of-bounds positions', () => {
            expect(isInBounds(grid, -1, 0)).toBe(false);
            expect(isInBounds(grid, 0, -1)).toBe(false);
            expect(isInBounds(grid, 4, 0)).toBe(false);
            expect(isInBounds(grid, 0, 4)).toBe(false);
            expect(isInBounds(grid, 10, 10)).toBe(false);
        });
    });

    describe('getCell', () => {
        it('should return the cell at valid position', () => {
            const grid = createGrid(3);
            grid[1][2] = { value: 3, color: 'R' };

            const cell = getCell(grid, 1, 2);
            expect(cell).toEqual({ value: 3, color: 'R' });
        });

        it('should return null for out-of-bounds positions', () => {
            const grid = createGrid(3);

            expect(getCell(grid, -1, 0)).toBeNull();
            expect(getCell(grid, 5, 0)).toBeNull();
        });
    });

    describe('getNeighbors', () => {
        const grid = createGrid(4);

        it('should return 4 neighbors for center cells', () => {
            const neighbors = getNeighbors(grid, 2, 2);
            expect(neighbors.length).toBe(4);
        });

        it('should return 2 neighbors for corner cells', () => {
            const neighbors = getNeighbors(grid, 0, 0);
            expect(neighbors.length).toBe(2);
            expect(neighbors).toContainEqual({ row: 0, col: 1 });
            expect(neighbors).toContainEqual({ row: 1, col: 0 });
        });

        it('should return 3 neighbors for edge cells', () => {
            const neighbors = getNeighbors(grid, 0, 1);
            expect(neighbors.length).toBe(3);
        });
    });

    describe('getCriticalMass', () => {
        const grid = createGrid(6);

        it('should return 3 for all cells with default config', () => {
            // Corner
            expect(getCriticalMass(grid, 0, 0, DEFAULT_CONFIG)).toBe(3);
            // Edge
            expect(getCriticalMass(grid, 0, 2, DEFAULT_CONFIG)).toBe(3);
            // Center
            expect(getCriticalMass(grid, 3, 3, DEFAULT_CONFIG)).toBe(3);
        });
    });


    describe('countColors', () => {
        it('should count cells by color correctly', () => {
            const grid = createGrid(3);
            grid[0][0] = { value: 1, color: 'B' };
            grid[0][1] = { value: 2, color: 'B' };
            grid[1][0] = { value: 1, color: 'R' };

            const counts = countColors(grid);
            expect(counts.B).toBe(2);
            expect(counts.R).toBe(1);
            expect(counts.N).toBe(6);
        });
    });

    describe('validateGrid', () => {
        it('should return true for valid grids', () => {
            const grid = createGrid(4);
            expect(validateGrid(grid)).toBe(true);
        });

        it('should return false for empty grids', () => {
            expect(validateGrid([])).toBe(false);
        });

        it('should return false for grids with invalid values', () => {
            const grid = createGrid(2);
            grid[0][0] = { value: -1, color: 'B' };
            expect(validateGrid(grid)).toBe(false);
        });

        it('should return false for neutral cells with non-zero value', () => {
            const grid = createGrid(2);
            grid[0][0] = { value: 1, color: 'N' };
            expect(validateGrid(grid)).toBe(false);
        });
    });
});
