# Fission ⚛️

A production-grade chain reaction strategy game built with Next.js, React, and TypeScript.

🎮 **[Play Live Demo](https://fission-nu.vercel.app)**

![Status](https://img.shields.io/badge/Status-Live-brightgreen) ![Tests](https://img.shields.io/badge/Tests-52%20Passing-success) ![License](https://img.shields.io/badge/License-MIT-blue)

---

## 🎯 Game Rules

1. **Blue goes first**, then turns alternate
2. Tap your cells to add atoms (shown as dots)
3. When a cell reaches **4 atoms**, it **explodes**
4. Explosions spread to neighbors and convert them to your color
5. **Win** by eliminating all opponent cells

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **Single Player** | Challenge the Minimax AI with 3 difficulty levels |
| 👥 **Two Players** | Local pass-and-play mode |
| 💫 **Smooth Animations** | Framer Motion powered explosions and transitions |
| 🔊 **Sound Effects** | Web Audio API driven click and explosion sounds |
| 📱 **Responsive Design** | Works on desktop, tablet, and mobile |
| 🌙 **Dark Theme** | Modern glassmorphism UI |
| 📊 **Analytics** | Built-in Vercel Analytics |

---

## 🏗️ Architecture

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

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
git clone https://github.com/Aksh1810/Fission.git
cd Fission

npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to play.

---

## 📜 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |
| `npm run test:coverage` | Run tests with coverage |
| `npm run lint` | Lint the codebase |

---

## 🧪 Testing

```bash
npm run test:run
```

**52 tests** passing across 4 test suites:

| Suite | Tests | Coverage |
|---|---|---|
| Grid utilities | 17 | Grid creation, cloning, bounds, neighbors, critical mass |
| Chain reactions | 8 | Single/multi-step explosions, color conversion |
| Game rules | 17 | Move validation, first-turn rules, win detection |
| Game engine | 10 | State transitions, pause/resume, reset |

---

## 🛠️ Tech Stack

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

## 🎮 AI Difficulty Levels

| Level | Search Depth | Play Style |
|---|---|---|
| Easy | 2 moves ahead | Casual — makes occasional mistakes |
| Medium | 4 moves ahead | Balanced — solid strategic play |
| Hard | 6 moves ahead | Expert — deep lookahead, tough to beat |

The AI uses **Minimax with Alpha-Beta Pruning** for optimal move selection, with a center-region opening strategy on the first turn.

---

## 📄 License

MIT License — free to use for learning or building your own games.

---

## 🙏 Acknowledgments

Inspired by the classic Chain Reaction game. Built with modern web technologies for a smooth, production-grade experience.
