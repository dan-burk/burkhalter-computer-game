import Phaser from 'phaser';
import { WORLD_HEIGHT, WORLD_WIDTH } from '../map/MapConfig';

const UNIT_TEXTURE_KEY = 'unit-soldier';
const UNIT_RADIUS = 12;
const UNIT_SPEED = 140;
const TARGET_PADDING = 64;

export class Unit {
    private target?: Phaser.Math.Vector2;

    public constructor(
        private readonly sprite: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody
    ) {}

    public update(deltaSeconds: number): void {
        if (!this.target) {
            this.pickNewTarget();
            return;
        }

        const current = new Phaser.Math.Vector2(
            this.sprite.x,
            this.sprite.y
        );

        const distance = current.distance(this.target);
        const threshold = UNIT_RADIUS;

        if (distance <= threshold) {
            this.pickNewTarget();
            return;
        }

        const direction = this.target.clone().subtract(current).normalize();

        this.sprite.setVelocity(
            direction.x * UNIT_SPEED,
            direction.y * UNIT_SPEED
        );
    }

    private pickNewTarget(): void {
        this.target = new Phaser.Math.Vector2(
            Phaser.Math.Between(TARGET_PADDING, WORLD_WIDTH - TARGET_PADDING),
            Phaser.Math.Between(TARGET_PADDING, WORLD_HEIGHT - TARGET_PADDING)
        );

        this.sprite.setVelocity(0, 0);
    }
}

export function createUnits(scene: Phaser.Scene): Unit[] {
    createUnitTextureIfMissing(scene);

    const createOne = (x: number, y: number) => {
        const sprite = scene.physics.add
            .sprite(x, y, UNIT_TEXTURE_KEY)
            .setScale(1)
            .setCircle(UNIT_RADIUS, 0, 0)
            .setDepth(5);

        // Small hover to keep them visually separate from the map.
        sprite.setBounce(0);
        sprite.setCollideWorldBounds(true);
        sprite.body.setAllowGravity(false);

        return new Unit(sprite);
    };

    const unitOne = createOne(WORLD_WIDTH / 2 - 80, WORLD_HEIGHT / 2);
    const unitTwo = createOne(WORLD_WIDTH / 2 + 80, WORLD_HEIGHT / 2);

    return [unitOne, unitTwo];
}

function createUnitTextureIfMissing(scene: Phaser.Scene): void {
    if (scene.textures.exists(UNIT_TEXTURE_KEY)) {
        return;
    }

    const graphics = scene.add.graphics();

    graphics.fillStyle(0x4a89e8, 1);
    graphics.fillCircle(UNIT_RADIUS, UNIT_RADIUS, UNIT_RADIUS);

    graphics.lineStyle(2, 0xffffff, 0.9);
    graphics.strokeCircle(UNIT_RADIUS, UNIT_RADIUS, UNIT_RADIUS - 1);

    graphics.generateTexture(
        UNIT_TEXTURE_KEY,
        UNIT_RADIUS * 2,
        UNIT_RADIUS * 2
    );

    graphics.destroy();
}
