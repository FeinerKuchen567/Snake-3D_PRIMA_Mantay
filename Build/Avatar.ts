namespace Snake_3D {
    import f = FudgeCore;

    export class Avatar extends f.Node {
        private static readonly meshCube: f.MeshCube = new f.MeshCube();

        public constructor(_name: string, _cam: f.ComponentCamera) {
            super(_name)
            _cam.pivot.translate(new f.Vector3(0,7,-9));
            _cam.pivot.rotateX(45);
            _cam.backgroundColor = f.Color.CSS("darkblue");
            this.addComponent(_cam);

            this.addComponent(new f.ComponentTransform(f.Matrix4x4.TRANSLATION(f.Vector3.ONE())));

            this.mtxLocal.rotate(f.Vector3.Y(180));

            let txtHead: f.TextureImage = new f.TextureImage("assets/Head.png");
            let mtrHead: f.Material = new f.Material("Head", f.ShaderTexture, new f.CoatTextured(null, txtHead));

            let txtBody: f.TextureImage = new f.TextureImage("assets/Body.png");
            let mtrBody: f.Material = new f.Material("Body", f.ShaderTexture, new f.CoatTextured(null, txtBody));

            let snake: f.Node = new f.Node("Snake");
                let head: f.Node = new f.Node("Head");
                    let head0: f.Node = new f.Node("Mund");
                        let cmpHead0: f.ComponentMesh = new f.ComponentMesh(Avatar.meshCube);
                        cmpHead0.pivot.scale(new f.Vector3(1, 0.74,0.96));
                        head0.addComponent(cmpHead0);
                        head0.addComponent(new f.ComponentMaterial(mtrHead));
                    head.appendChild(head0);
                    let head1: f.Node = new f.Node("Augen");
                         let cmpHead1: f.ComponentMesh = new f.ComponentMesh(Avatar.meshCube);
                         cmpHead1.pivot.translate(new f.Vector3(0.3,0.54,0));
                         cmpHead1.pivot.scale(new f.Vector3(0.4, 0.4,0.88));
                         head1.addComponent(cmpHead1);
                         head1.addComponent(new f.ComponentMaterial(mtrHead));
                    head.appendChild(head1);
                    head.addComponent(new f.ComponentTransform());
                    head.mtxLocal.rotateY(90);
                snake.appendChild(head);
                let body: f.Node = new f.Node("Body");
                    let cmpBody: f.ComponentMesh = new f.ComponentMesh(Avatar.meshCube);
                    cmpBody.pivot.translateZ(-0.9);
                    cmpBody.pivot.scale(f.Vector3.ONE(0.8));
                    body.addComponent(cmpBody);
                    body.addComponent(new f.ComponentMaterial(mtrBody));
                    body.addComponent(new f.ComponentTransform());
                snake.appendChild(body);
                let tail: f.Node = new f.Node("Tail");
                    let cmpTail: f.ComponentMesh = new f.ComponentMesh(new f.MeshPyramid());
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
        public moveAvatar(_speed: number, _rotation: number, _strafe: number, _high: number): void {
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

        bounceOffWalls(_walls: Wall[]): Wall[] {
            let bouncedOff: Wall[] = [];
            let posAvatar: ƒ.Vector3 = this.mtxLocal.translation;

            for (let wall of _walls) {
                let posBounce: ƒ.Vector3 = wall.calculateBounce(posAvatar, 1);
                if (posBounce) {
                    this.mtxLocal.translation = posBounce;
                    bouncedOff.push(wall);
                }
            }
            return bouncedOff;
        }
    }
}