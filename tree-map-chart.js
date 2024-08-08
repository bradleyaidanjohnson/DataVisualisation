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

  this.arrangement = [];

  // Rectangle class to support layout operations
  class Rectangle {
    constructor(width, height, x = 0, y = 0) {
      this.width = width;
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
      let totalRowArea = row.reduce((sum, r) => sum + r.area, 0);
      let rowWidth, rowHeight;

      if (this.width >= this.height) {
        // Horizontal layout
        rowWidth = totalRowArea / this.shortestSide();
        rowHeight = this.shortestSide();
        let currentX = this.x;
        let currentY = this.y;

        row.forEach((rect) => {
          rect.width = rowWidth;
          rect.height = rect.area / rowWidth;
          rect.x = currentX;
          rect.y = currentY;
          currentY += rect.height;
        });

        // Update remaining rectangle for next row
        this.x += rowWidth;
        this.width -= rowWidth;
      } else {
        // Vertical layout
        rowWidth = this.shortestSide();
        rowHeight = totalRowArea / rowWidth;
        let currentX = this.x;
        let currentY = this.y;

        row.forEach((rect) => {
          rect.height = rowHeight;
          rect.width = rect.area / rowHeight;
          rect.x = currentX;
          rect.y = currentY;
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

    let data_dict_list = [];
    let data_name = this.data.columns[0];
    let area = this.data.columns[1];

    for (var i = 0; i < this.data.getRowCount(); i++) {
      let curr_dict = {
        data_name: this.data.getString(i, 0),
        area: this.data.getNum(i, 1),
      };
      data_dict_list.push(curr_dict);
    }

    data_dict_list.sort((a, b) => b.area - a.area);

    let totalWidth = this.layout.rightMargin - this.layout.leftMargin;
    let totalHeight = this.layout.bottomMargin - this.layout.topMargin;

    let scaledData = this.scaleData(data_dict_list, totalWidth, totalHeight);

    let initialRectangle = new Rectangle(
      totalWidth,
      totalHeight,
      this.layout.leftMargin,
      this.layout.topMargin
    );
    this.arrangement = [];
    this.squarify(scaledData, [], initialRectangle);
    console.log(this.arrangement);
    this.drawRectangles();
  };

  // Scale the data
  this.scaleData = function (data, containerWidth, containerHeight) {
    let totalArea = containerWidth * containerHeight;
    let totalValue = data.reduce((sum, d) => sum + d.area, 0);
    let scaleFactor = totalArea / totalValue;

    return data.map((d) => ({
      ...d,
      area: d.area * scaleFactor,
    }));
  };

  // Function to calculate the worst aspect ratio
  this.worst = function (row, w) {
    let totalArea = row.reduce((sum, r) => sum + r.area, 0);
    let s2 = totalArea ** 2;
    let minArea = Math.min(...row.map((r) => r.area));
    let maxArea = Math.max(...row.map((r) => r.area));
    return Math.max((w ** 2 * maxArea) / s2, s2 / (w ** 2 * minArea));
  };

  // Squarify function
  this.squarify = function (children, row, tmRectangle) {
    var currWidth = tmRectangle.shortestSide();
    if (children.length === 0) {
      tmRectangle.layoutRow(row);
      this.arrangement.push(...row);
      return;
    }

    let c = children[0];
    if (
      row.length === 0 ||
      this.worst(row, currWidth) > this.worst([...row, c], currWidth)
    ) {
      this.squarify(children.slice(1), [...row, c], tmRectangle);
    } else {
      tmRectangle.layoutRow(row);
      this.arrangement.push(...row);
      this.squarify(children, [], tmRectangle);
    }
  };

  // this.drawRectangles = function () {
  //   this.arrangement.forEach((rectData) => {
  //     fill(100, 200, 255);
  //     stroke(0);
  //     let rectX = rectData.x;
  //     let rectY = rectData.y;
  //     let rectW = rectData.width;
  //     let rectH = rectData.height;
  //     rect(rectX, rectY, rectW, rectH);
  //     fill(0);
  //     textSize(12);
  //     textAlign(CENTER, CENTER);
  //     text(rectData.data_name, rectX + rectW / 2, rectY + rectH / 2);
  //   });
  // };
  this.drawRectangles = function () {
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
      textSize(14);
      textAlign(CENTER, CENTER);
      text(this.arrangement[i].data_name, rectX + rectW / 2, rectY + rectH / 2);
    }
  };
}

// function setup() {
//   createCanvas(919, 471);
//   let treeMap = new TreeMapChart();
//   treeMap.preload();
//   treeMap.draw();
// }
