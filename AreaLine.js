function AreaLine(x0, y0, x1, y1, base, col) {
  this.x0 = x0;
  this.y0 = y0;
  this.x1 = x1;
  this.y1 = y1;
  this.base = base;
  this.col = col;

  this.fillLine = function () {
    fill(colorTheme[this.col]);
    noStroke();

    beginShape();
    vertex(this.x0, this.y0);
    vertex(this.x1, this.y1);
    vertex(this.x1, this.base);
    vertex(this.x0, this.base);
    endShape(CLOSE);
  };
}
