"use strict";
var Snake_3D;
(function (Snake_3D) {
    var f = FudgeCore;
    class GameObject extends f.Node {
        constructor(_name, _size, _position, _rotation) {
            super(_name);
            this.addComponent(new f.ComponentTransform(f.Matrix4x4.TRANSLATION(_position)));
            this.mtxLocal.rotation = _rotation;
            let cmpQuad = new f.ComponentMesh(GameObject.meshCube);
            this.addComponent(cmpQuad);
            cmpQuad.pivot.scale(_size.toVector3(1));
            this.mtxPivot = this.getComponent(f.ComponentMesh).pivot;
        }
        calculateBounce(_posWith, _radius = 1) {
            // make sure inversions exist
            this.calculatePivotInverse();
            this.calculateCompleteAndInverse();
            // transform position and radius to mesh coordinates
            let posLocal = f.Vector3.TRANSFORMATION(_posWith, this.mtxCompleteInverse, true);
            let vctRadiusLocal = f.Vector3.TRANSFORMATION(f.Vector3.X(_radius), this.mtxPivotInverse);
            // return if behind mesh or further away than radius. Prerequisite: pivot.z of this object hasn't been scaled!!
            if (posLocal.z < 0 || posLocal.z > _radius)
                return null;
            // return if further to the side than 0.5 (the half of the width of the mesh) plus the transformed radius
            if (Math.abs(posLocal.x) > 0.5 + vctRadiusLocal.x)
                return null;
            // bounce in system local to mesh
            posLocal.z = _radius * 1.001;
            // transform back to world system
            posLocal.transform(this.mtxComplete, true);
            return posLocal;
        }
        calculatePivotInverse() {
            if (this.mtxPivotInverse)
                return;
            this.mtxPivotInverse = f.Matrix4x4.INVERSION(this.mtxPivot);
        }
        calculateCompleteAndInverse() {
            if (this.mtxComplete)
                return;
            this.mtxComplete = f.Matrix4x4.MULTIPLICATION(this.mtxWorld, this.mtxPivot);
            this.mtxCompleteInverse = f.Matrix4x4.MULTIPLICATION(this.mtxPivotInverse, this.mtxWorldInverse);
        }
    }
    GameObject.meshCube = new f.MeshCube();
    Snake_3D.GameObject = GameObject;
})(Snake_3D || (Snake_3D = {}));
var Snake_3D;
(function (Snake_3D) {
    var f = FudgeCore;
    var fcaid = FudgeAid;
    window.addEventListener("load", hndLoad);
    const clrWhite = ƒ.Color.CSS("white");
    Snake_3D.sizeWall = 1;
    Snake_3D.numWalls = 32;
    let root;
    let arena;
    let cmpCamera;
    let meshQuad = new f.MeshQuad("Quad");
    function hndLoad(_event) {
        const canvas = document.querySelector("canvas");
        f.Debug.log(canvas);
        root = new f.Node("Root");
        arena = new f.Node("Arena");
        Snake_3D.avatar = new ƒ.Node("Avatar");
        Snake_3D.food = new ƒ.Node("Food");
        arena = createArena();
        root.appendChild(arena);
        cmpCamera = new f.ComponentCamera();
        cmpCamera.projectCentral(1, 60, ƒ.FIELD_OF_VIEW.DIAGONAL, 0.2, 10000);
        cmpCamera.pivot.translate(ƒ.Vector3.Y(8));
        cmpCamera.pivot.rotateX(35);
        cmpCamera.backgroundColor = f.Color.CSS("darkblue");
        Snake_3D.avatar.addComponent(cmpCamera);
        Snake_3D.avatar.addComponent(new ƒ.ComponentTransform());
        Snake_3D.avatar.mtxLocal.translate(ƒ.Vector3.Z(8));
        Snake_3D.avatar.mtxLocal.translate(ƒ.Vector3.Y(0));
        Snake_3D.avatar.mtxLocal.translate(ƒ.Vector3.X(0));
        Snake_3D.avatar.mtxLocal.rotate(ƒ.Vector3.Y(180));
        root.appendChild(Snake_3D.avatar);
        Snake_3D.viewport = new f.Viewport();
        Snake_3D.viewport.initialize("Viewport", root, cmpCamera, canvas);
        f.Debug.log(Snake_3D.viewport);
        f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, hndLoop);
        f.Loop.start(f.LOOP_MODE.TIME_GAME, 60);
    }
    function hndLoop(_event) {
        Snake_3D.viewport.draw();
    }
    function createArena() {
        let arena = new f.Node("Arena");
        let walls = new ƒ.Node("Walls");
        let txtFloor = new ƒ.TextureImage("assets/grass.jpg");
        let mtrFloor = new ƒ.Material("Floor", ƒ.ShaderTexture, new ƒ.CoatTextured(null, txtFloor));
        let floor = new fcaid.Node("Floor", ƒ.Matrix4x4.ROTATION_X(-90), mtrFloor, meshQuad);
        floor.mtxLocal.scale(ƒ.Vector3.ONE(Snake_3D.numWalls - 1));
        floor.getComponent(ƒ.ComponentMaterial).pivot.scale(ƒ.Vector2.ONE(10));
        arena.appendChild(floor);
        let txtWall = new ƒ.TextureImage("assets/wall.png");
        let mtrWall = new ƒ.Material("Wall", ƒ.ShaderTexture, new ƒ.CoatTextured(clrWhite, txtWall));
        for (let i = -Snake_3D.numWalls / 2 + 0.5; i < Snake_3D.numWalls / 2; i++) {
            walls.appendChild(new Snake_3D.Wall(ƒ.Vector2.ONE(Snake_3D.sizeWall), ƒ.Vector3.SCALE(new ƒ.Vector3(-Snake_3D.numWalls / 2, Snake_3D.sizeWall / 2, i * Snake_3D.sizeWall), 1), ƒ.Vector3.Y(90), mtrWall));
            walls.appendChild(new Snake_3D.Wall(ƒ.Vector2.ONE(Snake_3D.sizeWall), ƒ.Vector3.SCALE(new ƒ.Vector3(Snake_3D.numWalls / 2, Snake_3D.sizeWall / 2, i * Snake_3D.sizeWall), 1), ƒ.Vector3.Y(-90), mtrWall));
            walls.appendChild(new Snake_3D.Wall(ƒ.Vector2.ONE(Snake_3D.sizeWall), ƒ.Vector3.SCALE(new ƒ.Vector3(i * Snake_3D.sizeWall, Snake_3D.sizeWall / 2, -Snake_3D.numWalls / 2), 1), ƒ.Vector3.Y(0), mtrWall));
            walls.appendChild(new Snake_3D.Wall(ƒ.Vector2.ONE(Snake_3D.sizeWall), ƒ.Vector3.SCALE(new ƒ.Vector3(i * Snake_3D.sizeWall, Snake_3D.sizeWall / 2, Snake_3D.numWalls / 2), 1), ƒ.Vector3.Y(180), mtrWall));
        }
        arena.appendChild(walls);
        return arena;
    }
})(Snake_3D || (Snake_3D = {}));
/// <reference path="GameObject.ts"/>
var Snake_3D;
/// <reference path="GameObject.ts"/>
(function (Snake_3D) {
    var f = FudgeCore;
    class Wall extends Snake_3D.GameObject {
        // private static readonly meshQuad: ƒ.MeshQuad = new ƒ.MeshQuad();
        constructor(_size, _position, _rotation, _material) {
            super("Wall", _size, _position, _rotation);
            let cmpMaterial = new f.ComponentMaterial(_material);
            cmpMaterial.pivot.scale(f.Vector2.ONE(1));
            this.addComponent(cmpMaterial);
        }
    }
    Snake_3D.Wall = Wall;
})(Snake_3D || (Snake_3D = {}));
//# sourceMappingURL=Main.js.map