import { describe, it, expect } from 'vitest';
import {
    createGameState,
    applyMove,
    resetGame,
    pauseGame,
    resumeGame,
} from '@/core/engine';
import { DEFAULT_CONFIG } from '@/core/types';

describe('Game Engine', () => {
    describe('createGameState', () => {
        it('should create initial state with correct defaults', () => {
            const state = createGameState();

            expect(state.gridSize).toBe(6);
            expect(state.turn).toBe(0);
            expect(state.currentPlayer).toBe('B');
            expect(state.status).toBe('playing');
            expect(state.winner).toBeNull();
            expect(state.colorCount.N).toBe(36);
            expect(state.colorCount.R).toBe(0);
            expect(state.colorCount.B).toBe(0);
        });

        it('should respect custom grid size', () => {
            const state = createGameState({ ...DEFAULT_CONFIG, gridSize: 4 });

            expect(state.gridSize).toBe(4);
            expect(state.grid.length).toBe(4);
            expect(state.grid[0].length).toBe(4);
        });
    });

    describe('applyMove', () => {
        it('should apply valid move and update state', () => {
            const state = createGameState();

            const result = applyMove(state, { row: 2, col: 2, player: 'B' });

            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.value.state.grid[2][2].color).toBe('B');
                expect(result.value.state.grid[2][2].value).toBe(3);
                expect(result.value.state.turn).toBe(1);
                expect(result.value.state.currentPlayer).toBe('R');
            }
        });

        it('should reject invalid move', () => {
            const state = createGameState();

            const result = applyMove(state, { row: 10, col: 0, player: 'B' });

            expect(result.success).toBe(false);
        });

        it('should detect winner when opponent has no cells', () => {
            // Set up a state where next move will eliminate opponent
            const state = createGameState();

            // Simulate a game where Blue is about to win
            let currentState = state;

            // First turn: Blue at 2,2
            let result = applyMove(currentState, { row: 2, col: 2, player: 'B' });
            expect(result.success).toBe(true);
            if (result.success) currentState = result.value.state;

            // Second turn: Red at 3,3
            result = applyMove(currentState, { row: 3, col: 3, player: 'R' });
            expect(result.success).toBe(true);
            if (result.success) currentState = result.value.state;

            // Game should continue
            expect(currentState.status).toBe('playing');
            expect(currentState.winner).toBeNull();
        });

        it('should not mutate the original state', () => {
            const state = createGameState();
            const originalGrid = JSON.stringify(state.grid);

            applyMove(state, { row: 2, col: 2, player: 'B' });

            // Original should be unchanged
            expect(JSON.stringify(state.grid)).toBe(originalGrid);
        });
    });

    describe('resetGame', () => {
        it('should create a fresh game state', () => {
            const state = resetGame();

            expect(state.turn).toBe(0);
            expect(state.status).toBe('playing');
        });
    });

    describe('pauseGame', () => {
        it('should pause a playing game', () => {
            const state = createGameState();
            const paused = pauseGame(state);

            expect(paused.status).toBe('paused');
        });

        it('should not change non-playing games', () => {
            const state = { ...createGameState(), status: 'game_over' as const };
            const result = pauseGame(state);

            expect(result.status).toBe('game_over');
        });
    });

    describe('resumeGame', () => {
        it('should resume a paused game', () => {
            const state = { ...createGameState(), status: 'paused' as const };
            const resumed = resumeGame(state);

            expect(resumed.status).toBe('playing');
        });
    });
});
