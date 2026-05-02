# NHL Deal or No Deal

A Next.js + Tailwind game-show-style "Deal or No Deal" using NHL stars.

## Run

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## How to play

1. Pick one of 20 briefcases to keep as your own.
2. Open the other cases one at a time.
3. After every 4 opens, the banker calls with an offer (a player based on the score average of remaining cases).
4. Take the **DEAL** to walk away with the banker's player, or hit **NO DEAL** to keep playing.
5. If you survive all 4 banker rounds, your kept case is revealed.

## Structure

- `app/` — Next.js App Router pages and global styles
- `components/` — `GameBoard`, `CaseGrid`, `Case`, `SidePanel`, `BankerModal`, `ResultScreen`
- `data/players.js` — 20 NHL players with hidden scores (1–100)
