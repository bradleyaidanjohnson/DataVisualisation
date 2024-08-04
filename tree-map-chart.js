function TreeMapChart() {
  // Name for the visualisation to appear in the menu bar.
  this.name = "Tree Map Chart";

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = "tree-map-chart";

  // Title to display above the plot.
  this.title = "Tree Map Chart Demo";

  // Names for each axis.
  this.xAxisLabel = "";
  this.yAxisLabel = "";

  var marginSize = 35;

  // Layout object to store all common plot layout parameters and
  // methods.
  this.layout = {
    marginSize: marginSize,
    // bigger so there is space for axis and tick labels on the canvas.
    leftMargin: marginSize * 2,
    rightMargin: width - marginSize,
    topMargin: marginSize,
    bottomMargin: height - marginSize * 2,
    pad: 5,

    plotHeight: function () {
      return this.topMargin - this.bottomMargin;
    },

    plotWidth: function () {
      return this.rightMargin - this.leftMargin;
    },
  };

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function () {
    var self = this;
    this.data = loadTable(
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
    console.log(totalHeight, totalWidth);
    let initialRectangle = new Rectangle(
      totalWidth,
      totalHeight,
      this.layout.leftMargin,
      this.layout.topMargin
    );
    let layout = [];

    this.squarify(
      scaledData,
      [],
      initialRectangle.shortestSide(),
      initialRectangle,
      layout
    );
    this.drawRectangles(layout);
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
  this.squarify = function (children, row, width, remainingRectangle, layout) {
    if (children.length === 0) {
      remainingRectangle.layoutRow(row, layout);
      return;
    }

    let c = children[0];
    if (
      row.length === 0 ||
      this.worst(row, width) > this.worst([...row, c], width)
    ) {
      this.squarify(
        children.slice(1),
        [...row, c],
        width,
        remainingRectangle,
        layout
      );
    } else {
      remainingRectangle.layoutRow(row, layout);
      this.squarify(
        children,
        [],
        remainingRectangle.shortestSide(),
        remainingRectangle,
        layout
      );
    }
  };

  // Draw rectangles on the canvas
  this.drawRectangles = function (layout) {
    rect(50, 50, 50, 50);
    layout.forEach((rectData) => {
      fill(100, 200, 255);
      stroke(0);
      let rectX = rectData.x;
      let rectY = rectData.y;
      let rectL = rectData.length;
      let rectD = rectData.depth;
      rect(rectX, rectY, rectL, rectD);
      fill(0);
      textSize(12);
      textAlign(CENTER, CENTER);
      text(rectData.data_name, rectX + rectL / 2, rectY + rectD / 2);
    });
  };
}
