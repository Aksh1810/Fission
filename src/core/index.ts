/**
 * Core module exports
 * Barrel file for clean imports
 */

// Types
export * from './types';

// Grid utilities
export {
    createGrid,
    cloneGrid,
    isInBounds,
    getCell,
    getNeighbors,
    getCriticalMass,
    countColors,
    getExplosionDirections,
    validateGrid,
} from './grid';

// Chain reaction
export {
    processMove,
    simulateMove,
} from './chainReaction';

// Game rules
export {
    validateMove,
    checkWinner,
    hasValidMoves,
    getValidMoves,
    getNextPlayer,
} from './rules';

// Game engine
export {
    createGameState,
    applyMove,
    resetGame,
    pauseGame,
    resumeGame,
    setProcessing,
} from './engine';

// AI
export {
    findBestMove,
} from './ai';
