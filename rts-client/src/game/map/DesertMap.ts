import Phaser from 'phaser';
import { WORLD_HEIGHT, WORLD_WIDTH } from './MapConfig';

export function createDesertBackground(scene: Phaser.Scene): void {
    const graphics = scene.add.graphics();

    graphics.fillStyle(0xc9a96a, 1);
    graphics.fillRect(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

    graphics.fillStyle(0xd8c07a, 0.4);

    const patchWidth = 96;
    const patchHeight = 64;
    const patchCount = 600;

    for (let index = 0; index < patchCount; index += 1) {
        const x = Math.random() * (WORLD_WIDTH - patchWidth);
        const y = Math.random() * (WORLD_HEIGHT - patchHeight);

        graphics.fillEllipse(x, y, patchWidth, patchHeight);
    }
}
