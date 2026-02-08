# Chroma War / Fission - Game Rules Reference

> **This file is the SINGLE SOURCE OF TRUTH for all gameplay logic.**
> All implementation changes must comply with these rules.

---

## 1. Game Setup & Initial State

### Grid
- **Dimensions**: 6×6 grid (indices 0–5)
- **Initial state**: All 36 cells are Empty (`'N'`) with value `0`

### Players
| Player | Color | Turn Order |
|--------|-------|------------|
| Blue   | `'B'` | Even turns (0, 2, 4...) |
| Red    | `'R'` | Odd turns (1, 3, 5...) |

### Atom Capacity
- Cells display 1–3 atoms visually
- Value of **4 or more** triggers immediate explosion

---

## 2. Turn Structure & Interaction Rules

### Phase 1: Opening (Turns 0 & 1)

| Rule | Description |
|------|-------------|
| **Allowed cells** | Empty (`'N'`) cells only |
| **Placement effect** | Sets cell value to **3** (not 1) |
| **Restriction** | Cannot click opponent's cells |

```typescript
// Reference: singleplayer/page.tsx:141
if (turn > 1) {
  newCells[row][col].val += 1;
} else {
  newCells[row][col].val = 3;  // CRITICAL: First turn = 3 atoms
}
```

### Phase 2: Battle (Turn 2+)

| Rule | Description |
|------|-------------|
| **Allowed cells** | Own color only |
| **Empty cells** | **BLOCKED** - cannot click |
| **Click effect** | Increments value by +1 |

```typescript
// Reference: singleplayer/page.tsx:107-108
if (cell.color === 'N' && turn > 1) return;  // Empty lockout
if (cell.color !== 'N' && cell.color !== color) return;  // Opponent lockout
```

> **Key Implication**: Players expand territory ONLY via explosions, not by clicking empty cells.

---

## 3. Atom Behavior & Explosion Logic

### Explosion Trigger
- **Condition**: Cell value reaches **≥ 4**
- **Timing**: Immediate after value increment

### Explosion Effects

1. **Cell Reset**: Exploding cell → value `0`, color `'N'`
2. **Propagation**: Sends 1 atom to each orthogonal neighbor (Up, Down, Left, Right)
3. **No diagonals**: Diagonal cells are NOT affected

### Neighbor Capture Logic

When a neighbor receives an explosion atom:

1. **Value increase**: +1 atom
2. **Color capture**: Neighbor becomes exploding player's color
3. **Chain reaction**: If new value ≥ 4, neighbor also explodes

```typescript
// Reference: FunctionUtils.tsx:193-206
const recursiveFill = (cells, row, col, color, colorCount) => {
  cells[row][col].val += 1;
  cells[row][col].color = color;
  colorCount[color] += 1;
  
  if (cells[row][col].val >= 4) {
    cells[row][col].val = 0;
    cells[row][col].color = "N";
    // Propagate to neighbors...
  }
}
```

---

## 4. Win/Loss Conditions

| Condition | Description |
|-----------|-------------|
| **Win** | Opponent has 0 atoms remaining |
| **Grace period** | Win check disabled for turns 0-1 |
| **Check timing** | After all chain reactions resolve |

```typescript
// Reference: FunctionUtils.tsx:44-55
const checkWinner = (turn, colorCount) => {
  if (turn < 2) return null;  // Grace period
  if (colorCount['B'] === 0) return 'R';
  if (colorCount['R'] === 0) return 'B';
  return null;
}
```

---

## 5. Technical Constraints & Edge Cases

### Grid Boundaries
- Corner cells: Distribute 2 atoms (2 neighbors)
- Edge cells: Distribute 3 atoms (3 neighbors)
- Center cells: Distribute 4 atoms (4 neighbors)
- "Lost" atoms at boundaries disappear from game

### Processing Lock
- User input disabled during chain reaction animations
- Prevents state corruption from rapid clicks

### AI Constraints (Single Player)
- First move: AI targets center 2×2 zone (rows 2-3, cols 2-3)
- Validates not adjacent to Blue cell
- Uses Minimax with Alpha-Beta pruning after first turn

---

## 6. Configuration Constants

```typescript
// types.ts
export const DEFAULT_CONFIG = {
  gridSize: 6,
  criticalMass: {
    corner: 4,
    edge: 4,
    center: 4,
  },
  firstTurnValue: 3,
  maxChainSteps: 1000,
};
```

---

## 7. Rule Compliance Checklist

Before any logic change, verify:

- [ ] First turn places 3 atoms (not 1)
- [ ] Explosion threshold is 4 (not 3)
- [ ] Empty cells blocked after turn 1
- [ ] Only own cells clickable after turn 1
- [ ] Win check disabled for turns 0-1
- [ ] Chain reactions propagate correctly
- [ ] Captured cells change color immediately

---

## Reference Implementation

Source: [kensunjaya/chroma-war](https://github.com/kensunjaya/chroma-war)

Key files:
- `src/utils/FunctionUtils.tsx` - Core game logic
- `src/app/singleplayer/page.tsx` - Click handling & state management
- `src/interfaces/Types.tsx` - Type definitions
