import { vec3, mat4 } from "https://cdn.skypack.dev/gl-matrix";
import Shader from "./shader.js";
import vertexShaderSrc from "./vertex.js";
import fragmentShaderSrc from "./fragment.js";
import Renderer from "./renderer.js";
import Square from "./Square.js";
import Triangle from "./triangle.js";
import Parallelogram from "./parallelogram.js";

let mode = 0;
let index = 0;
let index1 = 0;
let count = 0;
let Centroid_x = 0;
let Centroid_y = 0;
let angle = 0;
let rotateBy = 0.04;
let scaleBy = 1.025;
let translateBy = 0.009;
//rotate(scene.array, indexofPrimitive, angle_along_allcentroid,rotateBy,direction)
function rotate(scene, index, angle, cx, cy, rad, dir) {
  if (dir === "r") {
    if (angle === 0) scene[index].setAng(1, rad);
    rad = -rad;
  } else {
    if (angle === 0) scene[index].setAng(0, rad);
  }
  scene[index].transform.setTranslate(
    vec3.fromValues(
      Math.cos(rad) * (scene[index].transform.getTranslate()[0] - cx) -
        Math.sin(rad) * (scene[index].transform.getTranslate()[1] - cy) +
        cx,
      Math.sin(rad) * (scene[index].transform.getTranslate()[0] - cx) +
        Math.cos(rad) * (scene[index].transform.getTranslate()[1] - cy) +
        cy,
      0
    )
  );
  scene[index].transform.setRotate(
    vec3.fromValues(0, 0, 1),
    scene[index].getAng() + angle
  );
  scene[index].transform.updateMatrix();
}

function getRand(min, max) {
  return Math.random() * (max - min) + min;
}

//scale(scene, index,factor_of_scale,direction_of_rotate)
function scale(scene, index, factor, dir) {
  if (dir === "down") factor = 1 / factor;
  scene[index].transform.setScale(
    vec3.fromValues(
      scene[index].transform.getScale()[0] * factor,
      scene[index].transform.getScale()[0] * factor,
      1
    )
  );
  scene[index].transform.updateMatrix();
}

function moveVerticle(scene, index, factor, dir) {
  if (dir === "down") factor = -factor;
  scene[index].setCy(scene[index].getCy() + factor);
  scene[index].transform.setTranslate(
    vec3.fromValues(
      scene[index].transform.getTranslate()[0],
      scene[index].transform.getTranslate()[1] + factor,
      0
    )
  );
  scene[index].transform.updateMatrix();
}

function moveHorizontal(scene, index, factor, dir) {
  if (dir === "left") factor = -factor;
  scene[index].setCx(scene[index].getCx() + factor);
  scene[index].transform.setTranslate(
    vec3.fromValues(
      scene[index].transform.getTranslate()[0] + factor,
      scene[index].transform.getTranslate()[1],
      0
    )
  );
  scene[index].transform.updateMatrix();
}

function allCentroid(scene) {
  let maxX = scene[0].getCx();
  let minX = scene[0].getCx();
  let maxY = scene[0].getCy();
  let minY = scene[0].getCy();
  for (let i = 0; i < scene.length; i++) {
    if (maxX < scene[i].getCx()) {
      maxX = scene[i].getCx();
    }
    if (minX > scene[i].getCx()) {
      minX = scene[i].getCx();
    }
    if (maxY < scene[i].getCy()) {
      maxY = scene[i].getCy();
    }
    if (minY > scene[i].getCy()) {
      minY = scene[i].getCy();
    }
  }
  maxX += 0.1;
  minX -= 0.1;
  maxY += 0.1;
  minY -= 0.1;
  let bbx = (maxX + minX) / 2;
  let Centroid_y = (maxY + minY) / 2;
  return [bbx, Centroid_y];
}

const renderer1 = new Renderer();
const renderer = new Renderer();
const gl = renderer.webGlContext();
const gl1 = renderer1.webGlContext();

const shader = new Shader(gl, vertexShaderSrc, fragmentShaderSrc);
shader.use();

const shader1 = new Shader(gl1, vertexShaderSrc, fragmentShaderSrc);
shader1.use();

let movingScene = [];
let constConf = [];

function init(C) {
  let position = new Float32Array([]);
  let temp_Cx = 0;
  let temp_Cy = 0;
  switch (C) {
    case 1:
      position = new Float32Array([
        -0.004757879604124516, -0.22014133857277135,
      ]);
      constConf.push(new Square(gl1, position[0], position[1], index1++));
      position = new Float32Array([-0.40004050495, 0.19458961947]);
      constConf.push(
        new Parallelogram(gl1, position[0], position[1], index1++, "p")
      );
      position = new Float32Array([0.02886318922, 0.42228262535]);
      constConf.push(
        new Triangle(gl1, position[0], position[1], index1++, "org")
      );
      position = new Float32Array([-0.18776111374, 0.07531148739284146]);
      constConf.push(
        new Triangle(gl1, position[0], position[1], index1++, "lb")
      );
      position = new Float32Array([0.384834327183868, 0.049242120395875486]);
      constConf.push(
        new Triangle(gl1, position[0], position[1], index1++, "db")
      );
      position = new Float32Array([-0.35721199922, -0.33279838455]);
      constConf.push(
        new Triangle(gl1, position[0], position[1], index1++, "g")
      );
      position = new Float32Array([0.2675221756975209, -0.42404116904]);
      constConf.push(
        new Triangle(gl1, position[0], position[1], index1++, "y")
      );
      //squ
      temp_Cx = constConf[0].getCx();
      temp_Cy = constConf[0].getCy();
      for (let i = 0; i < 28; i++) scale(constConf, 0, scaleBy, "up");
      rotate(constConf, 0, 0, temp_Cx, temp_Cy, rotateBy, "r");
      //para
      for (let i = 0; i < 7; i++) scale(constConf, 1, scaleBy, "up");
      temp_Cx = constConf[2].getCx();
      temp_Cy = constConf[2].getCy();
      //org
      rotate(constConf, 2, 0, temp_Cx, temp_Cy, 59 * rotateBy, "r");
      for (let i = 0; i < 56; i++) scale(constConf, 2, scaleBy, "up");

      //lblue
      temp_Cx = constConf[3].getCx();
      temp_Cy = constConf[3].getCy();
      rotate(constConf, 3, 0, temp_Cx, temp_Cy, 20 * rotateBy, "r");
      for (let i = 0; i < 28; i++) scale(constConf, 3, scaleBy, "up");

      //darkblue
      temp_Cx = constConf[4].getCx();
      temp_Cy = constConf[4].getCy();
      rotate(constConf, 4, 0, temp_Cx, temp_Cy, 58 * rotateBy, "l");
      for (let i = 0; i < 56; i++) scale(constConf, 4, scaleBy, "up");
      //green
      temp_Cx = constConf[5].getCx();
      temp_Cy = constConf[5].getCy();
      rotate(constConf, 5, 0, temp_Cx, temp_Cy, 79 * rotateBy, "r");
      for (let i = 0; i < 40; i++) scale(constConf, 5, scaleBy, "up");

      //yellow
      temp_Cx = constConf[6].getCx();
      temp_Cy = constConf[6].getCy();
      rotate(constConf, 6, 0, temp_Cx, temp_Cy, 19 * rotateBy, "l");
      for (let i = 0; i < 28; i++) scale(constConf, 6, scaleBy, "up");
      break;

    case 2:
      position = new Float32Array([0.17524212023243307, 0.1758586636781693]);
      constConf.push(new Square(gl1, position[0], position[1], index1++));
      position = new Float32Array([0.17595949268341082, -0.41741038513183615]);
      constConf.push(
        new Parallelogram(gl1, position[0], position[1], index1++, "p")
      );
      position = new Float32Array([-0.295136810258031, -0.28871736383438146]);
      constConf.push(
        new Triangle(gl1, position[0], position[1], index1++, "org")
      );
      position = new Float32Array([0.1092388869524002, 0.5073114894032481]);
      constConf.push(
        new Triangle(gl1, position[0], position[1], index1++, "lb")
      );
      position = new Float32Array([-0.29016568064689663, 0.23824212023615843]);
      constConf.push(
        new Triangle(gl1, position[0], position[1], index1++, "db")
      );
      position = new Float32Array([0.5067879929542546, 0.00020160841941848154]);
      constConf.push(
        new Triangle(gl1, position[0], position[1], index1++, "g")
      );
      position = new Float32Array([0.11575695037841752, -0.16017856025695754]);
      constConf.push(
        new Triangle(gl1, position[0], position[1], index1++, "y")
      );
      temp_Cx = constConf[0].getCx();
      temp_Cy = constConf[0].getCy();
      for (let i = 0; i < 28; i++) scale(constConf, 0, scaleBy, "up");
      rotate(constConf, 0, 0, temp_Cx, temp_Cy, 20 * rotateBy, "r");
      //para
      temp_Cx = constConf[1].getCx();
      temp_Cy = constConf[1].getCy();
      for (let i = 0; i < 7; i++) scale(constConf, 1, scaleBy, "up");
      rotate(constConf, 1, 0, temp_Cx, temp_Cy, 19 * rotateBy, "r");

      //org

      for (let i = 0; i < 56; i++) scale(constConf, 2, scaleBy, "up");

      //lblue
      rotate(
        constConf,
        3,
        0,
        constConf[3].getCx(),
        constConf[3].getCy(),
        79 * rotateBy,
        "l"
      );
      for (let i = 0; i < 29; i++) scale(constConf, 3, scaleBy, "up");

      //darkblue
      rotate(
        constConf,
        4,
        0,
        constConf[4].getCx(),
        constConf[4].getCy(),
        39 * rotateBy,
        "r"
      );
      for (let i = 0; i < 56; i++) scale(constConf, 4, scaleBy, "up");
      //green
      temp_Cx = constConf[5].getCx();
      temp_Cy = constConf[5].getCy();
      rotate(constConf, 5, 0, temp_Cx, temp_Cy, 20 * rotateBy, "r");
      for (let i = 0; i < 40; i++) scale(constConf, 5, scaleBy, "up");
      //yellow
      temp_Cx = constConf[6].getCx();
      temp_Cy = constConf[6].getCy();
      rotate(constConf, 6, 0, temp_Cx, temp_Cy, 40 * rotateBy, "l");
      for (let i = 0; i < 29; i++) scale(constConf, 6, scaleBy, "up");
      for (let i = 0; i < 9; i++) {
        [Centroid_x, Centroid_y] = allCentroid(constConf);
        Centroid_x = Centroid_x / (1 * scaleBy);
        Centroid_y = Centroid_x / (1 * scaleBy);
        for (let i = 0; i < constConf.length; i++) {
          constConf[i].setCy(constConf[i].getCy() / (1 * scaleBy));
          constConf[i].setCx(constConf[i].getCx() / (1 * scaleBy));
          constConf[i].transform.setTranslate(
            vec3.fromValues(
              constConf[i].transform.getTranslate()[0] / (1 * scaleBy),
              constConf[i].transform.getTranslate()[1] / (1 * scaleBy),
              0
            )
          );
          constConf[i].transform.updateMatrix();
          scale(constConf, i, scaleBy, "down");
        } //end loop
      }

      break;
  }
}

function init2() {
  let position = new Float32Array([getRand(-0.8, 0.8), getRand(-0.8, 0.8)]);
  movingScene.push(new Square(gl, position[0], position[1], index++));

  position = new Float32Array([getRand(-0.8, 0.8), getRand(-0.8, 0.8)]);
  movingScene.push(
    new Parallelogram(gl, position[0], position[1], index++, "p")
  );

  position = new Float32Array([getRand(-0.8, 0.8), getRand(-0.8, 0.8)]);
  movingScene.push(new Triangle(gl, position[0], position[1], index++, "org"));

  position = new Float32Array([getRand(-0.8, 0.8), getRand(-0.8, 0.8)]);
  movingScene.push(new Triangle(gl, position[0], position[1], index++, "lb"));

  position = new Float32Array([getRand(-0.8, 0.8), getRand(-0.8, 0.8)]);
  movingScene.push(new Triangle(gl, position[0], position[1], index++, "db"));

  position = new Float32Array([getRand(-0.8, 0.8), getRand(-0.8, 0.8)]);
  movingScene.push(new Triangle(gl, position[0], position[1], index++, "g"));

  position = new Float32Array([getRand(-0.8, 0.8), getRand(-0.8, 0.8)]);
  movingScene.push(new Triangle(gl, position[0], position[1], index++, "y"));
  //squ
  let temp_Cx = movingScene[0].getCx();
  let temp_Cy = movingScene[0].getCy();
  for (let i = 0; i < 28; i++) scale(movingScene, 0, scaleBy, "up");
  rotate(movingScene, 0, 0, temp_Cx, temp_Cy, getRand(0, 157) * rotateBy, "r");
  //para
  temp_Cx = movingScene[1].getCx();
  temp_Cy = movingScene[1].getCy();
  for (let i = 0; i < 7; i++) scale(movingScene, 1, scaleBy, "up");
  rotate(movingScene, 1, 0, temp_Cx, temp_Cy, getRand(0, 157) * rotateBy, "r");

  //org
  for (let i = 0; i < 56; i++) scale(movingScene, 2, scaleBy, "up");

  //lblue
  rotate(
    movingScene,
    3,
    0,
    movingScene[3].getCx(),
    movingScene[3].getCy(),
    getRand(0, 157) * rotateBy,
    "l"
  );
  for (let i = 0; i < 29; i++) scale(movingScene, 3, scaleBy, "up");

  //darkblue
  rotate(
    movingScene,
    4,
    0,
    movingScene[4].getCx(),
    movingScene[4].getCy(),
    getRand(0, 157) * rotateBy,
    "r"
  );
  for (let i = 0; i < 56; i++) scale(movingScene, 4, scaleBy, "up");
  //green
  rotate(
    movingScene,
    5,
    0,
    movingScene[5].getCx(),
    movingScene[5].getCy(),
    getRand(0, 157) * rotateBy,
    "r"
  );
  for (let i = 0; i < 40; i++) scale(movingScene, 5, scaleBy, "up");
  //yellow
  temp_Cx = movingScene[6].getCx();
  temp_Cy = movingScene[6].getCy();
  rotate(movingScene, 6, 0, temp_Cx, temp_Cy, getRand(0, 157) * rotateBy, "l");
  for (let i = 0; i < 29; i++) scale(movingScene, 6, scaleBy, "up");
  for (let i = 0; i < 9; i++) {
    [Centroid_x, Centroid_y] = allCentroid(movingScene);
    Centroid_x = Centroid_x / (1 * scaleBy);
    Centroid_y = Centroid_y / (1 * scaleBy);
    for (let i = 0; i < movingScene.length; i++) {
      movingScene[i].setCy(movingScene[i].getCy() / (1 * scaleBy));
      movingScene[i].setCx(movingScene[i].getCx() / (1 * scaleBy));
      movingScene[i].transform.setTranslate(
        vec3.fromValues(
          movingScene[i].transform.getTranslate()[0] / (1 * scaleBy),
          movingScene[i].transform.getTranslate()[1] / (1 * scaleBy),
          0
        )
      );
      movingScene[i].transform.updateMatrix();
      scale(movingScene, i, scaleBy, "down");
    } //end loop
  }
  console.log("new");
}

init(2);
window.onload = () => {
  if (mode == 0) init2();

  renderer.getCanvas().addEventListener("click", (event) => {
    if (mode == 1) {
      let mouseX = event.clientX;
      let mouseY = event.clientY;
      let dist = 100;

      const clipppedCoordinates = renderer.mousetoClipboard(
        mouseX - 500,
        mouseY
      );

      const position = new Float32Array([
        clipppedCoordinates[0],
        clipppedCoordinates[1],
      ]);

      for (let i = 0; i < movingScene.length; i++) {
        let sum =
          ((position[0] - movingScene[i].getCx()) ** 2 +
            (position[1] - movingScene[i].getCy()) ** 2) **
          (1 / 2);
        if (sum < dist) {
          dist = sum;
          count = i;
        }
      }
      console.log(movingScene[count].getCx());
    } else {
    }
  });

  window.addEventListener(
    "keydown",
    function (event) {
      switch (event.key) {
        case "m":
          if (mode == 1) {
            [Centroid_x, Centroid_y] = allCentroid(movingScene);
          }
          if (mode == 2) {
            movingScene.length = 0;
          }
          if (mode == 3) init2();

          mode = (mode += 1) % 4;
          console.log(mode);
          break;

        case "ArrowRight":
          switch (mode) {
            case 0:
              console.log("Nope");
              break;

            case 1:
              console.log("ArrowRight");
              if (movingScene[count].getCx() + translateBy < 0.85)
                moveHorizontal(movingScene, count, translateBy, "right");
              break;

            case 2:
              console.log("ArrowRight");
              if (Centroid_x + translateBy < 0.85) {
                Centroid_x = Centroid_x + translateBy;
                for (let i = 0; i < movingScene.length; i++)
                  moveHorizontal(movingScene, i, translateBy, "right");
                break;
              }
          }

          break;

        case "ArrowLeft":
          switch (mode) {
            case 0:
              console.log("Nope");
              break;
            case 1:
              console.log("ArrowLeft");
              if (movingScene[count].getCx() - translateBy > -0.85)
                moveHorizontal(movingScene, count, translateBy, "left");
              break;
            case 2:
              console.log("ArrowLeft");
              if (Centroid_x - translateBy > -0.85) {
                Centroid_x = Centroid_x - translateBy;
                for (let i = 0; i < movingScene.length; i++)
                  moveHorizontal(movingScene, i, translateBy, "left");
              }
              break;
          }

          break;

        case "(":
          if (mode == 1) {
            console.log("left");
            rotate(
              movingScene,
              count,
              0,
              movingScene[count].getCx(),
              movingScene[count].getCy(),
              rotateBy,
              "l"
            );
          } else if (mode == 2) {
            console.log("left");
            angle += 0.07;
            for (let i = 0; i < movingScene.length; i++) {
              rotate(movingScene, i, angle, Centroid_x, Centroid_y, 0.07, "l");
            }
          }
          break;

        case ")":
          if (mode == 1) {
            console.log("right");
            rotate(
              movingScene,
              count,
              0,
              movingScene[count].getCx(),
              movingScene[count].getCy(),
              rotateBy,
              "r"
            );
          }
          if (mode == 2) {
            console.log("right");
            angle -= 0.07;
            for (let i = 0; i < movingScene.length; i++) {
              rotate(movingScene, i, angle, Centroid_x, Centroid_y, 0.07, "r");
            }
          }
          break;

        case "ArrowUp":
          if (mode == 0) {
            console.log("Nope");
          } else if (mode == 1) {
            console.log("ArrowUp");
            if (movingScene[count].getCy() + translateBy < 0.85) {
              moveVerticle(movingScene, count, translateBy, "up");
            }
          } else if (mode == 2) {
            if (Centroid_y + translateBy < 0.85) {
              console.log("ArrowUp");
              Centroid_y = Centroid_y + translateBy;
              for (let i = 0; i < movingScene.length; i++) {
                moveVerticle(movingScene, i, translateBy, "up");
              }
            }
          }

          break;

        case "ArrowDown":
          if (mode == 0) {
            console.log("Nope");
          } else if (mode == 1) {
            console.log("ArrowDown");
            if (movingScene[count].getCy() - translateBy > -0.85) {
              moveVerticle(movingScene, count, translateBy, "down");
            }
          } else if (mode == 2) {
            if (Centroid_y - translateBy > -1) {
              console.log("ArrowDown");
              Centroid_y = Centroid_y - translateBy;
              for (let i = 0; i < movingScene.length; i++) {
                moveVerticle(movingScene, i, translateBy, "down");
              }
            }
          }

          break;

        case "-":
          switch (mode) {
            case 0:
              console.log("Nope");
              break;

            case 1:
              console.log("minus");
              scale(movingScene, count, scaleBy, "down");
              break;

            case 2:
              Centroid_x = Centroid_x / scaleBy;
              Centroid_y = Centroid_y / scaleBy;
              for (let i = 0; i < movingScene.length; i++) {
                movingScene[i].setCy(movingScene[i].getCy() / scaleBy);
                movingScene[i].setCx(movingScene[i].getCx() / scaleBy);
                movingScene[i].transform.setTranslate(
                  vec3.fromValues(
                    movingScene[i].transform.getTranslate()[0] / scaleBy,
                    movingScene[i].transform.getTranslate()[1] / scaleBy,
                    0
                  )
                );
                movingScene[i].transform.updateMatrix();
                scale(movingScene, i, scaleBy, "down");
              } //end loop
              break;
          }

          break;

        case "+":
          switch (mode) {
            case 0:
              console.log("Nope");
              break;
            case 1:
              console.log("equal");
              scale(movingScene, count, scaleBy, "up");
              break;
            case 2:
              Centroid_x = Centroid_x * scaleBy;
              Centroid_y = Centroid_y * scaleBy;
              for (let i = 0; i < movingScene.length; i++) {
                movingScene[i].setCy(movingScene[i].getCy() * scaleBy);
                movingScene[i].setCx(movingScene[i].getCx() * scaleBy);
                movingScene[i].transform.setTranslate(
                  vec3.fromValues(
                    movingScene[i].transform.getTranslate()[0] * scaleBy,
                    movingScene[i].transform.getTranslate()[1] * scaleBy,
                    0
                  )
                );
                movingScene[i].transform.updateMatrix();
                scale(movingScene, i, scaleBy, "up");
              } //end loop
              break;
          }

          break;
        case "p":
          console.log([movingScene[0].getCx(), movingScene[0].getCy()]);
          for (let i = 1; i < movingScene.length; i++) {
            console.log([
              movingScene[i].getCx(),
              movingScene[i].getCy(),
              movingScene[i].getcolor(),
            ]);
          }
          break;
        case "Escape":
          window.close();
          break;
      }
    },
    true
  );

  window.addEventListener;
};

//Draw loop
function animate() {
  renderer.clear(1, 0.75, 0.75, 1);
  movingScene.forEach((primitive) => {
    primitive.draw(shader);
  });
  window.requestAnimationFrame(animate);
}

function animate1() {
  renderer1.clear(1, 1, 0.75, 1);
  constConf.forEach((primitive) => {
    primitive.draw(shader1);
  });
  window.requestAnimationFrame(animate1);
}
animate1();
animate();
shader.delete();
shader1.delete();
