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

