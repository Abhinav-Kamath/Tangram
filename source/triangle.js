import { vec3, mat4 } from "https://cdn.skypack.dev/gl-matrix";
import Transform from "./transform.js";

export default class Triangle {
  constructor(gl, Cx, Cy, index, color) {
    this.gl = gl;
    this.Cx = Cx;
    this.Cy = Cy;
    this.index = index;
    this.color = color;
    this.angle = 0;
    let vertex = [
      1 / 15,
      1 / 15,
      0.0,
      -(2 / 15),
      1 / 15,
      0.0,
      1 / 15,
      -(2 / 15),
      0.0,
    ];
    this.vertexPositionData = new Float32Array(this.getx(vertex));

    this.buffer = this.gl.createBuffer();
    if (!this.buffer) {
      throw new Error("Buffer could not be allocated");
    }

    this.transform = new Transform();
    this.transform.setTranslate(vec3.fromValues(Cx, Cy, 0));
    this.transform.updateMatrix();
  }

  getAng() {
    return this.angle;
  }
  getcolor() {
    return this.color;
  }

  setAng(dir, rad) {
    if (dir == 0) this.angle += rad;
    else this.angle -= rad;
  }

  getIndex() {
    return this.index;
  }
  getx(vertex) {
    let v = [];
    for (let i = 0; i < 18; i++) {
      if (i != 0 && i % 3 === 0) {
        if (this.color === "g") {
          v.push(0);
          v.push(1);
          v.push(0);
        } else if (this.color === "y") {
          v.push(1);
          v.push(1);
          v.push(0);
        } else if (this.color === "db") {
          v.push(0);
          v.push(0);
          v.push(1);
        } else if (this.color === "org") {
          v.push(0.95);
          v.push(0.5);
          v.push(0);
        } else if (this.color === "lb") {
          v.push(0.1);
          v.push(1);
          v.push(1);
        }

        v.push(vertex[i]);
      } else {
        v.push(vertex[i]);
      }
    }
    if (this.color === "g") {
      v.push(0);
      v.push(1);
      v.push(0);
    } else if (this.color === "y") {
      v.push(1);
      v.push(1);
      v.push(0);
    } else if (this.color === "db") {
      v.push(0);
      v.push(0);
      v.push(1);
    } else if (this.color === "org") {
      v.push(0.95);
      v.push(0.5);
      v.push(0);
    } else if (this.color === "lb") {
      v.push(0.1);
      v.push(1);
      v.push(1);
    }
    return v;
  }

  getCx() {
    return this.Cx;
  }

  setCx(cx) {
    this.Cx = cx;
  }

  getCy() {
    return this.Cy;
  }

  setCy(cy) {
    this.Cy = cy;
  }

  getVertex() {
    return this.vertexPositionData;
  }

  getObj() {
    return this;
  }

  draw(shader) {
    const uModelTransformMatrix = shader.uniform("uModelTransformMatrix");
    let elementPerVertex = 3;

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      this.vertexPositionData,
      this.gl.DYNAMIC_DRAW
    );

    const aPosition = shader.attribute("aPosition");
    this.gl.enableVertexAttribArray(aPosition);
    this.gl.vertexAttribPointer(
      aPosition,
      elementPerVertex,
      this.gl.FLOAT,
      false,
      6 * this.vertexPositionData.BYTES_PER_ELEMENT,
      0
    );

    const aColor = shader.attribute("aColor");
    this.gl.enableVertexAttribArray(aColor);
    this.gl.vertexAttribPointer(
      aColor,
      elementPerVertex,
      this.gl.FLOAT,
      false,
      6 * this.vertexPositionData.BYTES_PER_ELEMENT,
      3 * this.vertexPositionData.BYTES_PER_ELEMENT
    );

    shader.setUniformMatrix4fv(
      uModelTransformMatrix,
      this.transform.getMVPMatrix()
    );

    this.gl.drawArrays(
      this.gl.TRIANGLES,
      0,
      this.vertexPositionData.length / (2 * elementPerVertex)
    );
  }
}
