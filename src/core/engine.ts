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

export function createGameState(
    config: GameConfig = DEFAULT_CONFIG
): GameState {
    const grid = createGrid(config.gridSize);

    return {
        grid,
        turn: 0,
        currentPlayer: 'B',
        status: 'playing',
        colorCount: countColors(grid),
        winner: null,
        gridSize: config.gridSize,
    };
}

export function applyMove(
    state: GameState,
    move: Move,
    config: GameConfig = DEFAULT_CONFIG
): Result<{ state: GameState; chainResult: ChainReactionResult }, MoveError> {
    const validation = validateMove(state, move);
    if (!validation.valid) {
        return { success: false, error: validation.error! };
    }

    const isFirstTurn = state.turn < 2;
    const chainResult = processMove(
        state.grid,
        move.row,
        move.col,
        move.player,
        isFirstTurn,
        config
    );

    const newTurn = state.turn + 1;
    const winner = checkWinner(newTurn, chainResult.colorCount);

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

export function resetGame(
    config: GameConfig = DEFAULT_CONFIG
): GameState {
    return createGameState(config);
}

export function pauseGame(state: GameState): GameState {
    if (state.status !== 'playing') {
        return state;
    }

    return {
        ...state,
        status: 'paused',
    };
}

export function resumeGame(state: GameState): GameState {
    if (state.status !== 'paused') {
        return state;
    }

    return {
        ...state,
        status: 'playing',
    };
}

export function setProcessing(state: GameState, processing: boolean): GameState {
    if (state.status === 'game_over') {
        return state;
    }

    return {
        ...state,
        status: processing ? 'processing' : 'playing',
    };
}
