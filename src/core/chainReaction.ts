/**
 * Chain Reaction Engine
 * Handles the explosion propagation logic using BFS (iterative, not recursive)
 * to avoid stack overflow on large chain reactions
 */

import {
    Cell,
    Player,
    Position,
    Explosion,
    ChainReactionResult,
    GameConfig,
    DEFAULT_CONFIG,
} from './types';
import {
    cloneGrid,
    isInBounds,
    getNeighbors,
    getCriticalMass,
    countColors,
    getExplosionDirections,
} from './grid';

/**
 * Process a single cell addition and trigger chain reactions if needed
 * Uses BFS to process explosions iteratively (avoids stack overflow)
 */
export function processMove(
    initialGrid: readonly (readonly Cell[])[],
    row: number,
    col: number,
    player: Player,
    isFirstTurn: boolean,
    config: GameConfig = DEFAULT_CONFIG
): ChainReactionResult {
    const grid = cloneGrid(initialGrid);
    const explosions: Explosion[] = [];
    let steps = 0;

    // Initial placement
    if (isFirstTurn) {
        grid[row][col] = { value: config.firstTurnValue, color: player };
    } else {
        grid[row][col] = {
            value: grid[row][col].value + 1,
            color: player,
        };
    }

    // Check if initial cell needs to explode
    const queue: Position[] = [];
    if (grid[row][col].value >= getCriticalMass(grid, row, col, config)) {
        queue.push({ row, col });
    }

    // BFS explosion processing
    while (queue.length > 0 && steps < config.maxChainSteps) {
        const currentBatch = [...queue];
        queue.length = 0;

        for (const pos of currentBatch) {
            const cell = grid[pos.row][pos.col];
            const criticalMass = getCriticalMass(grid, pos.row, pos.col, config);

            if (cell.value >= criticalMass) {
                const cellColor = cell.color as Player;

                // Record explosion for animation
                explosions.push({
                    position: pos,
                    directions: getExplosionDirections(grid, pos.row, pos.col),
                    color: cellColor,
                    step: steps,
                });

                // Reset exploding cell
                grid[pos.row][pos.col] = { value: 0, color: 'N' };

                // Spread to neighbors
                const neighbors = getNeighbors(grid, pos.row, pos.col);
                for (const neighbor of neighbors) {
                    const neighborCell = grid[neighbor.row][neighbor.col];
                    grid[neighbor.row][neighbor.col] = {
                        value: neighborCell.value + 1,
                        color: cellColor,
                    };

                    // Check if neighbor needs to explode
                    const neighborCritical = getCriticalMass(
                        grid,
                        neighbor.row,
                        neighbor.col,
                        config
                    );
                    if (grid[neighbor.row][neighbor.col].value >= neighborCritical) {
                        // Avoid duplicates in queue
                        const alreadyQueued = queue.some(
                            p => p.row === neighbor.row && p.col === neighbor.col
                        );
                        if (!alreadyQueued) {
                            queue.push(neighbor);
                        }
                    }
                }
            }
        }

        if (currentBatch.length > 0) {
            steps++;
        }
    }

    return {
        grid,
        explosions,
        colorCount: countColors(grid),
        steps,
        completed: queue.length === 0,
    };
}

/**
 * Simulate a move without animation data (for AI calculations)
 * More efficient version that skips explosion tracking
 */
export function simulateMove(
    initialGrid: readonly (readonly Cell[])[],
    row: number,
    col: number,
    player: Player,
    isFirstTurn: boolean,
    config: GameConfig = DEFAULT_CONFIG
): { grid: readonly (readonly Cell[])[]; colorCount: { R: number; B: number; N: number } } {
    const grid = cloneGrid(initialGrid);

    // Initial placement
    if (isFirstTurn) {
        grid[row][col] = { value: config.firstTurnValue, color: player };
    } else {
        grid[row][col] = {
            value: grid[row][col].value + 1,
            color: player,
        };
    }

    // Check if initial cell needs to explode
    const queue: Position[] = [];
    if (grid[row][col].value >= getCriticalMass(grid, row, col, config)) {
        queue.push({ row, col });
    }

    let iterations = 0;
    const maxIterations = config.maxChainSteps;

    // BFS explosion processing (simplified)
    while (queue.length > 0 && iterations < maxIterations) {
        const pos = queue.shift()!;
        const cell = grid[pos.row][pos.col];
        const criticalMass = getCriticalMass(grid, pos.row, pos.col, config);

        if (cell.value >= criticalMass) {
            const cellColor = cell.color as Player;

            // Reset exploding cell
            grid[pos.row][pos.col] = { value: 0, color: 'N' };

            // Spread to neighbors
            const neighbors = getNeighbors(grid, pos.row, pos.col);
            for (const neighbor of neighbors) {
                const neighborCell = grid[neighbor.row][neighbor.col];
                grid[neighbor.row][neighbor.col] = {
                    value: neighborCell.value + 1,
                    color: cellColor,
                };

                // Check if neighbor needs to explode
                const neighborCritical = getCriticalMass(
                    grid,
                    neighbor.row,
                    neighbor.col,
                    config
                );
                if (grid[neighbor.row][neighbor.col].value >= neighborCritical) {
                    queue.push(neighbor);
                }
            }
        }

        iterations++;
    }

    return {
        grid,
        colorCount: countColors(grid),
    };
}
