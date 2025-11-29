import Phaser from 'phaser';
import { WORLD_HEIGHT, WORLD_WIDTH } from '../map/MapConfig';
import { createDesertBackground } from '../map/DesertMap';
import { createUnits, Unit } from '../units/Unit';

export class GameScene extends Phaser.Scene {
    private isDragging = false;

    private dragStartPoint?: Phaser.Math.Vector2;

    private cameraStartScroll?: Phaser.Math.Vector2;

    private readonly edgePanSpeed = 600;

    private readonly edgePanThreshold = 24;

    private pointerInsideGame = false;

    private units: Unit[] = [];

    public constructor() {
        super('GameScene');
    }

    public create(): void {
        this.cameras.main.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);
        this.physics.world.setBounds(0, 0, WORLD_WIDTH, WORLD_HEIGHT);

        createDesertBackground(this);
        this.units = createUnits(this);
        this.setupMousePanning();
        this.setupPointerPresenceTracking();
    }

    public update(): void {
        this.applyEdgeScrolling();
        this.units.forEach((unit) =>
            unit.update(this.game.loop.delta / 1000)
        );
    }

    private setupMousePanning(): void {
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (!pointer.middleButtonDown() && !pointer.rightButtonDown()) {
                return;
            }

            this.isDragging = true;
            this.dragStartPoint = new Phaser.Math.Vector2(pointer.x, pointer.y);
            this.cameraStartScroll = new Phaser.Math.Vector2(
                this.cameras.main.scrollX,
                this.cameras.main.scrollY
            );
        });

        this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (
                !this.isDragging ||
                !this.dragStartPoint ||
                !this.cameraStartScroll
            ) {
                return;
            }

            const camera = this.cameras.main;
            const deltaX = pointer.x - this.dragStartPoint.x;
            const deltaY = pointer.y - this.dragStartPoint.y;

            const targetScrollX = this.cameraStartScroll.x - deltaX;
            const targetScrollY = this.cameraStartScroll.y - deltaY;

            camera.scrollX = Phaser.Math.Clamp(
                targetScrollX,
                0,
                WORLD_WIDTH - camera.width
            );

            camera.scrollY = Phaser.Math.Clamp(
                targetScrollY,
                0,
                WORLD_HEIGHT - camera.height
            );
        });

        const stopDragging = () => {
            this.isDragging = false;
        };

        this.input.on('pointerup', stopDragging);
        this.input.on('pointerupoutside', stopDragging);
    }

    private applyEdgeScrolling(): void {
        if (!this.pointerInsideGame) {
            return;
        }

        const pointer = this.input.activePointer;
        const camera = this.cameras.main;

        const deltaSeconds = this.game.loop.delta / 1000;
        const moveDistance = this.edgePanSpeed * deltaSeconds;

        const threshold = this.edgePanThreshold;
        const screenWidth = this.scale.width;
        const screenHeight = this.scale.height;

        let horizontal = 0;
        let vertical = 0;

        if (pointer.x <= threshold) {
            horizontal -= 1;
        } else if (pointer.x >= screenWidth - threshold) {
            horizontal += 1;
        }

        if (pointer.y <= threshold) {
            vertical -= 1;
        } else if (pointer.y >= screenHeight - threshold) {
            vertical += 1;
        }

        if (horizontal === 0 && vertical === 0) {
            return;
        }

        const targetScrollX = camera.scrollX + horizontal * moveDistance;
        const targetScrollY = camera.scrollY + vertical * moveDistance;

        camera.scrollX = Phaser.Math.Clamp(
            targetScrollX,
            0,
            WORLD_WIDTH - camera.width
        );

        camera.scrollY = Phaser.Math.Clamp(
            targetScrollY,
            0,
            WORLD_HEIGHT - camera.height
        );
    }

    private setupPointerPresenceTracking(): void {
        this.pointerInsideGame = this.input.manager.isOver;

        this.input.on('gameover', () => {
            this.pointerInsideGame = true;
        });

        this.input.on('gameout', () => {
            this.pointerInsideGame = false;
        });
    }
}
