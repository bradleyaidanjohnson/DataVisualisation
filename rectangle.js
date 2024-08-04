class Rectangle {
  constructor(length, depth, x = 0, y = 0) {
    this.length = length; // Length is the dimension along the primary axis (row width or column height)
    this.depth = depth; // Depth is the dimension along the secondary axis (row height or column width)
    this.x = x;
    this.y = y;
  }

  // Returns the shortest side of the rectangle
  shortestSide() {
    return Math.min(this.length, this.depth);
  }

  // Layout the row in the current rectangle
  layoutRow(row, layout) {
    let totalRowArea = row.reduce((sum, r) => sum + r.area, 0);
    let rowLength = totalRowArea / this.shortestSide(); // Length of the row (fixed)
    let rowDepth = totalRowArea / rowLength; // Depth of the row (varies)

    let currentX = this.x;
    let currentY = this.y;

    row.forEach((rect) => {
      if (this.length >= this.depth) {
        // Horizontal layout
        rect.length = rowLength; // Fixed length for the row
        rect.depth = rect.area / rowLength; // Depth based on area
        rect.x = currentX;
        rect.y = currentY;
        currentY += rect.depth; // Move down for the next rectangle
      } else {
        // Vertical layout
        rect.depth = rowDepth; // Fixed depth for the column
        rect.length = rect.area / rowDepth; // Length based on area
        rect.x = currentX;
        rect.y = currentY;
        currentX += rect.length; // Move right for the next rectangle
      }
      layout.push(rect); // Add rectangle to layout
    });

    // Update the remaining rectangle for the next row layout
    if (this.length >= this.depth) {
      this.x += rowLength; // Move right for the next row
      this.length -= rowLength;
    } else {
      this.y += rowDepth; // Move down for the next column
      this.depth -= rowDepth;
    }
  }
}
