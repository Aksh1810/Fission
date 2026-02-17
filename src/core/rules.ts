import {
    Cell,
    Player,
    Move,
    GameState,
    MoveValidationResult,
    MoveError,
    ColorCount,
} from './types';
import { isInBounds, getCell } from './grid';

/**
 * Validates if a move is legal.
 * First turn: can click any neutral cell. After first turn: can ONLY click owned cells.
 */
export function validateMove(
    state: GameState,
    move: Move
): MoveValidationResult {
    if (state.status !== 'playing') {
        return { valid: false, error: MoveError.GAME_NOT_ACTIVE };
    }

    if (move.player !== state.currentPlayer) {
        return { valid: false, error: MoveError.NOT_YOUR_TURN };
    }

    if (!isInBounds(state.grid, move.row, move.col)) {
        return { valid: false, error: MoveError.OUT_OF_BOUNDS };
    }

    const cell = getCell(state.grid, move.row, move.col);
    if (!cell) {
        return { valid: false, error: MoveError.OUT_OF_BOUNDS };
    }

    if (state.turn < 2) {
        if (cell.color !== 'N') {
            return { valid: false, error: MoveError.INVALID_CELL };
        }
        return { valid: true };
    }

    if (cell.color !== move.player) {
        return { valid: false, error: MoveError.INVALID_CELL };
    }

    return { valid: true };
}

export function checkWinner(
    turn: number,
    colorCount: ColorCount
): Player | null {
    if (turn < 2) {
        return null;
    }

    if (colorCount.B === 0 && colorCount.R > 0) {
        return 'R';
    }

    if (colorCount.R === 0 && colorCount.B > 0) {
        return 'B';
    }

    return null;
}

export function hasValidMoves(
    grid: readonly (readonly Cell[])[],
    player: Player,
    turn: number
): boolean {
    const size = grid.length;

    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            const cell = grid[r][c];

            if (turn < 2 && cell.color === 'N') {
                return true;
            }

            if (turn >= 2 && cell.color === player) {
                return true;
            }
        }
    }

    return false;
}

export function getValidMoves(
    grid: readonly (readonly Cell[])[],
    player: Player,
    turn: number
): { row: number; col: number }[] {
    const moves: { row: number; col: number }[] = [];
    const size = grid.length;

    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            const cell = grid[r][c];

            if (turn < 2 && cell.color === 'N') {
                moves.push({ row: r, col: c });
            }

            if (turn >= 2 && cell.color === player) {
                moves.push({ row: r, col: c });
            }
        }
    }

    return moves;
}

export function getNextPlayer(current: Player): Player {
    return current === 'B' ? 'R' : 'B';
}
