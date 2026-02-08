/**
 * Game Rules and Validation
 * Pure functions for validating moves and checking win conditions
 */

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
 * Validates if a move is legal
 * 
 * Rules:
 * - First turn: can click any neutral cell to start
 * - After first turn: can ONLY click cells you own (cells with your color and atoms)
 * - Empty cells are NOT clickable unless they received atoms from an explosion
 */
export function validateMove(
    state: GameState,
    move: Move
): MoveValidationResult {
    // Check game status
    if (state.status !== 'playing') {
        return { valid: false, error: MoveError.GAME_NOT_ACTIVE };
    }

    // Check if it's the right player's turn
    if (move.player !== state.currentPlayer) {
        return { valid: false, error: MoveError.NOT_YOUR_TURN };
    }

    // Check bounds
    if (!isInBounds(state.grid, move.row, move.col)) {
        return { valid: false, error: MoveError.OUT_OF_BOUNDS };
    }

    const cell = getCell(state.grid, move.row, move.col);
    if (!cell) {
        return { valid: false, error: MoveError.OUT_OF_BOUNDS };
    }

    // First two turns: can only place on neutral cells (each player picks their starting cell)
    if (state.turn < 2) {
        if (cell.color !== 'N') {
            return { valid: false, error: MoveError.INVALID_CELL };
        }
        return { valid: true };
    }

    // After first turns: can ONLY click cells you own (your color with atoms)
    // This restricts players to their initial cell and cells that received atoms from explosions
    if (cell.color !== move.player) {
        return { valid: false, error: MoveError.INVALID_CELL };
    }

    return { valid: true };
}



/**
 * Checks if the game has a winner
 * Returns the winner player or null if game continues
 */
export function checkWinner(
    turn: number,
    colorCount: ColorCount
): Player | null {
    // No winner possible in first two turns
    if (turn < 2) {
        return null;
    }

    // Red wins if Blue has no cells
    if (colorCount.B === 0 && colorCount.R > 0) {
        return 'R';
    }

    // Blue wins if Red has no cells
    if (colorCount.R === 0 && colorCount.B > 0) {
        return 'B';
    }

    return null;
}

/**
 * Checks if a player has any valid moves
 */
export function hasValidMoves(
    grid: readonly (readonly Cell[])[],
    player: Player,
    turn: number
): boolean {
    const size = grid.length;

    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            const cell = grid[r][c];

            // First two turns: only neutral cells are valid
            if (turn < 2 && cell.color === 'N') {
                return true;
            }

            // After first turns: ONLY owned cells are valid
            if (turn >= 2 && cell.color === player) {
                return true;
            }
        }
    }

    return false;
}

/**
 * Gets all valid moves for a player
 */
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

            // First two turns: only neutral cells are valid
            if (turn < 2 && cell.color === 'N') {
                moves.push({ row: r, col: c });
            }

            // After first turns: ONLY owned cells are valid
            if (turn >= 2 && cell.color === player) {
                moves.push({ row: r, col: c });
            }
        }
    }

    return moves;
}



/**
 * Gets the next player
 */
export function getNextPlayer(current: Player): Player {
    return current === 'B' ? 'R' : 'B';
}
