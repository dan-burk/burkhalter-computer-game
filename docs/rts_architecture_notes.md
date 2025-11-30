# RTS Architecture Notes

This document captures the current architectural direction for the **rts-client** prototype and how it should evolve towards a Stronghold / AoE / Catan–style RTS.

## High-Level Separation

- `rts-client/src/game/` – **Game logic and state**
  - Pure TypeScript data structures and functions.
  - No Babylon.js types or DOM references.
  - Owns units, map data, players, selection, orders, and simulation rules.
- `rts-client/src/scene/` – **Babylon 3D view and input bindings**
  - Responsible for creating the Babylon `Scene`, camera, lights, and meshes.
  - Renders the current `GameState` using view classes (e.g., `WanderingAgent` as a unit view).
  - Translates browser/Babylon inputs (mouse, pointer events) into calls on the game layer (e.g., selection and move commands).

The long-term goal is:

- `game/` defines the RTS simulation that could run headless.
- `scene/` is just one possible visualisation of that simulation using Babylon.

## Core Game Concepts (Initial)

### Units

- Represented by a pure data model in `src/game/entities/Unit.ts`.
- Shape (initial):
  - `id`: stable identifier.
  - `position`: `{ x, y, z }` (world coordinates).
  - `facing`: `{ x, y, z }` (direction the unit is looking/moving).
  - `moveTarget?`: optional `{ x, y, z }` destination.
  - `selected`: boolean for UI state.
  - `ownerId`: string for which player owns the unit.

### Game State

- Implemented in `src/game/GameState.ts`.
- Responsibilities:
  - Hold the list of `Unit` objects.
  - Advance unit positions and facing over time (`update(deltaSeconds)`).
  - Enforce world bounds for movement.
  - Handle selection:
    - `selectSingleUnit(unitId | null)`.
  - Handle basic orders:
    - `moveSelectedUnitsTo(targetVec3)`.

### Simulation Rules (Current Scope)

- Movement:
  - Constant move speed (currently a single speed for all units).
  - Units move towards `moveTarget` until within a small threshold.
  - When the destination is reached, `moveTarget` is cleared.
- Bounds:
  - A world half-extent and padding define a clamped playable area.
  - Targets are clamped into this area before being applied to units.
- Selection:
  - Only one selected unit at a time (single-select).
  - Clicking empty ground does not change selection.
  - Right now, left-click on a unit selects it; left-click on ground with a unit selected issues a move order.

## Scene / View Layer

### Unit Views (`WanderingAgent`)

- `src/scene/WanderingAgent.ts` is a **view class**:
  - Constructs Babylon meshes for a single humanoid unit (torso, legs, arms, head, beard, selection ring).
  - Attaches metadata (`unitId`) to the root and body meshes so click picking can identify which unit was hit.
  - Exposes:
    - `syncFromUnit(unit)` – updates the Babylon transform and selection visuals from the pure `Unit` data.
    - `getRoot()` – returns the `TransformNode` root for the unit.
  - Contains **no gameplay logic** (no pathfinding, no move target state, no random wandering).

### Scene Construction (`createScene`)

- `src/scene/createScene.ts`:
  - Builds the Babylon `Scene`, camera, lights, ground, etc.
  - Creates a `WanderingAgent` view for each `Unit` in `GameState`.
  - Maintains a mapping `unitId -> WanderingAgent`.
  - Exposes:
    - `scene`: the Babylon `Scene`.
    - `syncFromGameState(gameState)`: called every frame to update all views from the game state.
  - Hooks pointer input:
    - On pointer down:
      - Ray-picks into the scene.
      - Resolves a `unitId` via mesh metadata (or parent metadata).
      - If a unit is clicked:
        - Calls `gameState.selectSingleUnit(unitId)`.
      - If ground is clicked and at least one unit is selected:
        - Calls `gameState.moveSelectedUnitsTo(worldPoint)`.

### Main Loop (`main.ts`)

- `src/main.ts` now owns the high-level loop:
  - Creates the Babylon engine and canvas.
  - Creates a `GameState` instance.
  - Creates the scene via `createScene(engine, canvas, gameState)`.
  - In the render loop:
    - Computes `deltaSeconds`.
    - Calls `gameState.update(deltaSeconds)` to advance the simulation.
    - Calls `sceneObjects.syncFromGameState(gameState)` to update all Babylon views.
    - Renders the scene.

This keeps the simulation in one place and the rendering in another.

## Input & Selection Robustness

The previous prototype relied on:

- Babylon-specific `metadata.agent` stored only on a root node.
- Walking up the parent chain at click time to find the agent.

This was fragile: any change in hierarchy or metadata usage could break clicking. The updated approach:

- Uses stable `unitId` metadata.
- Attaches metadata to all relevant meshes for a unit.
- Resolves picks to a `unitId` (via metadata and, if needed, parent chain).
- Delegates selection and movement to `GameState`.

This is more robust and makes it much easier to:

- Add multi-selection and box-select.
- Add different command types.
- Swap the renderer (Babylon vs. debug 2D) while keeping the same game rules.

## Future Extensions

- Add a richer `SelectionSystem` that supports:
  - Drag box selection.
  - Double-click select-all-of-type.
  - Control groups.
- Extend `GameState` to support:
  - Multiple players.
  - Basic resources and buildings.
  - Deterministic update steps suitable for replay/networking.
- Extend `scene/` to:
  - Use animation hints for walking/idle.
  - Add different unit types and visual variety.
  - Add camera bounds, edge scroll, and keyboard panning.

This document should be kept in sync with major architecture changes so both humans and AI helpers can reason about the game cleanly.

