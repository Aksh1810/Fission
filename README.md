# Fission ⚛️

A production-grade chain reaction strategy game built with Next.js, React, and TypeScript.

🎮 **[Play Live Demo](https://fission-nu.vercel.app)**

![Game Screenshot](https://img.shields.io/badge/Status-Live-brightgreen) ![Tests](https://img.shields.io/badge/Tests-52%20Passing-success) ![License](https://img.shields.io/badge/License-MIT-blue)

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
|---------|-------------|
| 🤖 **Single Player** | Challenge the Minimax AI with 3 difficulty levels |
| 👥 **Two Players** | Local pass-and-play mode |
| 💫 **Smooth Animations** | Framer Motion powered explosions and transitions |
| 📱 **Responsive Design** | Works on desktop, tablet, and mobile |
| 🌙 **Dark Theme** | Modern dark UI that's easy on the eyes |
| 📊 **Analytics** | Built-in Vercel Analytics for traffic tracking |

---

## 🏗️ Architecture

The project follows a clean, layered architecture:

```
src/
├── core/           # Pure game logic (zero React dependencies)
│   ├── types.ts    # TypeScript type definitions
│   ├── grid.ts     # Grid utilities
│   ├── chainReaction.ts  # BFS-based explosion engine
│   ├── rules.ts    # Move validation & win detection
│   ├── engine.ts   # State management
│   └── ai.ts       # Minimax with alpha-beta pruning
│
├── components/     # React UI components
├── hooks/          # Custom React hooks
├── app/            # Next.js pages
└── __tests__/      # Unit tests (52 tests)
```

### Key Design Decisions

- **Iterative BFS** for chain reactions (prevents stack overflow)
- **Immutable state** transitions for predictable behavior
- **Result types** for type-safe error handling
- **Pure functions** in core logic for easy testing

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/Aksh1810/Fission.git
cd Fission

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to play!

---

## 📜 Scripts

| Command | Description |
|---------|-------------|
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

**Results:** 52 tests passing across 4 test suites:
- Grid utilities (17 tests)
- Chain reactions (8 tests)
- Game rules (17 tests)
- Game engine (10 tests)

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| [Next.js 16](https://nextjs.org/) | React framework with App Router |
| [React 19](https://react.dev/) | UI library |
| [TypeScript](https://www.typescriptlang.org/) | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) | Styling |
| [Framer Motion](https://www.framer.com/motion/) | Animations |
| [Vitest](https://vitest.dev/) | Unit testing |
| [Vercel](https://vercel.com/) | Deployment & Analytics |

---

## 🎮 AI Difficulty Levels

| Level | Depth | Description |
|-------|-------|-------------|
| Easy | 2 moves | Casual play |
| Medium | 4 moves | Balanced challenge |
| Hard | 6 moves | Strategic gameplay |

The AI uses **Minimax with Alpha-Beta Pruning** for optimal move selection.

---

## 📄 License

MIT License - feel free to use this project for learning or building your own games!

---

## 🙏 Acknowledgments

Inspired by the classic "Chain Reaction" game. Built with modern web technologies for a smooth, production-grade experience.
