# Game Stack: Browser-Based 3D Prototype

This project now targets a **3D RTS prototype in the browser**, using a stack that works well with AI helpers and ARM64 Windows.

## Tech Stack Overview

- **Runtime / Tooling:** Node.js (LTS, ARM64 build) + npm
- **Language:** TypeScript
- **Bundler / Dev Server:** Vite
- **Game Library:** Babylon.js (3D engine)
- **Editor:** VS Code (with TypeScript + ESLint extensions)

## Prerequisites (Install Once)

Install these on each developer machine:

```bash
# 1) Install Node.js LTS (ARM64) from https://nodejs.org
# 2) In VS Code, open this repo folder
```

Optional but recommended:

- Git + GitHub (for collaboration)
- A modern browser (Edge, Chrome, etc.)

## Initial Project Setup (in this repo)

From the root of `burkhalter-computer-game` in a terminal (PowerShell is fine):

```bash
# Scaffold a Vite + TypeScript app into the current folder
npm create vite@latest . -- --template vanilla-ts

# Install dependencies
npm install

# Add Babylon.js
npm install @babylonjs/core
```

If `npm create vite@latest .` asks to overwrite files, you can instead create a subfolder:

```bash
npm create vite@latest rts-client -- --template vanilla-ts
cd rts-client
npm install
npm install @babylonjs/core
```

## Development & Build Commands

Run these from the project folder (root or `rts-client`, depending on which setup you chose):

```bash
# Start dev server (visit the printed URL in your browser)
npm run dev

# Production build
npm run build

# Preview the production build locally
npm run preview
```

These are the core commands AI helpers will assume when generating code snippets or instructions for this project.
