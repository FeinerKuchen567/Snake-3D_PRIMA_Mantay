"use strict";
var Snake_3D;
(function (Snake_3D) {
    var f = FudgeCore;
    class Avatar extends f.Node {
        constructor(_name, _cam) {
            super(_name);
            _cam.pivot.translate(new f.Vector3(0, 7, -9));
            _cam.pivot.rotateX(45);
            _cam.backgroundColor = f.Color.CSS("darkblue");
            this.addComponent(_cam);
            this.addComponent(new f.ComponentTransform(f.Matrix4x4.TRANSLATION(f.Vector3.ONE())));
            this.mtxLocal.rotate(f.Vector3.Y(180));
            let txtHead = new f.TextureImage("assets/Head.png");
            let mtrHead = new f.Material("Head", f.ShaderTexture, new f.CoatTextured(null, txtHead));
            let txtBody = new f.TextureImage("assets/Body.png");
            let mtrBody = new f.Material("Body", f.ShaderTexture, new f.CoatTextured(null, txtBody));
            let snake = new f.Node("Snake");
            let head = new f.Node("Head");
            let head0 = new f.Node("Mund");
            let cmpHead0 = new f.ComponentMesh(Avatar.meshCube);
            cmpHead0.pivot.scale(new f.Vector3(1, 0.74, 0.96));
            head0.addComponent(cmpHead0);
            head0.addComponent(new f.ComponentMaterial(mtrHead));
            head.appendChild(head0);
            let head1 = new f.Node("Augen");
            let cmpHead1 = new f.ComponentMesh(Avatar.meshCube);
            cmpHead1.pivot.translate(new f.Vector3(0.3, 0.54, 0));
            cmpHead1.pivot.scale(new f.Vector3(0.4, 0.4, 0.88));
            head1.addComponent(cmpHead1);
            head1.addComponent(new f.ComponentMaterial(mtrHead));
            head.appendChild(head1);
            head.addComponent(new f.ComponentTransform());
            head.mtxLocal.rotateY(90);
            snake.appendChild(head);
            let body = new f.Node("Body");
            let cmpBody = new f.ComponentMesh(Avatar.meshCube);
            cmpBody.pivot.translateZ(-0.9);
            cmpBody.pivot.scale(f.Vector3.ONE(0.8));
            body.addComponent(cmpBody);
            body.addComponent(new f.ComponentMaterial(mtrBody));
            body.addComponent(new f.ComponentTransform());
            snake.appendChild(body);
            let tail = new f.Node("Tail");
            let cmpTail = new f.ComponentMesh(new f.MeshPyramid());
            cmpTail.pivot.translateZ(-1.3);
            cmpTail.pivot.scale(f.Vector3.ONE(0.8));
            cmpTail.pivot.rotateX(-90);
            tail.addComponent(cmpTail);
            tail.addComponent(new f.ComponentMaterial(mtrHead));
            tail.addComponent(new f.ComponentTransform());
            snake.appendChild(tail);
            snake.addComponent(new f.ComponentTransform());
            this.appendChild(snake);
            snake.mtxLocal.translateY(-0.6);
            snake.mtxLocal.rotateY(90);
            //console.log(this.getChildren());
        }
        moveAvatar(_speed, _rotation, _strafe, _high) {
            //this.mtxLocal.rotateX(_rotation);
            //let posOld: f.Vector3 = this.mtxLocal.translation;
            this.mtxLocal.translateZ(_speed);
            this.mtxLocal.translateX(_strafe);
            this.mtxLocal.translateY(_high);
            //this.getComponent(f.ComponentCamera).pivot.translate(new f.Vector3(_strafe, _high, _speed));
            //console.log(this.mtxLocal.translation + " | " + this.getChildrenByName("Body"))
            // let bouncedOff: Wall[] = this.bounceOffWalls(<Wall[]>walls.getChildren());
            // if (bouncedOff.length < 2)
            //     return;
            //
            // bouncedOff = this.bounceOffWalls(bouncedOff);
            // if (bouncedOff.length == 0)
            //     return;
            //
            // console.log("Stuck!");
            //this.mtxLocal.translation = posOld;
        }
        bounceOffWalls(_walls) {
            let bouncedOff = [];
            let posAvatar = this.mtxLocal.translation;
            for (let wall of _walls) {
                let posBounce = wall.calculateBounce(posAvatar, 1);
                if (posBounce) {
                    this.mtxLocal.translation = posBounce;
                    bouncedOff.push(wall);
                }
            }
            return bouncedOff;
        }
    }
    Avatar.meshCube = new f.MeshCube();
    Snake_3D.Avatar = Avatar;
})(Snake_3D || (Snake_3D = {}));
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
    const clrWhite = f.Color.CSS("white");
    Snake_3D.sizeWall = 1;
    Snake_3D.numWalls = 32;
    let root;
    let arena;
    let cmpCamera;
    let snake;
    let ctrSpeed = new f.Control("AvatarSpeed", 0.1, 0 /* PROPORTIONAL */);
    let ctrStrafe = new f.Control("AvatarSpeed", 0.1, 0 /* PROPORTIONAL */);
    let ctrHigh = new f.Control("AvatarSpeed", 0.1, 0 /* PROPORTIONAL */);
    let ctrRotation = new f.Control("AvatarRotation", -0.1, 0 /* PROPORTIONAL */);
    //ctrSpeed.setDelay(100);
    //ctrStrafe.setDelay(100);
    //ctrRotation.setDelay(100);
    let meshQuad = new f.MeshQuad("Quad");
    function hndLoad(_event) {
        const canvas = document.querySelector("canvas");
        canvas.addEventListener("mousemove", hndMouse);
        //canvas.addEventListener("click", canvas.requestPointerLock);
        f.Debug.log(canvas);
        root = new f.Node("Root");
        arena = new f.Node("Arena");
        Snake_3D.food = new f.Node("Food");
        arena = createArena();
        root.appendChild(arena);
        cmpCamera = new f.ComponentCamera();
        cmpCamera.projectCentral(1, 80, ƒ.FIELD_OF_VIEW.DIAGONAL, 0.2, 10000);
        cmpCamera.backgroundColor = ƒ.Color.CSS("darkblue");
        snake = new Snake_3D.Avatar("Snake", cmpCamera);
        root.appendChild(snake);
        Snake_3D.viewport = new f.Viewport();
        Snake_3D.viewport.initialize("Viewport", root, cmpCamera, canvas);
        f.Debug.log(Snake_3D.viewport);
        f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, hndLoop);
        f.Loop.start(f.LOOP_MODE.TIME_GAME, 60);
    }
    function hndLoop(_event) {
        ctrSpeed.setInput(f.Keyboard.mapToValue(-1, 0, [f.KEYBOARD_CODE.S, f.KEYBOARD_CODE.ARROW_DOWN])
            + f.Keyboard.mapToValue(1, 0, [f.KEYBOARD_CODE.W, f.KEYBOARD_CODE.ARROW_UP]));
        ctrStrafe.setInput(f.Keyboard.mapToValue(1, 0, [f.KEYBOARD_CODE.A, f.KEYBOARD_CODE.ARROW_LEFT])
            + f.Keyboard.mapToValue(-1, 0, [f.KEYBOARD_CODE.D, f.KEYBOARD_CODE.ARROW_RIGHT]));
        ctrHigh.setInput(f.Keyboard.mapToValue(1, 0, [f.KEYBOARD_CODE.SPACE])
            + f.Keyboard.mapToValue(-1, 0, [f.KEYBOARD_CODE.C]));
        snake.moveAvatar(ctrSpeed.getOutput(), ctrRotation.getOutput(), ctrStrafe.getOutput(), ctrHigh.getOutput());
        Snake_3D.viewport.draw();
    }
    function hndMouse(_event) {
        // console.log(_event.movementX, _event.movementY);
        ctrRotation.setInput(_event.movementX);
    }
    function createArena() {
        let arena = new f.Node("Arena");
        let walls = new f.Node("Walls");
        let txtFloor = new f.TextureImage("assets/grass.jpg");
        let mtrFloor = new f.Material("Floor", f.ShaderTexture, new f.CoatTextured(null, txtFloor));
        let floor = new fcaid.Node("Floor", f.Matrix4x4.ROTATION_X(-90), mtrFloor, meshQuad);
        floor.mtxLocal.scale(f.Vector3.ONE(Snake_3D.numWalls * Snake_3D.sizeWall));
        floor.getComponent(f.ComponentMaterial).pivot.scale(f.Vector2.ONE(10));
        arena.appendChild(floor);
        let txtWall = new f.TextureImage("assets/wall.png");
        let mtrWall = new f.Material("Wall", f.ShaderTexture, new f.CoatTextured(clrWhite, txtWall));
        for (let i = -Snake_3D.numWalls / 2 + 0.5; i < Snake_3D.numWalls / 2; i++) {
            walls.appendChild(new Snake_3D.Wall(f.Vector2.ONE(Snake_3D.sizeWall), f.Vector3.SCALE(new f.Vector3((-Snake_3D.numWalls / 2) * Snake_3D.sizeWall, Snake_3D.sizeWall / 2, i * Snake_3D.sizeWall), 1), f.Vector3.Y(90), mtrWall));
            walls.appendChild(new Snake_3D.Wall(f.Vector2.ONE(Snake_3D.sizeWall), f.Vector3.SCALE(new f.Vector3((Snake_3D.numWalls / 2) * Snake_3D.sizeWall, Snake_3D.sizeWall / 2, i * Snake_3D.sizeWall), 1), f.Vector3.Y(-90), mtrWall));
            walls.appendChild(new Snake_3D.Wall(f.Vector2.ONE(Snake_3D.sizeWall), f.Vector3.SCALE(new f.Vector3(i * Snake_3D.sizeWall, Snake_3D.sizeWall / 2, (-Snake_3D.numWalls / 2) * Snake_3D.sizeWall), 1), f.Vector3.Y(0), mtrWall));
            walls.appendChild(new Snake_3D.Wall(f.Vector2.ONE(Snake_3D.sizeWall), f.Vector3.SCALE(new f.Vector3(i * Snake_3D.sizeWall, Snake_3D.sizeWall / 2, (Snake_3D.numWalls / 2) * Snake_3D.sizeWall), 1), f.Vector3.Y(180), mtrWall));
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