/**
 * Core type definitions for Chroma Clash
 * These types are used throughout the game engine and UI
 */

// Cell colors
export type Color = 'R' | 'B' | 'N';

// Player identifier
export type Player = Exclude<Color, 'N'>;

// Cell representation
export interface Cell {
  readonly value: number;
  readonly color: Color;
}

// Position on the grid
export interface Position {
  readonly row: number;
  readonly col: number;
}

// Move representation
export interface Move extends Position {
  readonly player: Player;
}

// Direction for explosions
export type Direction = 'up' | 'down' | 'left' | 'right';

// Game status
export type GameStatus =
  | 'setup'
  | 'playing'
  | 'processing'
  | 'paused'
  | 'game_over';

// Game mode
export type GameMode =
  | 'singleplayer'
  | 'twoplayer'
  | 'multiplayer';

// Difficulty level for AI
export type Difficulty = 'easy' | 'medium' | 'hard';

// AI depth mapping
export const DIFFICULTY_DEPTH: Record<Difficulty, number> = {
  easy: 2,
  medium: 4,
  hard: 6,
} as const;

// Color count tracking
export interface ColorCount {
  readonly R: number;
  readonly B: number;
  readonly N: number;
}

// Game state (immutable)
export interface GameState {
  readonly grid: readonly (readonly Cell[])[];
  readonly turn: number;
  readonly currentPlayer: Player;
  readonly status: GameStatus;
  readonly colorCount: ColorCount;
  readonly winner: Player | null;
  readonly gridSize: number;
}

// Explosion event for animations
export interface Explosion {
  readonly position: Position;
  readonly directions: Direction[];
  readonly color: Player;
  readonly step: number;
}

// Chain reaction result
export interface ChainReactionResult {
  readonly grid: readonly (readonly Cell[])[];
  readonly explosions: Explosion[];
  readonly colorCount: ColorCount;
  readonly steps: number;
  readonly completed: boolean;
}

// Move validation result
export interface MoveValidationResult {
  readonly valid: boolean;
  readonly error?: MoveError;
}

// Move errors
export enum MoveError {
  OUT_OF_BOUNDS = 'Cell position is outside the grid',
  NOT_YOUR_TURN = 'It is not your turn',
  INVALID_CELL = 'Cannot place on opponent cell',
  NEUTRAL_AFTER_FIRST = 'Cannot place on neutral cell after first turns',
  GAME_NOT_ACTIVE = 'Game is not in playing state',
  PROCESSING = 'Another move is being processed',
}

// Result type for operations that can fail
export type Result<T, E = Error> =
  | { readonly success: true; readonly value: T }
  | { readonly success: false; readonly error: E };

// Game configuration
export interface GameConfig {
  readonly gridSize: number;
  readonly criticalMass: {
    readonly corner: number;
    readonly edge: number;
    readonly center: number;
  };
  readonly firstTurnValue: number;
  readonly maxChainSteps: number;
}

// Default game configuration
export const DEFAULT_CONFIG: GameConfig = {
  gridSize: 6,
  criticalMass: {
    corner: 3,
    edge: 3,
    center: 3,
  },
  firstTurnValue: 1,
  maxChainSteps: 1000,
} as const;


// Minimax output
export interface AIMove {
  readonly row: number;
  readonly col: number;
  readonly score: number;
}
