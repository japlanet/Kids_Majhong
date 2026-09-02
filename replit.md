# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Artifacts

### Tile Match (`artifacts/mahjong-kids`)
- **Preview path**: `/`
- **Type**: React + Vite (frontend only, no backend)
- **Live site**: https://japlanet.github.io/Kids_Majhong/ — deployed by `.github/workflows/deploy.yml` on every push to `main`
- **Description**: A Mahjong-style tile matching puzzle game for kids (first graders)
- **Features**:
  - 30 levels across 10 emoji themes, grouped into tiers of increasing board size
  - Hint button (💡) that highlights a matching pair, with a short cooldown
  - Sound effects (Web Audio, on by default, toggle in the header)
  - Progress bar, pair counter, confetti + celebration modal on level completion
  - Completed levels saved to localStorage
  - Installable to the home screen (manifest + icons) and playable offline (`public/sw.js`)
  - Touch-friendly large tiles for iPad; no reading required
- **Game Logic**: `src/game/engine.ts` — tile building, match logic, hint finder
- **Levels**: `src/game/levels.ts` — tile sets and the 30-level table
