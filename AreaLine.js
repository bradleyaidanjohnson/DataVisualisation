// Class for vectors
function AreaLine(x0, y0, x1, y1, base0, base1, col) {
  // construct all points
  this.x0 = x0;
  this.y0 = y0;
  this.x1 = x1;
  this.y1 = y1;
  this.base0 = base0;
  this.base1 = base1;
  this.col = col;

  // Function to draw vector
  this.fillLine = function () {
    // Get colour from global theme based on the col number
    let c = color(colorTheme[this.col - 1]);
    // Make transparent for colour mixing
    c.setAlpha(100);
    fill(c);
    noStroke();

    beginShape();
    vertex(this.x0, this.y0);
    vertex(this.x1, this.y1);
    vertex(this.x1, this.base1);
    vertex(this.x0, this.base0);
    endShape(CLOSE);
  };
}
