import { describe, it, expect } from 'vitest';
import {
    validateMove,
    checkWinner,
    hasValidMoves,
    getValidMoves,
    getNextPlayer,
} from '@/core/rules';
import { createGameState } from '@/core/engine';
import { createGrid } from '@/core/grid';
import { MoveError } from '@/core/types';

describe('Game Rules', () => {
    describe('validateMove', () => {
        it('should allow first turn on neutral cell', () => {
            const state = createGameState();

            const result = validateMove(state, { row: 0, col: 0, player: 'B' });

            expect(result.valid).toBe(true);
        });

        it('should reject move when not players turn', () => {
            const state = createGameState();

            const result = validateMove(state, { row: 0, col: 0, player: 'R' });

            expect(result.valid).toBe(false);
            expect(result.error).toBe(MoveError.NOT_YOUR_TURN);
        });

        it('should reject out-of-bounds move', () => {
            const state = createGameState();

            const result = validateMove(state, { row: 10, col: 0, player: 'B' });

            expect(result.valid).toBe(false);
            expect(result.error).toBe(MoveError.OUT_OF_BOUNDS);
        });

        it('should reject move on opponent cell after first turns', () => {
            const state = {
                ...createGameState(),
                turn: 5,
                grid: (() => {
                    const grid = createGrid(6);
                    grid[1][1] = { value: 2, color: 'R' };
                    return grid;
                })(),
                currentPlayer: 'B' as const,
            };

            const result = validateMove(state, { row: 1, col: 1, player: 'B' });

            expect(result.valid).toBe(false);
            expect(result.error).toBe(MoveError.INVALID_CELL);
        });

        it('should reject move on neutral cell after first turns (players can only click owned cells)', () => {
            const state = {
                ...createGameState(),
                turn: 5,
                currentPlayer: 'B' as const,
                status: 'playing' as const,
            };

            const result = validateMove(state, { row: 0, col: 0, player: 'B' });

            // Neutral cells are NOT valid after first turns - players can only click their own cells
            expect(result.valid).toBe(false);
            expect(result.error).toBe(MoveError.INVALID_CELL);
        });

        it('should allow move on own cell after first turns', () => {
            const state = {
                ...createGameState(),
                turn: 5,
                grid: (() => {
                    const grid = createGrid(6);
                    grid[1][1] = { value: 2, color: 'B' };
                    return grid;
                })(),
                currentPlayer: 'B' as const,
                status: 'playing' as const,
            };

            const result = validateMove(state, { row: 1, col: 1, player: 'B' });

            expect(result.valid).toBe(true);
        });

        it('should reject move when game is over', () => {
            const state = {
                ...createGameState(),
                status: 'game_over' as const,
            };

            const result = validateMove(state, { row: 0, col: 0, player: 'B' });

            expect(result.valid).toBe(false);
            expect(result.error).toBe(MoveError.GAME_NOT_ACTIVE);
        });
    });

    describe('checkWinner', () => {
        it('should return null when turn < 2', () => {
            const result = checkWinner(1, { R: 0, B: 1, N: 35 });
            expect(result).toBeNull();
        });

        it('should return B when R has no cells', () => {
            const result = checkWinner(10, { R: 0, B: 5, N: 31 });
            expect(result).toBe('B');
        });

        it('should return R when B has no cells', () => {
            const result = checkWinner(10, { R: 5, B: 0, N: 31 });
            expect(result).toBe('R');
        });

        it('should return null when both players have cells', () => {
            const result = checkWinner(10, { R: 5, B: 3, N: 28 });
            expect(result).toBeNull();
        });
    });

    describe('hasValidMoves', () => {
        it('should return true on first turn if any neutral cells exist', () => {
            const grid = createGrid(4);
            expect(hasValidMoves(grid, 'B', 0)).toBe(true);
        });

        it('should return true if player has cells after first turns', () => {
            const grid = createGrid(4);
            grid[1][1] = { value: 2, color: 'B' };
            expect(hasValidMoves(grid, 'B', 5)).toBe(true);
        });

        it('should return false if no owned cells exist (player cannot expand to neutral)', () => {
            // When player has no cells, they cannot move (neutral cells are not clickable)
            const grid = createGrid(4);
            grid[1][1] = { value: 2, color: 'R' }; // One opponent cell
            // The rest are neutral, but B cannot click them
            expect(hasValidMoves(grid, 'B', 5)).toBe(false);
        });

        it('should return false if only opponent cells exist', () => {
            // Create grid where ALL cells are opponent cells
            const grid = createGrid(2); // 2x2 grid
            grid[0][0] = { value: 1, color: 'R' };
            grid[0][1] = { value: 1, color: 'R' };
            grid[1][0] = { value: 1, color: 'R' };
            grid[1][1] = { value: 1, color: 'R' };
            expect(hasValidMoves(grid, 'B', 5)).toBe(false);
        });
    });

    describe('getValidMoves', () => {
        it('should return all neutral cells on first turn', () => {
            const grid = createGrid(3);
            const moves = getValidMoves(grid, 'B', 0);
            expect(moves.length).toBe(9);
        });

        it('should return ONLY own cells after first turns (not neutral cells)', () => {
            const grid = createGrid(4); // 4x4 = 16 cells
            grid[1][1] = { value: 2, color: 'B' }; // B owns 1 cell
            grid[2][2] = { value: 1, color: 'B' }; // B owns 1 cell
            grid[0][0] = { value: 3, color: 'R' }; // R owns 1 cell
            // Remaining 13 cells are neutral

            const moves = getValidMoves(grid, 'B', 5);

            // B can ONLY move on owned cells = 2 (not neutral cells)
            expect(moves.length).toBe(2);
            expect(moves).toContainEqual({ row: 1, col: 1 });
            expect(moves).toContainEqual({ row: 2, col: 2 });
            // Should NOT contain opponent cell
            expect(moves).not.toContainEqual({ row: 0, col: 0 });
        });
    });

    describe('getNextPlayer', () => {
        it('should alternate players correctly', () => {
            expect(getNextPlayer('B')).toBe('R');
            expect(getNextPlayer('R')).toBe('B');
        });
    });
});
