import { Engine } from '@babylonjs/core/Engines/engine';
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Scene } from '@babylonjs/core/scene';
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { createAgents, WanderingAgent } from './WanderingAgent';

export type SceneObjects = {
    scene: Scene;
    agents: WanderingAgent[];
};

const GROUND_SIZE = 70;

export function createScene(
    engine: Engine,
    canvas: HTMLCanvasElement
): SceneObjects {
    const scene = new Scene(engine);
    scene.clearColor = Color4.FromColor3(
        Color3.FromHexString('#1d2330'),
        1
    );

    const camera = new ArcRotateCamera(
        'camera',
        -Math.PI / 2.2,
        Math.PI / 3,
        60,
        new Vector3(0, 6, 0),
        scene
    );

    camera.lowerBetaLimit = 0.25;
    camera.upperBetaLimit = Math.PI / 2.1;
    camera.lowerRadiusLimit = 18;
    camera.upperRadiusLimit = 95;
    camera.attachControl(canvas, true);

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

    const agents = createAgents(scene);

    return { scene, agents };
}
