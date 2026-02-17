export type Color = 'R' | 'B' | 'N';

export type Player = Exclude<Color, 'N'>;

export interface Cell {
  readonly value: number;
  readonly color: Color;
}

export interface Position {
  readonly row: number;
  readonly col: number;
}

export interface Move extends Position {
  readonly player: Player;
}

export type Direction = 'up' | 'down' | 'left' | 'right';

export type GameStatus =
  | 'setup'
  | 'playing'
  | 'processing'
  | 'paused'
  | 'game_over';

export type GameMode =
  | 'singleplayer'
  | 'twoplayer'
  | 'multiplayer';

export type Difficulty = 'easy' | 'medium' | 'hard';

export const DIFFICULTY_DEPTH: Record<Difficulty, number> = {
  easy: 2,
  medium: 4,
  hard: 6,
} as const;

export interface ColorCount {
  readonly R: number;
  readonly B: number;
  readonly N: number;
}

export interface GameState {
  readonly grid: readonly (readonly Cell[])[];
  readonly turn: number;
  readonly currentPlayer: Player;
  readonly status: GameStatus;
  readonly colorCount: ColorCount;
  readonly winner: Player | null;
  readonly gridSize: number;
}

export interface Explosion {
  readonly position: Position;
  readonly directions: Direction[];
  readonly color: Player;
  readonly step: number;
}

export interface ChainReactionResult {
  readonly grid: readonly (readonly Cell[])[];
  readonly explosions: Explosion[];
  readonly colorCount: ColorCount;
  readonly steps: number;
  readonly completed: boolean;
}

export interface MoveValidationResult {
  readonly valid: boolean;
  readonly error?: MoveError;
}

export enum MoveError {
  OUT_OF_BOUNDS = 'Cell position is outside the grid',
  NOT_YOUR_TURN = 'It is not your turn',
  INVALID_CELL = 'Cannot place on opponent cell',
  NEUTRAL_AFTER_FIRST = 'Cannot place on neutral cell after first turns',
  GAME_NOT_ACTIVE = 'Game is not in playing state',
  PROCESSING = 'Another move is being processed',
}

export type Result<T, E = Error> =
  | { readonly success: true; readonly value: T }
  | { readonly success: false; readonly error: E };

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

export const DEFAULT_CONFIG: GameConfig = {
  gridSize: 6,
  criticalMass: {
    corner: 4,
    edge: 4,
    center: 4,
  },
  firstTurnValue: 3,
  maxChainSteps: 1000,
} as const;

export interface AIMove {
  readonly row: number;
  readonly col: number;
  readonly score: number;
}
