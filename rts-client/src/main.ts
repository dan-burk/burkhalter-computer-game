import './style.css';
import { Engine } from '@babylonjs/core/Engines/engine';
import { createScene, type SceneObjects } from './scene/createScene';

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
const sceneObjects: SceneObjects = createScene(engine, canvas);
engine.resize();

engine.runRenderLoop(() => {
    const deltaSeconds = engine.getDeltaTime() / 1000;
    sceneObjects.agents.forEach((agent) => agent.update(deltaSeconds));
    sceneObjects.scene.render();
});

window.addEventListener('resize', () => {
    engine.resize();
});
