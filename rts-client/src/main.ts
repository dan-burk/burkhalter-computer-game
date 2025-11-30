import './style.css';
import { Engine } from '@babylonjs/core/Engines/engine';
import { createScene, type SceneObjects } from './scene/createScene';
import { GameState } from './game/GameState';

const container = document.querySelector<HTMLDivElement>('#app');

if (!container) {
    throw new Error('Root container element "#app" was not found.');
}

const canvas = document.createElement('canvas');
canvas.id = 'render-canvas';
canvas.setAttribute('aria-label', '3D scene');
canvas.setAttribute('role', 'presentation');
container.appendChild(canvas);

const engine = new Engine(canvas, true);
const gameState = new GameState();
const sceneObjects: SceneObjects = createScene(engine, canvas, gameState);
engine.resize();

engine.runRenderLoop(() => {
    const deltaSeconds = engine.getDeltaTime() / 1000;
    gameState.update(deltaSeconds);
    sceneObjects.syncFromGameState(gameState);
    sceneObjects.scene.render();
});

window.addEventListener('resize', () => {
    engine.resize();
});
