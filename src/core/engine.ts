/**
 * Game Engine
 * Central orchestrator for game state management
 * All state transitions are immutable
 */

import {
    Cell,
    Player,
    Move,
    GameState,
    GameConfig,
    DEFAULT_CONFIG,
    ChainReactionResult,
    Result,
    MoveError,
} from './types';
import { createGrid, countColors } from './grid';
import { processMove } from './chainReaction';
import { validateMove, checkWinner, getNextPlayer } from './rules';

/**
 * Creates a new game state
 */
export function createGameState(
    config: GameConfig = DEFAULT_CONFIG
): GameState {
    const grid = createGrid(config.gridSize);

    return {
        grid,
        turn: 0,
        currentPlayer: 'B', // Blue always goes first
        status: 'playing',
        colorCount: countColors(grid),
        winner: null,
        gridSize: config.gridSize,
    };
}

/**
 * Applies a move to the game state
 * Returns a new state (immutable) with the result
 */
export function applyMove(
    state: GameState,
    move: Move,
    config: GameConfig = DEFAULT_CONFIG
): Result<{ state: GameState; chainResult: ChainReactionResult }, MoveError> {
    // Validate the move
    const validation = validateMove(state, move);
    if (!validation.valid) {
        return { success: false, error: validation.error! };
    }

    // Process the move and chain reactions
    const isFirstTurn = state.turn < 2;
    const chainResult = processMove(
        state.grid,
        move.row,
        move.col,
        move.player,
        isFirstTurn,
        config
    );

    // Check for winner
    const newTurn = state.turn + 1;
    const winner = checkWinner(newTurn, chainResult.colorCount);

    // Create new state
    const newState: GameState = {
        grid: chainResult.grid,
        turn: newTurn,
        currentPlayer: winner ? state.currentPlayer : getNextPlayer(state.currentPlayer),
        status: winner ? 'game_over' : 'playing',
        colorCount: chainResult.colorCount,
        winner,
        gridSize: state.gridSize,
    };

    return {
        success: true,
        value: { state: newState, chainResult },
    };
}

/**
 * Resets the game to initial state
 */
export function resetGame(
    config: GameConfig = DEFAULT_CONFIG
): GameState {
    return createGameState(config);
}

/**
 * Pauses the game
 */
export function pauseGame(state: GameState): GameState {
    if (state.status !== 'playing') {
        return state;
    }

    return {
        ...state,
        status: 'paused',
    };
}

/**
 * Resumes a paused game
 */
export function resumeGame(state: GameState): GameState {
    if (state.status !== 'paused') {
        return state;
    }

    return {
        ...state,
        status: 'playing',
    };
}

/**
 * Sets the processing status (during chain reactions)
 */
export function setProcessing(state: GameState, processing: boolean): GameState {
    if (state.status === 'game_over') {
        return state;
    }

    return {
        ...state,
        status: processing ? 'processing' : 'playing',
    };
}
