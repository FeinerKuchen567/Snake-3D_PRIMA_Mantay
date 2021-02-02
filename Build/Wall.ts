/// <reference path="GameObject.ts"/>

namespace Snake_3D {
  import f = FudgeCore;

  export class Wall extends GameObject {
    // private static readonly meshQuad: ƒ.MeshQuad = new ƒ.MeshQuad();

    public constructor(_size: f.Vector2, _position: f.Vector3, _rotation: f.Vector3, _material: f.Material) {
      super("Wall", _size, _position, _rotation);

      let cmpMaterial: f.ComponentMaterial = new f.ComponentMaterial(_material);
      cmpMaterial.pivot.scale(f.Vector2.ONE(1));
      this.addComponent(cmpMaterial);
    }
  }
}