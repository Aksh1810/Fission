/**
 * Grid utility functions
 * Pure functions for grid manipulation with bounds checking
 */

import { Cell, Color, Position, GameConfig, DEFAULT_CONFIG } from './types';

/**
 * Creates a new empty grid with all neutral cells
 */
export function createGrid(size: number = DEFAULT_CONFIG.gridSize): Cell[][] {
    return Array.from({ length: size }, () =>
        Array.from({ length: size }, () => ({ value: 0, color: 'N' as Color }))
    );
}

/**
 * Creates an immutable deep clone of a grid
 */
export function cloneGrid(grid: readonly (readonly Cell[])[]): Cell[][] {
    return grid.map(row => row.map(cell => ({ ...cell })));
}

/**
 * Checks if a position is within grid bounds
 */
export function isInBounds(
    grid: readonly (readonly Cell[])[],
    row: number,
    col: number
): boolean {
    return row >= 0 && row < grid.length && col >= 0 && col < grid[0].length;
}

/**
 * Safely gets a cell from the grid with bounds checking
 */
export function getCell(
    grid: readonly (readonly Cell[])[],
    row: number,
    col: number
): Cell | null {
    if (!isInBounds(grid, row, col)) {
        return null;
    }
    return grid[row][col];
}

/**
 * Gets all valid neighbor positions (up, down, left, right)
 */
export function getNeighbors(
    grid: readonly (readonly Cell[])[],
    row: number,
    col: number
): Position[] {
    const directions: [number, number][] = [
        [-1, 0], // up
        [1, 0],  // down
        [0, -1], // left
        [0, 1],  // right
    ];

    return directions
        .map(([dr, dc]) => ({ row: row + dr, col: col + dc }))
        .filter(pos => isInBounds(grid, pos.row, pos.col));
}

/**
 * Gets the critical mass for a cell based on its position
 * Corner cells: fewer neighbors = lower critical mass
 * Edge cells: 3 neighbors
 * Center cells: 4 neighbors
 */
export function getCriticalMass(
    grid: readonly (readonly Cell[])[],
    row: number,
    col: number,
    config: GameConfig = DEFAULT_CONFIG
): number {
    const size = grid.length;
    const isCorner =
        (row === 0 || row === size - 1) &&
        (col === 0 || col === size - 1);
    const isEdge =
        !isCorner &&
        (row === 0 || row === size - 1 || col === 0 || col === size - 1);

    if (isCorner) return config.criticalMass.corner;
    if (isEdge) return config.criticalMass.edge;
    return config.criticalMass.center;
}

/**
 * Counts cells by color
 */
export function countColors(
    grid: readonly (readonly Cell[])[]
): { R: number; B: number; N: number } {
    const counts = { R: 0, B: 0, N: 0 };

    for (const row of grid) {
        for (const cell of row) {
            counts[cell.color]++;
        }
    }

    return counts;
}

/**
 * Gets the explosion directions for a cell
 */
export function getExplosionDirections(
    grid: readonly (readonly Cell[])[],
    row: number,
    col: number
): ('up' | 'down' | 'left' | 'right')[] {
    const directions: ('up' | 'down' | 'left' | 'right')[] = [];
    const size = grid.length;

    if (row > 0) directions.push('up');
    if (row < size - 1) directions.push('down');
    if (col > 0) directions.push('left');
    if (col < size - 1) directions.push('right');

    return directions;
}

/**
 * Validates that a grid is in a valid state
 */
export function validateGrid(grid: readonly (readonly Cell[])[]): boolean {
    if (!grid || grid.length === 0) return false;

    const size = grid.length;

    for (let r = 0; r < size; r++) {
        if (!grid[r] || grid[r].length !== size) return false;

        for (let c = 0; c < size; c++) {
            const cell = grid[r][c];
            if (cell.value < 0 || cell.value > 4) return false;
            if (!['R', 'B', 'N'].includes(cell.color)) return false;
            // Neutral cells should have value 0
            if (cell.color === 'N' && cell.value !== 0) return false;
        }
    }

    return true;
}
