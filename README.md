# Fission ⚛️

A production-grade chain reaction strategy game built with Next.js, React, and TypeScript.

## Game Rules

1. Blue goes first, then turns alternate
2. Tap your cells to add atoms (shown as dots)
3. When a cell reaches 4 atoms, it explodes
4. Explosions spread to neighbors and convert them to your color
5. Win by eliminating all opponent cells

## Features

- Single Player - Challenge the Minimax AI (Easy/Medium/Hard)
- Two Players - Local pass-and-play mode
- Smooth Animations - Framer Motion powered explosions
- Responsive Design - Works on desktop and mobile
- Dark Theme - Easy on the eyes

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000 to play.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion
- Vitest

## License

MIT
