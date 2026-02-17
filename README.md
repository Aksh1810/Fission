# Fission ⚛️

A production-grade chain reaction strategy game built with Next.js, React, and TypeScript.

**[Play Live Demo](https://fission-nu.vercel.app)**

---

## Game Rules

1. **Blue goes first**, then turns alternate
2. Tap your cells to add atoms (shown as dots)
3. When a cell reaches **4 atoms**, it **explodes**
4. Explosions spread to neighbors and convert them to your color
5. **Win** by eliminating all opponent cells

---

## Features

### Single Player vs AI

Challenge an AI opponent powered by the **Minimax algorithm with Alpha-Beta Pruning**. Choose from three difficulty levels that control how many moves ahead the AI looks — from casual play at depth 2 to expert-level strategic gameplay at depth 6. The AI uses a center-region opening strategy on its first turn to establish early board control.

### Two Player Mode

Pass-and-play local multiplayer. Two players alternate turns on the same device, competing to trigger chain reactions and capture each other's cells.

### Chain Reaction Engine

The core mechanic uses an **iterative Breadth-First Search** to process explosions. When a cell reaches critical mass (4 atoms), it explodes outward to all neighboring cells, converting them to your color and potentially triggering further chain reactions. A single well-placed move can cascade across the entire board.

### Animations & Visual Effects

Every explosion triggers layered visual feedback — expanding ring effects, particle bursts with sparkle trails, and smooth cell transitions. Atoms render as 3D spheres with gradient shading and wobble animations when cells approach critical mass. All animations are physics-based using Framer Motion.

### Sound Design

Click and explosion sound effects are generated in real-time using the **Web Audio API** for precise timing and low latency. No audio files are loaded — all sounds are synthesized programmatically.

### Responsive Dark UI

A glassmorphism-inspired dark theme with gradient backgrounds, subtle grid overlays, and glowing accents. The interface adapts seamlessly across desktop, tablet, and mobile screen sizes. Interactive elements respond with hover effects, tap feedback, and smooth page transitions.

---

## Architecture

```
src/
├── core/                  # Pure game logic (zero React dependencies)
│   ├── types.ts           # TypeScript type definitions & constants
│   ├── grid.ts            # Grid creation, cloning, neighbors, bounds
│   ├── chainReaction.ts   # Iterative BFS explosion engine
│   ├── rules.ts           # Move validation & win detection
│   ├── engine.ts          # Immutable state transitions
│   └── ai.ts              # Minimax with alpha-beta pruning
│
├── components/            # React UI components
│   ├── GameBoard.tsx      # Board grid renderer
│   ├── GameCell.tsx       # Individual cell with glow effects
│   ├── CellDots.tsx       # 3D atom sphere rendering
│   ├── BurstEffect.tsx    # Explosion particle animation
│   ├── ExplosionRing.tsx  # Expanding ring effect
│   ├── ColorBar.tsx       # Score display & turn counter
│   ├── Modal.tsx          # Game over & difficulty modals
│   └── Navigation.tsx     # Route navigation with active indicator
│
├── hooks/                 # Custom React hooks
│   ├── useGame.ts         # Game state, AI integration, animations
│   └── useAudio.ts        # Web Audio API sound manager
│
├── app/                   # Next.js App Router pages
│   ├── page.tsx           # Home / landing page
│   ├── singleplayer/      # vs AI mode
│   └── twoplayer/         # Local multiplayer mode
│
└── __tests__/             # Vitest unit tests (52 tests)
```

### Key Design Decisions

- **Iterative BFS** for chain reactions — prevents stack overflow on long chains
- **Immutable state** transitions — every move returns a new `GameState`
- **Pure functions** in core layer — zero side effects, trivially testable
- **Result types** for type-safe error handling

---

## Tech Stack

| Technology | Purpose |
|---|---|
| [Next.js 16](https://nextjs.org/) | React framework with App Router |
| [React 19](https://react.dev/) | UI library |
| [TypeScript 5](https://www.typescriptlang.org/) | Type safety |
| [Tailwind CSS 4](https://tailwindcss.com/) | Utility-first styling |
| [Framer Motion 12](https://www.framer.com/motion/) | Physics-based animations |
| [Vitest 4](https://vitest.dev/) | Unit testing framework |
| [Vercel](https://vercel.com/) | Deployment & Analytics |

---

## AI Difficulty Levels

| Level | Search Depth | Play Style |
|---|---|---|
| Easy | 2 moves ahead | Casual — makes occasional mistakes |
| Medium | 4 moves ahead | Balanced — solid strategic play |
| Hard | 6 moves ahead | Expert — deep lookahead, tough to beat |

---

## License

MIT License — free to use for learning or building your own games.

---

## Acknowledgments

Inspired by the classic Chain Reaction game. Built with modern web technologies for a smooth, production-grade experience.
