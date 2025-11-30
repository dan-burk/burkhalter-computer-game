import { Engine } from '@babylonjs/core/Engines/engine';
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import type { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Scene } from '@babylonjs/core/scene';
import { PointerEventTypes } from '@babylonjs/core/Events/pointerEvents';
import { Ray } from '@babylonjs/core/Culling/ray';
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { WanderingAgent } from './WanderingAgent';
import type { GameState } from '../game/GameState';
import type { UnitId, Vec3 } from '../game/entities/Unit';

export type SceneObjects = {
    scene: Scene;
    syncFromGameState: (gameState: GameState) => void;
};

const GROUND_SIZE = 70;
const CAMERA_ALPHA = -Math.PI / 2.2;
const CAMERA_BETA = Math.PI / 3;

const UNIT_COLORS = [
    Color3.FromHexString('#4a89e8'),
    Color3.FromHexString('#e86a4a')
];

// Ensure Ray side-effects (Scene.prototype picking helpers) are registered.
void Ray;

export function createScene(
    engine: Engine,
    canvas: HTMLCanvasElement,
    gameState: GameState
): SceneObjects {
    const scene = new Scene(engine);
    scene.clearColor = Color4.FromColor3(
        Color3.FromHexString('#1d2330'),
        1
    );

    const camera = new ArcRotateCamera(
        'camera',
        CAMERA_ALPHA,
        CAMERA_BETA,
        60,
        new Vector3(0, 6, 0),
        scene
    );

    camera.lowerAlphaLimit = CAMERA_ALPHA;
    camera.upperAlphaLimit = CAMERA_ALPHA;
    camera.lowerBetaLimit = CAMERA_BETA;
    camera.upperBetaLimit = CAMERA_BETA;
    camera.lowerRadiusLimit = 18;
    camera.upperRadiusLimit = 95;
    camera.panningAxis = new Vector3(0, 0, 0);
    camera.panningSensibility = 0;
    camera.attachControl(canvas);

    const light = new HemisphericLight(
        'light',
        new Vector3(0.2, 1, 0.3),
        scene
    );

    light.intensity = 1.1;

    const ground = MeshBuilder.CreateGround(
        'ground',
        { width: GROUND_SIZE, height: GROUND_SIZE, subdivisions: 2 },
        scene
    );

    const groundMaterial = new StandardMaterial('ground-mat', scene);
    groundMaterial.diffuseColor = Color3.FromHexString('#c9a96a');
    groundMaterial.specularColor = Color3.Black();
    ground.material = groundMaterial;

    const unitViews = new Map<UnitId, WanderingAgent>();

    gameState.units.forEach((unit, index) => {
        const color = UNIT_COLORS[index % UNIT_COLORS.length];
        const view = new WanderingAgent(scene, unit.id, color);
        unitViews.set(unit.id, view);
    });

    scene.onPointerObservable.add(
        (pointerInfo) => {
            const evt = pointerInfo.event as PointerEvent;

            if (evt.button !== 0) {
                return;
            }

            const pickInfo = scene.pick(evt.clientX, evt.clientY);

            if (!pickInfo || !pickInfo.hit) {
                return;
            }

            const mesh = pickInfo.pickedMesh as AbstractMesh | null;
            const unitId = getUnitIdFromMesh(mesh);

            if (unitId) {
                gameState.selectSingleUnit(unitId);
                return;
            }

            if (pickInfo.pickedPoint) {
                const destination: Vec3 = {
                    x: pickInfo.pickedPoint.x,
                    y: pickInfo.pickedPoint.y,
                    z: pickInfo.pickedPoint.z
                };

                gameState.moveSelectedUnitsTo(destination);
            }
        },
        PointerEventTypes.POINTERDOWN
    );

    const syncFromGameState = (state: GameState): void => {
        for (const unit of state.units) {
            const view = unitViews.get(unit.id);
            if (view) {
                view.syncFromUnit(unit);
            }
        }
    };

    return { scene, syncFromGameState };
}

function getUnitIdFromMesh(mesh: AbstractMesh | null): UnitId | null {
    let current: { metadata?: unknown; parent?: unknown } | null = mesh;

    while (current) {
        const metadata = current.metadata as { unitId?: UnitId } | undefined;
        if (metadata && metadata.unitId) {
            return metadata.unitId;
        }

        current = (current.parent as { metadata?: unknown } | null) ?? null;
    }

    return null;
}
