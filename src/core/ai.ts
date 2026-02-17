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

function evaluateBoard(
    colorCount: { R: number; B: number; N: number },
    player: Player
): number {
    const own = colorCount[player];
    const opponent = colorCount[player === 'R' ? 'B' : 'R'];
    const total = own + opponent;

    if (total === 0) return 0;

    return ((own - opponent) / total) * 100;
}

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
    const winner = checkWinner(turn, colorCount);
    const opponent = aiPlayer === 'R' ? 'B' : 'R';

    if (winner === aiPlayer) return Infinity;
    if (winner === opponent) return -Infinity;

    if (depth === 0) {
        return evaluateBoard(colorCount, aiPlayer);
    }

    const currentPlayer: Player = isMaximizing ? aiPlayer : opponent;
    const moves = getValidMoves(grid, currentPlayer, turn);

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

            if (beta <= alpha) break;
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

            if (beta <= alpha) break;
        }

        return minScore;
    }
}

export function findBestMove(
    grid: readonly (readonly Cell[])[],
    depth: number,
    turn: number,
    colorCount: { R: number; B: number; N: number },
    aiPlayer: Player = 'R',
    config: GameConfig = DEFAULT_CONFIG
): AIMove {
    const moves = getValidMoves(grid, aiPlayer, turn);

    if (moves.length === 0) {
        return { row: 0, col: 0, score: -Infinity };
    }

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
            bestMoves.push({ row: move.row, col: move.col, score });
        }
    }

    return bestMoves[Math.floor(Math.random() * bestMoves.length)];
}

/**
 * First-turn strategy: prefer center region cells away from opponent.
 */
function findFirstTurnMove(
    grid: readonly (readonly Cell[])[],
    player: Player
): AIMove {
    const size = grid.length;
    const opponent = player === 'R' ? 'B' : 'R';

    const centerRegion: { row: number; col: number }[] = [];
    const margin = Math.floor(size / 3);

    for (let r = margin; r < size - margin; r++) {
        for (let c = margin; c < size - margin; c++) {
            const cell = grid[r][c];
            if (cell.color === 'N') {
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

    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            if (grid[r][c].color === 'N') {
                return { row: r, col: c, score: 0 };
            }
        }
    }

    return { row: 0, col: 0, score: 0 };
}

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
