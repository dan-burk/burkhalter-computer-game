# Application Structure Overview

This document describes the current structure of the `burkhalter-computer-game` repository and the `rts-client` browser prototype.

## Repository Root

- `AGENTS.md` ’'?" contribution rules plus current state/next steps for the RTS prototype.
- `stack.md` ’'?" technical stack and setup commands.
- `app_structure.md` ’'?" this file; keeps the agreed layout in sync.
- `rts-client/` ’'?" Vite + TypeScript + Babylon.js client (browser-based 3D prototype).
- `docs/` ’'?" design and architecture notes (for example `docs/rts_architecture_notes.md`).

## rts-client Folder Layout

Within `rts-client/`:

- `index.html` ’'?" HTML shell containing the `#app` root element.
- `package.json` ’'?" npm scripts and dependencies.
- `tsconfig.json` ’'?" TypeScript configuration.
- `public/` ’'?" static assets served as-is (icons, future splash screens).
- `src/` ’'?" all client-side TypeScript and styles.
  - `main.ts` ’'?" application entry; boots the Babylon engine and render loop.
  - `style.css` ’'?" global styles, including sizing for the Babylon canvas.
  - `game/` ’'?" pure game logic and state (units, selection, simulation), independent of Babylon.
  - `scene/` ’'?" 3D scene setup and entities.
    - `createScene.ts` ’'?" builds the Babylon scene (camera, lights, ground), wires input, and renders the current game state. Camera is locked to a fixed isometric angle; scroll wheel zooms (panning to be added).
    - `WanderingAgent.ts` ’'?" view-only unit renderer: builds low-poly humanoid meshes (torso, legs, arms, hands, head, tapered beard) with simple materials, plus a selection ring, and syncs them from the pure game `Unit` data.
  - (legacy Vite starter files like `counter.ts` and `typescript.svg` can be removed once no longer needed.)

## Current Scene Snapshot

- World: flat ground plane sized 70 units, hemispheric light, dark blue background.
- Camera: ArcRotate locked at a fixed angle; map remains fixed and user zooms with the wheel.
- Units: two agents spawned on opposite sides; left-click selects, and left-clicking on the ground with a unit selected issues a move command.

## Future Additions (Recommended)

As the project grows, mirror gameplay concepts with subfolders under `src/scene/`:

- `src/scene/environment/` ’'?" terrain, skyboxes, lighting presets.
- `src/scene/agents/` ’'?" units, movement, combat, animation controllers.
- `src/scene/ui/` ’'?" HUD, menus, overlays.
- `src/scene/state/` ’'?" game state, persistence, and networking.

Update this document whenever you add or reorganize major folders so both humans and AI helpers can rely on it as the source of truth.

