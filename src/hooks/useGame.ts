'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import {
    GameState,
    GameConfig,
    DEFAULT_CONFIG,
    Player,
    Direction,
    Difficulty,
    DIFFICULTY_DEPTH,
    Explosion,
} from '@/core/types';
import {
    createGameState,
    applyMove,
    resetGame,
    findBestMove,
    getExplosionDirections,
} from '@/core';

interface BurstDot {
    id: number;
    row: number;
    col: number;
    direction: Direction;
    color: Player;
}

interface UseGameOptions {
    mode: 'singleplayer' | 'twoplayer';
    difficulty?: Difficulty;
    playerColor?: Player;
    config?: GameConfig;
}

export function useGame({
    mode,
    difficulty = 'medium',
    playerColor = 'B',
    config = DEFAULT_CONFIG,
}: UseGameOptions) {
    const [gameState, setGameState] = useState<GameState>(() => createGameState(config));
    const [burstDots, setBurstDots] = useState<BurstDot[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [displayedTurn, setDisplayedTurn] = useState(0);

    const burstIdCounter = useRef(0);
    const aiTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const isAiTurn = mode === 'singleplayer' &&
        gameState.currentPlayer !== playerColor &&
        gameState.status === 'playing';

    useEffect(() => {
        return () => {
            if (aiTimeoutRef.current) {
                clearTimeout(aiTimeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (isAiTurn && !isProcessing) {
            aiTimeoutRef.current = setTimeout(() => {
                const aiPlayer = playerColor === 'B' ? 'R' : 'B';
                const depth = DIFFICULTY_DEPTH[difficulty];

                const bestMove = findBestMove(
                    gameState.grid,
                    depth,
                    gameState.turn,
                    gameState.colorCount,
                    aiPlayer,
                    config
                );

                handleCellClick(bestMove.row, bestMove.col, false);
            }, 500);
        }

        return () => {
            if (aiTimeoutRef.current) {
                clearTimeout(aiTimeoutRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAiTurn, isProcessing, gameState.turn]);

    const addBursts = useCallback((explosions: Explosion[]) => {
        const newBursts: BurstDot[] = [];

        for (const explosion of explosions) {
            for (const direction of explosion.directions) {
                newBursts.push({
                    id: burstIdCounter.current++,
                    row: explosion.position.row,
                    col: explosion.position.col,
                    direction,
                    color: explosion.color,
                });
            }
        }

        setBurstDots(prev => [...prev, ...newBursts]);
    }, []);

    const removeBurst = useCallback((id: number) => {
        setBurstDots(prev => prev.filter(b => b.id !== id));
    }, []);

    const handleCellClick = useCallback(async (
        row: number,
        col: number,
        isUserAction: boolean = true
    ) => {
        if (isProcessing) return;
        if (isUserAction && isAiTurn) return;
        if (gameState.status !== 'playing') return;

        setIsProcessing(true);

        const move = {
            row,
            col,
            player: gameState.currentPlayer,
        };

        const result = applyMove(gameState, move, config);

        if (!result.success) {
            console.warn('Invalid move:', result.error);
            setIsProcessing(false);
            return;
        }

        if (result.value.chainResult.explosions.length > 0) {
            addBursts(result.value.chainResult.explosions);
        }

        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate(20);
        }

        setGameState(result.value.state);
        setDisplayedTurn(result.value.state.turn);

        const animationDelay = result.value.chainResult.explosions.length > 0
            ? Math.min(result.value.chainResult.steps * 400, 2000)
            : 100;

        setTimeout(() => {
            setIsProcessing(false);
        }, animationDelay);
    }, [gameState, isProcessing, isAiTurn, config, addBursts]);

    const resetToStart = useCallback(() => {
        setGameState(resetGame(config));
        setBurstDots([]);
        setIsProcessing(false);
        setDisplayedTurn(0);
    }, [config]);

    return {
        gameState,
        burstDots,
        isProcessing,
        displayedTurn,
        isAiTurn,
        handleCellClick,
        removeBurst,
        resetGame: resetToStart,
    };
}
