import Phaser from 'phaser';
import { WORLD_HEIGHT, WORLD_WIDTH } from './MapConfig';

const DESERT_TILE_KEY = 'desert-tile';
const DESERT_TILE_SIZE = 512;
const DESERT_PATCH_COUNT = 80;

export function createDesertBackground(scene: Phaser.Scene): void {
    createTileTextureIfMissing(scene);

    const background = scene.add.tileSprite(
        0,
        0,
        WORLD_WIDTH,
        WORLD_HEIGHT,
        DESERT_TILE_KEY
    );

    background.setOrigin(0, 0);
}

function createTileTextureIfMissing(scene: Phaser.Scene): void {
    if (scene.textures.exists(DESERT_TILE_KEY)) {
        return;
    }

    const graphics = scene.add.graphics();

    graphics.fillStyle(0xc9a96a, 1);
    graphics.fillRect(0, 0, DESERT_TILE_SIZE, DESERT_TILE_SIZE);

    graphics.fillStyle(0xd8c07a, 0.4);

    const patchWidth = 96;
    const patchHeight = 64;

    for (let index = 0; index < DESERT_PATCH_COUNT; index += 1) {
        const x =
            Phaser.Math.Between(
                patchWidth / 2,
                DESERT_TILE_SIZE - patchWidth / 2
            );
        const y =
            Phaser.Math.Between(
                patchHeight / 2,
                DESERT_TILE_SIZE - patchHeight / 2
            );

        graphics.fillEllipse(x, y, patchWidth, patchHeight);
    }

    graphics.generateTexture(
        DESERT_TILE_KEY,
        DESERT_TILE_SIZE,
        DESERT_TILE_SIZE
    );

    graphics.destroy();
}
