import type { Unit, UnitId, Vec3 } from './entities/Unit';
import { createInitialUnits } from './entities/Unit';

const MOVE_SPEED = 6;
const TARGET_REACH_THRESHOLD = 0.6;
const WORLD_HALF_EXTENT = 30;
const WORLD_PADDING = 4;

export class GameState {
    public readonly units: Unit[];

    public constructor() {
        this.units = createInitialUnits();
    }

    public update(deltaSeconds: number): void {
        for (const unit of this.units) {
            if (!unit.moveTarget) {
                continue;
            }

            const direction = subtract(unit.moveTarget, unit.position);
            const distance = length(direction);

            if (distance <= TARGET_REACH_THRESHOLD) {
                unit.moveTarget = undefined;
                continue;
            }

            const normalized = normalize(direction);
            const movement = scale(normalized, MOVE_SPEED * deltaSeconds);

            unit.position = add(unit.position, movement);

            const targetOnPlane: Vec3 = {
                x: unit.moveTarget.x,
                y: unit.position.y,
                z: unit.moveTarget.z
            };

            unit.facing = subtract(targetOnPlane, unit.position);
        }
    }

    public selectSingleUnit(unitId: UnitId | null): void {
        for (const unit of this.units) {
            unit.selected = unitId !== null && unit.id === unitId;
        }
    }

    public moveSelectedUnitsTo(target: Vec3): void {
        const clamped = this.clampToWorld(target);

        for (const unit of this.units) {
            if (!unit.selected) {
                continue;
            }

            unit.moveTarget = clamped;
        }
    }

    private clampToWorld(target: Vec3): Vec3 {
        const min = -WORLD_HALF_EXTENT + WORLD_PADDING;
        const max = WORLD_HALF_EXTENT - WORLD_PADDING;

        return {
            x: clamp(target.x, min, max),
            y: 0,
            z: clamp(target.z, min, max)
        };
    }
}

function add(a: Vec3, b: Vec3): Vec3 {
    return { x: a.x + b.x, y: a.y + b.y, z: a.z + b.z };
}

function subtract(a: Vec3, b: Vec3): Vec3 {
    return { x: a.x - b.x, y: a.y - b.y, z: a.z - b.z };
}

function scale(v: Vec3, s: number): Vec3 {
    return { x: v.x * s, y: v.y * s, z: v.z * s };
}

function length(v: Vec3): number {
    return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
}

function normalize(v: Vec3): Vec3 {
    const len = length(v);

    if (len === 0) {
        return { x: 0, y: 0, z: 0 };
    }

    const inv = 1 / len;

    return { x: v.x * inv, y: v.y * inv, z: v.z * inv };
}

function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
}

