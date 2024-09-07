function TreeMapChart() {
  // Name for the visualisation to appear in the menu bar.
  this.name = "Tree Map Chart";

  // Each visualisation must have a unique ID with no special characters.
  this.id = "tree-map-chart";

  // Title to display above the plot.
  this.title = "Tree Map Chart Demo";

  // Layout object to store all common plot layout parameters and methods.
  this.layout = {
    marginSize: 35,
    leftMargin: 35 * 2,
    rightMargin: width - 35,
    topMargin: 35,
    bottomMargin: height - 35 * 2,
    pad: 5,
    plotHeight: function () {
      return this.bottomMargin - this.topMargin;
    },
    plotWidth: function () {
      return this.rightMargin - this.leftMargin;
    },
  };
  // Iniitialise an arrangement variable as an empty array
  this.arrangement = [];

  // Rectangle class to support layout operations
  class Rectangle {
    constructor(width, height, x = 0, y = 0) {
      // Width is the dimension along the primary axis (row width or column height)
      this.width = width;
      // Height is the dimension along the secondary axis (row height or column width)
      this.height = height;
      this.x = x;
      this.y = y;
    }

    // Returns the shortest side of the rectangle
    shortestSide() {
      return Math.min(this.width, this.height);
    }

    // Layout the row in the current rectangle
    layoutRow(row) {
      // Calculate total area of the current row
      let totalRowArea = row.reduce((sum, r) => sum + r.area, 0);
      // Row Height and Width
      let rowWidth, rowHeight;

      if (this.width >= this.height) {
        // Horizontal layout

        // Fixed width for the row
        rowWidth = totalRowArea / this.shortestSide();
        rowHeight = this.shortestSide();
        let currentX = this.x;
        let currentY = this.y;
        // Create a rect for each in the row
        row.forEach((rect) => {
          rect.width = rowWidth;
          rect.height = rect.area / rowWidth;
          rect.x = currentX;
          rect.y = currentY;
          // Set y for next rect to begin
          currentY += rect.height;
        });

        // Update remaining rectangle for next row
        this.x += rowWidth;
        this.width -= rowWidth;
      } else {
        // Vertical layout

        // Fixed width for the row
        rowWidth = this.shortestSide();
        rowHeight = totalRowArea / rowWidth;
        let currentX = this.x;
        let currentY = this.y;

        // Create a rect for each in the row
        row.forEach((rect) => {
          rect.height = rowHeight;
          rect.width = rect.area / rowHeight;
          rect.x = currentX;
          rect.y = currentY;
          // Set y for next rect to begin
          currentX += rect.width;
        });

        // Update remaining rectangle for next row
        this.y += rowHeight;
        this.height -= rowHeight;
      }
    }
  }

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Preload the data. This function is called automatically by the gallery when a visualisation is added.
  this.preload = function () {
    var self = this;
    this.data = loadTable(
      // "./data/new-data/FTSE100.csv",
      "./data/new-data/makeup.csv",
      "csv",
      "header",
      // Callback function to set the value
      // this.loaded to true.
      function (table) {
        self.loaded = true;
      }
    );
  };

  // Draw function
  this.draw = function () {
    if (!this.loaded) {
      console.log("Data not yet loaded");
      return;
    }
    // Draw the title above the plot.
    this.drawTitle();
    // Initialise a list of data dictionaries
    let data_dict_list = [];
    // Loop the rows to push dicts to the list containing the names and values
    for (var i = 0; i < this.data.getRowCount(); i++) {
      let curr_dict = {
        data_name: this.data.getString(i, 0),
        area: this.data.getNum(i, 1),
      };
      data_dict_list.push(curr_dict);
    }
    // Sort the list of dicts in descendin order
    data_dict_list.sort((a, b) => b.area - a.area);

    // Initialise totals for the canvas
    let totalWidth = this.layout.rightMargin - this.layout.leftMargin;
    let totalHeight = this.layout.bottomMargin - this.layout.topMargin;
    // Scale data to match canvas area
    let scaledData = this.scaleData(data_dict_list, totalWidth, totalHeight);

    // Initialise an initial rectangle based on the canvas
    let initialRectangle = new Rectangle(
      totalWidth,
      totalHeight,
      this.layout.leftMargin,
      this.layout.topMargin
    );
    // Empty arrangement array
    this.arrangement = [];
    // Exectue squarify algorithm function
    this.squarify(scaledData, [], initialRectangle);
    // Execute draw rectangles function
    this.drawRectangles();
  };

  // Scale the data
  this.scaleData = function (data, containerWidth, containerHeight) {
    // Initialise total area and the sum of the values, then the scale between
    let totalArea = containerWidth * containerHeight;
    let totalValue = data.reduce((sum, d) => sum + d.area, 0);
    let scaleFactor = totalArea / totalValue;

    // Map by that scale
    return data.map((d) => ({
      ...d,
      area: d.area * scaleFactor,
    }));
  };

  // Function to calculate the worst aspect ratio for squarify
  this.worst = function (row, w) {
    // Initialise total area variable
    let totalArea = row.reduce((sum, r) => sum + r.area, 0);
    // Square that number
    let s2 = totalArea ** 2;
    // Find the min and max areas
    let minArea = Math.min(...row.map((r) => r.area));
    let maxArea = Math.max(...row.map((r) => r.area));
    // Return the max of the 2 squarify algorith worst calculations to test aspect ratios
    return Math.max((w ** 2 * maxArea) / s2, s2 / (w ** 2 * minArea));
  };

  // Squarify function
  this.squarify = function (children, row, tmRectangle) {
    // Set the current width to be the shortest side of the rectangle
    var currWidth = tmRectangle.shortestSide();
    // If there are no children. layout and return
    if (children.length === 0) {
      // Layout the row
      tmRectangle.layoutRow(row);
      // Spread the row to the arrangement array
      this.arrangement.push(...row);
      return;
    }
    // Initialise c to the first child
    let c = children[0];
    // If the row is empty or the worst aspect ratio is better than the previous
    if (
      row.length === 0 ||
      this.worst(row, currWidth) > this.worst([...row, c], currWidth)
    ) {
      // Recursively run squarify with all but the first child and the row + c
      this.squarify(children.slice(1), [...row, c], tmRectangle);
    } else {
      // Layout the row
      tmRectangle.layoutRow(row);
      // Push the row to the arrangement array
      this.arrangement.push(...row);
      // Recursively run squarify with all children and an empty row
      this.squarify(children, [], tmRectangle);
    }
  };
  // Draw rectangles function
  this.drawRectangles = function () {
    // Loop the arrangement drawing each rect
    for (var i = 0; i < this.arrangement.length; i++) {
      fill(colorTheme[i % colorTheme.length]);
      stroke(0);
      let rectX = this.arrangement[i].x;
      let rectY = this.arrangement[i].y;
      let rectW = this.arrangement[i].width;
      let rectH = this.arrangement[i].height;
      rect(rectX, rectY, rectW, rectH);
      fill(255);
      strokeWeight(0);
      // Add the name of the data as a data label
      textSize(14);
      textAlign(CENTER, CENTER);
      text(this.arrangement[i].data_name, rectX + rectW / 2, rectY + rectH / 2);
    }
  };
  // Draw title function
  this.drawTitle = function () {
    fill(0);
    noStroke();
    textAlign("center", "center");

    text(
      this.title,
      this.layout.plotWidth() / 2 + this.layout.leftMargin,
      this.layout.topMargin - this.layout.marginSize / 2
    );
  };
}
