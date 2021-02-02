namespace Snake_3D {
    import f = FudgeCore;
    import fcaid = FudgeAid;

    window.addEventListener("load", hndLoad);
    export let viewport: f.Viewport;

    const clrWhite: ƒ.Color = ƒ.Color.CSS("white");
    export const sizeWall: number = 1;
    export const numWalls: number = 32;

    let root: f.Node;
    let arena: f.Node;
    let cmpCamera: f.ComponentCamera;
    export let avatar: ƒ.Node;
    export let food: ƒ.Node;


    let meshQuad: f.MeshQuad = new f.MeshQuad("Quad");

    function hndLoad(_event: Event): void {
        const canvas: HTMLCanvasElement = document.querySelector("canvas");
        f.Debug.log(canvas);

        root = new f.Node("Root");
        arena = new f.Node("Arena");
        avatar = new ƒ.Node("Avatar");
        food = new ƒ.Node("Food");


        arena = createArena();
        root.appendChild(arena);

        cmpCamera = new f.ComponentCamera();
        cmpCamera.projectCentral(1, 60, ƒ.FIELD_OF_VIEW.DIAGONAL, 0.2, 10000);
        cmpCamera.pivot.translate(ƒ.Vector3.Y(8));
        cmpCamera.pivot.rotateX(35);
        cmpCamera.backgroundColor = f.Color.CSS("darkblue");

        avatar.addComponent(cmpCamera);
        avatar.addComponent(new ƒ.ComponentTransform());

        avatar.mtxLocal.translate(ƒ.Vector3.Z(8));
        avatar.mtxLocal.translate(ƒ.Vector3.Y(0));
        avatar.mtxLocal.translate(ƒ.Vector3.X(0));

        avatar.mtxLocal.rotate(ƒ.Vector3.Y(180));
        root.appendChild(avatar);

        viewport = new f.Viewport();
        viewport.initialize("Viewport", root, cmpCamera, canvas);
        f.Debug.log(viewport);


        f.Loop.addEventListener(f.EVENT.LOOP_FRAME, hndLoop);
        f.Loop.start(f.LOOP_MODE.TIME_GAME, 60);
    }

    function hndLoop(_event: Event): void {
        viewport.draw();
    }

    function createArena(): ƒ.Node {
        let arena: f.Node = new f.Node("Arena");
        let walls: ƒ.Node = new ƒ.Node("Walls");

        let txtFloor: ƒ.TextureImage = new ƒ.TextureImage("assets/grass.jpg");
        let mtrFloor: ƒ.Material = new ƒ.Material("Floor", ƒ.ShaderTexture, new ƒ.CoatTextured(null, txtFloor));
        let floor: fcaid.Node = new fcaid.Node("Floor", ƒ.Matrix4x4.ROTATION_X(-90), mtrFloor, meshQuad);
        floor.mtxLocal.scale(ƒ.Vector3.ONE(numWalls - 1));
        floor.getComponent(ƒ.ComponentMaterial).pivot.scale(ƒ.Vector2.ONE(10));
        arena.appendChild(floor);

        let txtWall: ƒ.TextureImage = new ƒ.TextureImage("assets/wall.png");
        let mtrWall: ƒ.Material = new ƒ.Material("Wall", ƒ.ShaderTexture, new ƒ.CoatTextured(clrWhite, txtWall));

        for (let i: number = -numWalls / 2 + 0.5; i < numWalls / 2; i++) {
            walls.appendChild(new Wall( ƒ.Vector2.ONE(sizeWall), ƒ.Vector3.SCALE(new ƒ.Vector3(-numWalls / 2, sizeWall/2, i*sizeWall), 1), ƒ.Vector3.Y(90), mtrWall));
            walls.appendChild(new Wall(ƒ.Vector2.ONE(sizeWall), ƒ.Vector3.SCALE(new ƒ.Vector3(numWalls / 2, sizeWall/2, i*sizeWall), 1), ƒ.Vector3.Y(-90), mtrWall));
            walls.appendChild(new Wall(ƒ.Vector2.ONE(sizeWall), ƒ.Vector3.SCALE( new ƒ.Vector3(i*sizeWall, sizeWall/2, -numWalls / 2), 1), ƒ.Vector3.Y(0),  mtrWall ));
            walls.appendChild(new Wall(ƒ.Vector2.ONE(sizeWall), ƒ.Vector3.SCALE(new ƒ.Vector3(i*sizeWall, sizeWall/2, numWalls / 2), 1), ƒ.Vector3.Y(180), mtrWall));
        }

        arena.appendChild(walls);

        return arena;
    }
}