# Repository Guidelines

This document guides contributors to `burkhalter-computer-game`. Keep changes small, well-tested, and clearly explained so the game remains stable and easy to extend.

## Project Structure & Module Organization

- `src/` – gameplay and engine-facing code (for example `src/player`, `src/world`, `src/ui`).
- `assets/` – art, audio, fonts, prefabs, and level data.
- `tests/` – automated tests mirroring the `src/` layout.
- `docs/` – design notes, diagrams, and longer-form documentation.

Keep modules feature-focused (player, combat, levels) rather than overly generic utilities.

## Build, Test, and Development Commands

Standardize on simple wrapper commands (add them if missing):

- `make run` – start the game locally in development mode.
- `make build` – produce an optimized build into `build/`.
- `make test` – run the full automated test suite.

If you use another tool (e.g., engine GUI, `npm`, `dotnet`, `python`), wire it into these targets or equivalent scripts and update `README.md` accordingly.

## Coding Style & Naming Conventions

- Use 4-space indentation and avoid tabs.
- Use `PascalCase` for classes/types, `camelCase` for functions and variables, and `snake_case` for file names where the language allows.
- Prefer clear, domain-based names (`PlayerInventory`, `EnemySpawner`) over abbreviations.
- If a formatter or linter exists, run it before committing and fix warnings in touched code.

## Testing Guidelines

- Place tests under `tests/feature_name/` to mirror `src/feature_name/`.
- Name tests descriptively (e.g., `test_player_inventory_overflow`, `TestCombatSystem`).
- Add tests for every bug fix and every non-trivial feature.
- Run `make test` (or the project’s equivalent) before pushing.

## Commit & Pull Request Guidelines

- Use short, imperative commit messages: “Add inventory system”, “Fix enemy pathfinding”.
- Keep each commit and PR focused on a single logical change.
- In PRs, include: a concise summary, how you tested the change, and links to related issues (e.g., `Closes #12`), plus screenshots or short videos for visible gameplay changes.

## Agent-Specific Instructions

- AI assistants must follow these guidelines and prefer minimal, focused edits.
- Do not assume undocumented build commands exist; when adding or changing them, update both this file and `README.md`.

## Current State (RTS Prototype)

- Engine: Vite + TypeScript + Babylon.js under `rts-client/`.
- Camera: ArcRotate camera locked to a fixed isometric angle; left-drag pans north/south/east/west, scroll wheel zooms, rotation disabled so the map stays fixed.
- Units: Wandering agents now use low-poly humanoid meshes (torso, legs, arms, hands, head, tapered beard) with simple materials for cloth, pants, skin, and beard. Movement is still random wandering across the ground plane.
- Scene: Flat ground plane with hemispheric light and two wandering agents spawned at opposite sides.

## Near-Term Goals

- Add simple walk/idle animation hints (leg swing or arm sway) to make movement feel alive.
- Introduce unit variety (height/colors/headgear) and optional accessories without complex rigging.
- Expand camera polish (keyboard pan, edge scroll, movement bounds) as the environment grows.
- Surface basic controls in UI/README for new testers (drag to pan, scroll to zoom).

## Long-Term Vision

- Grow the RTS prototype into our own small blend of **Stronghold Crusader**, **Age of Empires**, and **Catan** – combining base-building and territorial control with resource-focused, boardgame-style economy and trading.
