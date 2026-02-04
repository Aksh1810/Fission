/**
 * Minimax AI with Alpha-Beta Pruning
 * Implements a strategic AI opponent
 */

import {
    Cell,
    Player,
    AIMove,
    GameConfig,
    DEFAULT_CONFIG,
} from './types';
import { cloneGrid, countColors } from './grid';
import { simulateMove } from './chainReaction';
import { getValidMoves, checkWinner } from './rules';

/**
 * Evaluates the board state from a player's perspective
 * Returns a score between -100 and 100
 */
function evaluateBoard(
    colorCount: { R: number; B: number; N: number },
    player: Player
): number {
    const own = colorCount[player];
    const opponent = colorCount[player === 'R' ? 'B' : 'R'];
    const total = own + opponent;

    if (total === 0) return 0;

    // Score based on cell control ratio
    return ((own - opponent) / total) * 100;
}

/**
 * Minimax algorithm with alpha-beta pruning
 */
function minimax(
    grid: readonly (readonly Cell[])[],
    depth: number,
    isMaximizing: boolean,
    alpha: number,
    beta: number,
    turn: number,
    colorCount: { R: number; B: number; N: number },
    aiPlayer: Player,
    config: GameConfig
): number {
    // Check for terminal states
    const winner = checkWinner(turn, colorCount);
    const opponent = aiPlayer === 'R' ? 'B' : 'R';

    if (winner === aiPlayer) return Infinity;
    if (winner === opponent) return -Infinity;

    // Depth limit reached
    if (depth === 0) {
        return evaluateBoard(colorCount, aiPlayer);
    }

    const currentPlayer: Player = isMaximizing ? aiPlayer : opponent;
    const moves = getValidMoves(grid, currentPlayer, turn);

    // No valid moves - this shouldn't happen in normal play
    if (moves.length === 0) {
        return evaluateBoard(colorCount, aiPlayer);
    }

    if (isMaximizing) {
        let maxScore = -Infinity;

        for (const move of moves) {
            const result = simulateMove(
                grid,
                move.row,
                move.col,
                currentPlayer,
                turn < 2,
                config
            );

            const score = minimax(
                result.grid,
                depth - 1,
                false,
                alpha,
                beta,
                turn + 1,
                result.colorCount,
                aiPlayer,
                config
            );

            maxScore = Math.max(maxScore, score);
            alpha = Math.max(alpha, score);

            if (beta <= alpha) break; // Alpha cutoff
        }

        return maxScore;
    } else {
        let minScore = Infinity;

        for (const move of moves) {
            const result = simulateMove(
                grid,
                move.row,
                move.col,
                currentPlayer,
                turn < 2,
                config
            );

            const score = minimax(
                result.grid,
                depth - 1,
                true,
                alpha,
                beta,
                turn + 1,
                result.colorCount,
                aiPlayer,
                config
            );

            minScore = Math.min(minScore, score);
            beta = Math.min(beta, score);

            if (beta <= alpha) break; // Beta cutoff
        }

        return minScore;
    }
}

/**
 * Finds the best move for the AI player
 */
export function findBestMove(
    grid: readonly (readonly Cell[])[],
    depth: number,
    turn: number,
    colorCount: { R: number; B: number; N: number },
    aiPlayer: Player = 'R',
    config: GameConfig = DEFAULT_CONFIG
): AIMove {
    const moves = getValidMoves(grid, aiPlayer, turn);

    // No valid moves - shouldn't happen
    if (moves.length === 0) {
        return { row: 0, col: 0, score: -Infinity };
    }

    // For first turn, use a strategic random move (center-ish)
    if (turn < 2) {
        return findFirstTurnMove(grid, aiPlayer);
    }

    let bestScore = -Infinity;
    let bestMoves: AIMove[] = [];

    for (const move of moves) {
        const result = simulateMove(
            grid,
            move.row,
            move.col,
            aiPlayer,
            turn < 2,
            config
        );

        const score = minimax(
            result.grid,
            depth - 1,
            false,
            -Infinity,
            Infinity,
            turn + 1,
            result.colorCount,
            aiPlayer,
            config
        );

        if (score > bestScore) {
            bestScore = score;
            bestMoves = [{ row: move.row, col: move.col, score }];
        } else if (score === bestScore) {
            // Collect equal-score moves for randomization
            bestMoves.push({ row: move.row, col: move.col, score });
        }
    }

    // Randomly select among best moves
    const selected = bestMoves[Math.floor(Math.random() * bestMoves.length)];
    return selected;
}

/**
 * Strategic first turn move selection
 * Avoids edges and corners, prefers center region
 */
function findFirstTurnMove(
    grid: readonly (readonly Cell[])[],
    player: Player
): AIMove {
    const size = grid.length;
    const opponent = player === 'R' ? 'B' : 'R';

    // Prefer moves in the center region
    const centerRegion: { row: number; col: number }[] = [];
    const margin = Math.floor(size / 3);

    for (let r = margin; r < size - margin; r++) {
        for (let c = margin; c < size - margin; c++) {
            const cell = grid[r][c];
            if (cell.color === 'N') {
                // Check if any adjacent cell is opponent's
                const hasOpponentNeighbor = checkAdjacentForColor(grid, r, c, opponent);
                if (!hasOpponentNeighbor) {
                    centerRegion.push({ row: r, col: c });
                }
            }
        }
    }

    if (centerRegion.length > 0) {
        const selected = centerRegion[Math.floor(Math.random() * centerRegion.length)];
        return { ...selected, score: 0 };
    }

    // Fallback: any neutral cell
    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (grid[r][c].color === 'N') {
                return { row: r, col: c, score: 0 };
            }
        }
    }

    return { row: 0, col: 0, score: 0 };
}

/**
 * Checks if any adjacent cell has the specified color
 */
function checkAdjacentForColor(
    grid: readonly (readonly Cell[])[],
    row: number,
    col: number,
    color: Player
): boolean {
    const size = grid.length;
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    for (const [dr, dc] of directions) {
        const nr = row + dr;
        const nc = col + dc;
        if (nr >= 0 && nr < size && nc >= 0 && nc < size) {
            if (grid[nr][nc].color === color) {
                return true;
            }
        }
    }

    return false;
}
