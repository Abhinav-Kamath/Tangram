export class Scene {
  constructor() {
    this.primitives = [];
  }

  add(primitive) {
    if (this.primitives && primitive) {
      this.primitives.push(primitive);
    }
  }

  getPrimitives() {
    return this.primitives;
  }

  centroid() {
    let maxX = this.primitives[0].getCx();
    let minX = this.primitives[0].getCx();
    let maxY = this.primitives[0].getCy();
    let minY = this.primitives[0].getCy();
    for (let i = 0; i < this.primitives.length; i++) {
      if (maxX < this.primitives[i].getCx()) {
        maxX = this.primitives[i].getCx();
      }
      if (minX > this.primitives[i].getCx()) {
        minX = this.primitives[i].getCx();
      }
      if (maxY < this.primitives[i].getCy()) {
        maxY = this.primitives[i].getCy();
      }
      if (minY > this.primitives[i].getCy()) {
        minY = this.primitives[i].getCy();
      }
    }
    maxX += 0.1;
    minX -= 0.1;
    maxY += 0.1;
    minY -= 0.1;
    bbx = (maxX + minX) / 2;
    bby = (maxY + minY) / 2;
    return [bbx, bby];
  }
}
