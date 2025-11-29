# Project Overview

This is a 2D Real-Time Strategy (RTS) game built to run in the browser. The project is in its early stages and currently contains the boilerplate code from the Vite TypeScript template.

**Tech Stack:**

*   **Runtime/Tooling:** Node.js (LTS, ARM64 build) + npm
*   **Language:** TypeScript
*   **Bundler/Dev Server:** Vite
*   **Game Library:** Phaser 3
*   **Editor:** VS Code

# Project Structure

The project is organized as follows:

*   `src/`: Contains the main source code for the game.
*   `assets/`: Contains all game assets, such as images, sounds, and fonts.
*   `tests/`: Contains the tests for the project.
*   `docs/`: Contains project documentation.

# Building and Running

The following commands are available from the project root:

*   `make run`: Starts the development server.
*   `make build`: Builds the project for production.
*   `make test`: Runs the test suite.

**TODO:** Create a `Makefile` to map these commands to the `npm` scripts in `rts-client/package.json`.

# Development Conventions

*   **Code Style:** 4-space indentation, `PascalCase` for classes/types, `camelCase` for functions/variables.
*   **Testing:** Tests should be placed in a `tests` directory that mirrors the `src` directory structure.
*   **Commits:** Use short, imperative commit messages (e.g., "Add player movement").
*   **Pull Requests:** Keep pull requests focused on a single logical change and include a summary of the changes and how they were tested.