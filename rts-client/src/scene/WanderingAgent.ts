import { Scene } from '@babylonjs/core/scene';
import { TransformNode } from '@babylonjs/core/Meshes/transformNode';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import type { Unit, UnitId } from '../game/entities/Unit';

export class WanderingAgent {
    private readonly root: TransformNode;
    private readonly unitId: UnitId;
    private readonly selectionRing: Mesh;

    public constructor(scene: Scene, unitId: UnitId, color: Color3) {
        this.unitId = unitId;
        this.root = new TransformNode(`${unitId}-root`, scene);
        this.tagNodeWithUnit(this.root);
        this.selectionRing = this.createBodyMeshes(scene, color);
    }

    public getRoot(): TransformNode {
        return this.root;
    }

    public syncFromUnit(unit: Unit): void {
        this.root.position.set(
            unit.position.x,
            unit.position.y,
            unit.position.z
        );

        const hasFacing =
            unit.facing.x !== 0 || unit.facing.y !== 0 || unit.facing.z !== 0;

        if (hasFacing) {
            const target = new Vector3(
                unit.position.x + unit.facing.x,
                unit.position.y + unit.facing.y,
                unit.position.z + unit.facing.z
            );
            this.root.lookAt(target);
        }

        this.selectionRing.setEnabled(unit.selected);
    }

    private createBodyMeshes(scene: Scene, color: Color3): Mesh {
        const clothColor = color.clone();
        const pantsColor = color.scale(0.6);
        const skinColor = Color3.FromHexString('#d8b08a');
        const beardColor = Color3.FromHexString('#4b3621');

        const clothMaterial = new StandardMaterial(
            `${this.root.name}-cloth-mat`,
            scene
        );
        clothMaterial.diffuseColor = clothColor;
        clothMaterial.specularColor = clothColor.scale(0.25);
        clothMaterial.emissiveColor = clothColor.scale(0.08);

        const pantsMaterial = new StandardMaterial(
            `${this.root.name}-pants-mat`,
            scene
        );
        pantsMaterial.diffuseColor = pantsColor;
        pantsMaterial.specularColor = pantsColor.scale(0.2);

        const skinMaterial = new StandardMaterial(
            `${this.root.name}-skin-mat`,
            scene
        );
        skinMaterial.diffuseColor = skinColor;
        skinMaterial.specularColor = skinColor.scale(0.05);
        skinMaterial.emissiveColor = skinColor.scale(0.03);

        const beardMaterial = new StandardMaterial(
            `${this.root.name}-beard-mat`,
            scene
        );
        beardMaterial.diffuseColor = beardColor;
        beardMaterial.specularColor = beardColor.scale(0.1);

        const torso = MeshBuilder.CreateBox(
            `${this.root.name}-torso`,
            { width: 0.9, depth: 0.6, height: 1.2 },
            scene
        );
        torso.position.y = 1.3;
        torso.material = clothMaterial;
        torso.parent = this.root;
        this.tagNodeWithUnit(torso);

        const leftLeg = MeshBuilder.CreateBox(
            `${this.root.name}-left-leg`,
            { width: 0.22, depth: 0.24, height: 0.7 },
            scene
        );
        leftLeg.position = new Vector3(-0.18, 0.35, 0);
        leftLeg.material = pantsMaterial;
        leftLeg.parent = this.root;
        this.tagNodeWithUnit(leftLeg);

        const rightLeg = leftLeg.clone(`${this.root.name}-right-leg`);
        rightLeg.position.x = 0.18;
        rightLeg.parent = this.root;
        this.tagNodeWithUnit(rightLeg);

        const head = MeshBuilder.CreateSphere(
            `${this.root.name}-head`,
            { diameter: 0.55 },
            scene
        );
        head.position.y = 2.15;
        head.material = skinMaterial;
        head.parent = this.root;
        this.tagNodeWithUnit(head);

        const beard = MeshBuilder.CreateCylinder(
            `${this.root.name}-beard`,
            {
                diameterTop: 0.38,
                diameterBottom: 0.55,
                height: 0.35,
                tessellation: 8
            },
            scene
        );
        beard.position = new Vector3(0, 1.9, 0.16);
        beard.material = beardMaterial;
        beard.parent = this.root;
        this.tagNodeWithUnit(beard);

        const leftArm = MeshBuilder.CreateBox(
            `${this.root.name}-left-arm`,
            { width: 0.65, height: 0.18, depth: 0.18 },
            scene
        );
        leftArm.position = new Vector3(-0.72, 1.35, 0);
        leftArm.material = clothMaterial;
        leftArm.parent = this.root;
        this.tagNodeWithUnit(leftArm);

        const rightArm = leftArm.clone(`${this.root.name}-right-arm`);
        rightArm.position.x = 0.72;
        rightArm.parent = this.root;
        this.tagNodeWithUnit(rightArm);

        const leftHand = MeshBuilder.CreateSphere(
            `${this.root.name}-left-hand`,
            { diameter: 0.18 },
            scene
        );
        leftHand.position = new Vector3(-1.05, 1.35, 0);
        leftHand.material = skinMaterial;
        leftHand.parent = this.root;
        this.tagNodeWithUnit(leftHand);

        const rightHand = leftHand.clone(`${this.root.name}-right-hand`);
        rightHand.position.x = 1.05;
        rightHand.parent = this.root;
        this.tagNodeWithUnit(rightHand);

        const selectionRing = MeshBuilder.CreateCylinder(
            `${this.root.name}-selection-ring`,
            {
                diameter: 1.7,
                height: 0.05,
                tessellation: 24
            },
            scene
        );
        selectionRing.position.y = 0.03;

        const selectionMaterial = new StandardMaterial(
            `${this.root.name}-selection-mat`,
            scene
        );
        selectionMaterial.diffuseColor = Color3.FromHexString('#f5e29f');
        selectionMaterial.emissiveColor = Color3.FromHexString('#f9f3c5');
        selectionMaterial.specularColor = Color3.Black();
        selectionRing.material = selectionMaterial;
        selectionRing.isPickable = false;
        selectionRing.setEnabled(false);
        selectionRing.parent = this.root;
        this.tagNodeWithUnit(selectionRing);

        return selectionRing;
    }

    private tagNodeWithUnit(node: { metadata?: unknown }): void {
        if (!node.metadata) {
            node.metadata = {};
        }

        (node.metadata as { unitId?: UnitId }).unitId = this.unitId;
    }
}
