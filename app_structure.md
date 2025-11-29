It # Application Structure Overview

This document describes the current structure of the `burkhalter-computer-game` repository and the `rts-client` browser game.

## Repository Root

- `AGENTS.md` – contribution and coding guidelines.
- `stack.md` – technical stack and setup commands.
- `app_structure.md` – this file; keeps the agreed layout in sync.
- `rts-client/` – Vite + TypeScript + Babylon.js client (browser-based 3D prototype).

## rts-client Folder Layout

Within `rts-client/`:

- `index.html` – HTML shell containing the `#app` root element.
- `package.json` – npm scripts and dependencies.
- `tsconfig.json` – TypeScript configuration.
- `public/` – static assets served as-is (icons, future splash screens).
- `src/` – all client-side TypeScript and styles.
  - `main.ts` – application entry; boots the Babylon engine and render loop.
  - `style.css` – global styles, including sizing for the Babylon canvas.
  - `scene/` – 3D scene setup and entities.
    - `createScene.ts` – builds the Babylon scene (camera, lights, ground) and spawns agents.
    - `WanderingAgent.ts` – simple wandering agents with independent movement.
  - (legacy Vite starter files like `counter.ts` and `typescript.svg` can be removed once no longer needed.)

## Future Additions (Recommended)

As the project grows, mirror gameplay concepts with subfolders under `src/scene/`:

- `src/scene/environment/` – terrain, skyboxes, lighting presets.
- `src/scene/agents/` – units, movement, combat, animation controllers.
- `src/scene/ui/` – HUD, menus, overlays.
- `src/scene/state/` – game state, persistence, and networking.

Update this document whenever you add or reorganize major folders so both humans and AI helpers can rely on it as the source of truth.
