import { Scene } from '@babylonjs/core/scene';
import { TransformNode } from '@babylonjs/core/Meshes/transformNode';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';

const MOVE_SPEED = 6;
const TARGET_REACH_THRESHOLD = 0.6;
const WORLD_HALF_EXTENT = 30;
const WORLD_PADDING = 4;

export class WanderingAgent {
    private readonly root: TransformNode;
    private readonly color: Color3;
    private target?: Vector3;

    public constructor(root: TransformNode, color: Color3) {
        this.root = root;
        this.color = color;
        this.createBodyMeshes();
    }

    public update(deltaSeconds: number): void {
        if (!this.target) {
            this.pickNewTarget();
            return;
        }

        const direction = this.target.subtract(this.root.position);
        const distance = direction.length();

        if (distance <= TARGET_REACH_THRESHOLD) {
            this.pickNewTarget();
            return;
        }

        direction.normalize();

        const movement = direction.scale(MOVE_SPEED * deltaSeconds);
        this.root.position.addInPlace(movement);

        const targetOnPlane = this.target.clone();
        targetOnPlane.y = this.root.position.y;
        this.root.lookAt(targetOnPlane);
    }

    private pickNewTarget(): void {
        const range =
            WORLD_HALF_EXTENT - WORLD_PADDING > 0
                ? WORLD_HALF_EXTENT - WORLD_PADDING
                : WORLD_HALF_EXTENT;

        this.target = new Vector3(
            randomWithinRange(range),
            0,
            randomWithinRange(range)
        );
    }

    private createBodyMeshes(): void {
        const body = MeshBuilder.CreateBox(
            `${this.root.name}-body`,
            { width: 1, depth: 0.8, height: 1.6 },
            this.root.getScene()
        );

        body.position.y = 0.8;

        const head = MeshBuilder.CreateSphere(
            `${this.root.name}-head`,
            { diameter: 0.8 },
            this.root.getScene()
        );

        head.position.y = 1.6;

        const material = new StandardMaterial(
            `${this.root.name}-mat`,
            this.root.getScene()
        );

        material.diffuseColor = this.color.clone();
        material.specularColor = this.color.scale(0.4);
        material.emissiveColor = this.color.scale(0.1);

        body.material = material;

        const headMaterial = new StandardMaterial(
            `${this.root.name}-head-mat`,
            this.root.getScene()
        );

        headMaterial.diffuseColor = Color3.White();
        head.material = headMaterial;

        body.parent = this.root;
        head.parent = this.root;
    }
}

export function createAgents(scene: Scene): WanderingAgent[] {
    const agentOneRoot = new TransformNode('agent-one-root', scene);
    const agentTwoRoot = new TransformNode('agent-two-root', scene);

    agentOneRoot.position = new Vector3(-5, 0, 0);
    agentTwoRoot.position = new Vector3(5, 0, 0);

    const agentOne = new WanderingAgent(
        agentOneRoot,
        Color3.FromHexString('#4a89e8')
    );
    const agentTwo = new WanderingAgent(
        agentTwoRoot,
        Color3.FromHexString('#e86a4a')
    );

    return [agentOne, agentTwo];
}

function randomWithinRange(range: number): number {
    return Math.random() * range * 2 - range;
}
