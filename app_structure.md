# Application Structure Overview

This document describes the current structure of the `burkhalter-computer-game` repository and the `rts-client` browser game.

## Repository Root

- `AGENTS.md` – contribution and coding guidelines.
- `stack.md` – technical stack and setup commands.
- `app_structure.md` – this file; keeps the agreed layout in sync.
- `rts-client/` – Vite + TypeScript + Phaser client (browser-based 2D RTS).

## rts-client Folder Layout

Within `rts-client/`:

- `index.html` – HTML shell containing the `#app` root element.
- `package.json` – npm scripts and dependencies.
- `tsconfig.json` – TypeScript configuration.
- `public/` – static assets served as-is (icons, future splash screens).
- `src/` – all client-side TypeScript and styles.
  - `main.ts` – application entry; boots the Phaser game using `createGame`.
  - `style.css` – global styles, including sizing for the Phaser canvas.
  - `game/` – game-specific code.
    - `index.ts` – exports `createGame`, configuring the Phaser `Game`.
    - `scenes/` – Phaser scenes.
      - `GameScene.ts` – main scene rendering the desert map and handling camera movement.
    - `map/` – world and terrain configuration.
      - `MapConfig.ts` – shared constants for tile size and world dimensions.
      - `DesertMap.ts` – helper to draw the base desert background.
  - (legacy Vite starter files like `counter.ts` and `typescript.svg` can be removed once no longer needed.)

## Future Additions (Recommended)

As the project grows, mirror gameplay concepts with subfolders under `src/game/`:

- `src/game/map/` – map generation, tiles, terrain.
- `src/game/units/` – units, movement, combat.
- `src/game/ui/` – HUD, menus, overlays.
- `src/game/state/` – game state, persistence, and networking.

Update this document whenever you add or reorganize major folders so both humans and AI helpers can rely on it as the source of truth.
