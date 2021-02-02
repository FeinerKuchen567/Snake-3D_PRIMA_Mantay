namespace Snake_3D {
    import f = FudgeCore;

    export class Avatar extends f.Node {

        public constructor(_name: string, _cam: f.ComponentCamera) {
            super(_name)
            this.addComponent(_cam);
            this.addComponent(new f.ComponentTransform());

            this.mtxLocal.translate(f.Vector3.Z(8));
            this.mtxLocal.translate(f.Vector3.Y(0));
            this.mtxLocal.translate(f.Vector3.X(0));

            this.mtxLocal.rotate(f.Vector3.Y(180));
        }
        public moveAvatar(_speed: number, _rotation: number, _strafe: number): void {
            console.log("Move! " + _speed + " | " + _rotation + " | " + _strafe);
            this.mtxLocal.rotateY(_rotation);
            //let posOld: f.Vector3 = this.mtxLocal.translation;
            this.mtxLocal.translateZ(_speed);
            this.mtxLocal.translateX(_strafe);

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