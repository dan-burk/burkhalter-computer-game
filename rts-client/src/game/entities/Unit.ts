export type Vec3 = {
    x: number;
    y: number;
    z: number;
};

export type UnitId = string;

export interface Unit {
    id: UnitId;
    position: Vec3;
    facing: Vec3;
    moveTarget?: Vec3;
    selected: boolean;
    ownerId: string;
}

export function createInitialUnits(): Unit[] {
    return [
        {
            id: 'unit-1',
            position: { x: -5, y: 0, z: 0 },
            facing: { x: 1, y: 0, z: 0 },
            selected: false,
            ownerId: 'player-1'
        },
        {
            id: 'unit-2',
            position: { x: 5, y: 0, z: 0 },
            facing: { x: -1, y: 0, z: 0 },
            selected: false,
            ownerId: 'player-1'
        }
    ];
}

