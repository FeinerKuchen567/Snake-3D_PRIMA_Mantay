namespace Snake_3D {
    import f = FudgeCore;
    import fcaid = FudgeAid;

    window.addEventListener("load", hndLoad);
    export let viewport: f.Viewport;

    const clrWhite: f.Color = f.Color.CSS("white");
    export const sizeWall: number = 1;
    export const numWalls: number = 32;

    let root: f.Node;
    let arena: f.Node;
    let cmpCamera: f.ComponentCamera;
    let snake: Avatar;
    export let food: f.Node;

    let ctrSpeed: f.Control = new f.Control("AvatarSpeed", 0.1, f.CONTROL_TYPE.PROPORTIONAL);
    let ctrStrafe: f.Control = new f.Control("AvatarSpeed", 0.1, f.CONTROL_TYPE.PROPORTIONAL);
    let ctrHigh: f.Control = new f.Control("AvatarSpeed", 0.1, f.CONTROL_TYPE.PROPORTIONAL);
    let ctrRotation: f.Control = new f.Control("AvatarRotation", -0.1, f.CONTROL_TYPE.PROPORTIONAL);

    //ctrSpeed.setDelay(100);
    //ctrStrafe.setDelay(100);
    //ctrRotation.setDelay(100);

    let meshQuad: f.MeshQuad = new f.MeshQuad("Quad");

    function hndLoad(_event: Event): void {
        const canvas: HTMLCanvasElement = document.querySelector("canvas");
        canvas.addEventListener("mousemove", hndMouse);
        //canvas.addEventListener("click", canvas.requestPointerLock);
        f.Debug.log(canvas);

        root = new f.Node("Root");
        arena = new f.Node("Arena");
        food = new f.Node("Food");

        arena = createArena();
        root.appendChild(arena);

        cmpCamera = new f.ComponentCamera();
        cmpCamera.projectCentral(1, 80, ƒ.FIELD_OF_VIEW.DIAGONAL, 0.2, 10000);
        cmpCamera.backgroundColor = ƒ.Color.CSS("darkblue");

        snake = new Avatar("Snake", cmpCamera);
        root.appendChild(snake);

        viewport = new f.Viewport();
        viewport.initialize("Viewport", root, cmpCamera, canvas);
        f.Debug.log(viewport);


        f.Loop.addEventListener(f.EVENT.LOOP_FRAME, hndLoop);
        f.Loop.start(f.LOOP_MODE.TIME_GAME, 60);
    }

    function hndLoop(_event: Event): void {
        ctrSpeed.setInput(
            f.Keyboard.mapToValue(-1, 0, [f.KEYBOARD_CODE.S, f.KEYBOARD_CODE.ARROW_DOWN])
            + f.Keyboard.mapToValue(1, 0, [f.KEYBOARD_CODE.W, f.KEYBOARD_CODE.ARROW_UP])
        );
        ctrStrafe.setInput(
            f.Keyboard.mapToValue(1, 0, [f.KEYBOARD_CODE.A, f.KEYBOARD_CODE.ARROW_LEFT])
            + f.Keyboard.mapToValue(-1, 0, [f.KEYBOARD_CODE.D, f.KEYBOARD_CODE.ARROW_RIGHT])
        );
        ctrHigh.setInput(
            f.Keyboard.mapToValue(1, 0, [f.KEYBOARD_CODE.SPACE])
            + f.Keyboard.mapToValue(-1, 0, [f.KEYBOARD_CODE.C])
        );
        snake.moveAvatar(ctrSpeed.getOutput(), ctrRotation.getOutput(), ctrStrafe.getOutput(), ctrHigh.getOutput());

        viewport.draw();
    }

    function hndMouse(_event: MouseEvent): void {
        // console.log(_event.movementX, _event.movementY);
        ctrRotation.setInput(_event.movementX);
    }

    function createArena(): f.Node {
        let arena: f.Node = new f.Node("Arena");
        let walls: f.Node = new f.Node("Walls");

        let txtFloor: f.TextureImage = new f.TextureImage("assets/grass.jpg");
        let mtrFloor: f.Material = new f.Material("Floor", f.ShaderTexture, new f.CoatTextured(null, txtFloor));
        let floor: fcaid.Node = new fcaid.Node("Floor", f.Matrix4x4.ROTATION_X(-90), mtrFloor, meshQuad);
        floor.mtxLocal.scale(f.Vector3.ONE(numWalls * sizeWall));
        floor.getComponent(f.ComponentMaterial).pivot.scale(f.Vector2.ONE(10));
        arena.appendChild(floor);

        let txtWall: f.TextureImage = new f.TextureImage("assets/wall.png");
        let mtrWall: f.Material = new f.Material("Wall", f.ShaderTexture, new f.CoatTextured(clrWhite, txtWall));

        for (let i: number = -numWalls / 2 + 0.5; i < numWalls / 2; i++) {
            walls.appendChild(new Wall(f.Vector2.ONE(sizeWall), f.Vector3.SCALE(new f.Vector3((-numWalls / 2)*sizeWall , sizeWall/2, i*sizeWall), 1), f.Vector3.Y(90), mtrWall));
            walls.appendChild(new Wall(f.Vector2.ONE(sizeWall), f.Vector3.SCALE(new f.Vector3((numWalls / 2)*sizeWall, sizeWall/2, i*sizeWall), 1), f.Vector3.Y(-90), mtrWall));
            walls.appendChild(new Wall(f.Vector2.ONE(sizeWall), f.Vector3.SCALE( new f.Vector3(i*sizeWall, sizeWall/2, (-numWalls / 2)*sizeWall), 1), f.Vector3.Y(0),  mtrWall ));
            walls.appendChild(new Wall(f.Vector2.ONE(sizeWall), f.Vector3.SCALE(new f.Vector3(i*sizeWall, sizeWall/2, (numWalls / 2)*sizeWall), 1), f.Vector3.Y(180), mtrWall));
        }

        arena.appendChild(walls);

        return arena;
    }
}