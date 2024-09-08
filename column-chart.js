function ColumnChart() {
  // Name for the visualisation to appear in the menu bar.
  this.name = "Column Chart";

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = "column-chart";

  // Title to display above the plot.
  this.title = "Column Chart Demo";

  // Names for each axis.
  this.xAxisLabel = "";
  this.yAxisLabel = "";

  var marginSize = 35;

  // Initialize max height variable
  this.maxHeight = 0;

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

    // Boolean to enable/disable background grid.
    grid: true,

    // Number of axis tick labels to draw so that they are not drawn on
    // top of one another.
    numXTickLabels: 10,
    numYTickLabels: 8,
  };

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function () {
    var self = this;
    this.data = loadTable(
      "./data/new-data/treemap_makeup.csv",
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

    // Store labels
    this.xAxisLabel = this.data.columns[0];
    this.yAxisLabel = this.data.columns[1];

    // Set max height to the highest value
    for (var i = 0; i < this.data.getRowCount(); i++) {
      if (this.data.getNum(i, 1) > this.maxHeight) {
        this.maxHeight = this.data.getNum(i, 1);
      }
    }

    // Draw the title above the plot.
    this.drawTitle();

    // Draw all y-axis labels.
    drawYAxisTickLabels(
      0,
      this.maxHeight,
      this.layout,
      this.mapValuesToHeight.bind(this),
      0
    );

    // Draw x and y axis.
    drawAxis(this.layout);

    // Draw x and y axis labels.
    drawAxisLabels(this.xAxisLabel, this.yAxisLabel, this.layout);
    // Set variable for line width based on canvas
    var lineWidth =
      (this.layout.rightMargin - this.layout.leftMargin) /
      this.data.getRowCount();

    // Loop over every row in the data.
    for (var i = 0; i < this.data.getRowCount(); i++) {
      // Calculate the x position for each bar
      var lineX = lineWidth * i + this.layout.leftMargin;

      // Create an object that stores data from the current row.
      var columnValue = {
        // Add each row's data to the columnValue variable
        name: this.data.getString(i, 0),
        value: this.data.getNum(i, 1),
      };
      // Draw the columnValue name on the bottom margin.
      fill(0);
      noStroke();
      textAlign("center", "bottom");
      text(
        columnValue.name,
        lineX + lineWidth * 0.5,
        this.layout.bottomMargin + 20
      );

      // Draw bar.
      fill(colorTheme[i % colorTheme.length]);
      rect(
        lineX,
        (1 - columnValue.value / this.maxHeight) *
          (this.layout.bottomMargin - this.layout.topMargin) +
          this.layout.topMargin,
        lineWidth,
        (this.layout.bottomMargin - this.layout.topMargin) *
          (columnValue.value / this.maxHeight)
      );
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

  // Map values to correct place based on canvas
  this.mapValuesToHeight = function (value) {
    return map(
      value,
      0,
      this.maxHeight,
      this.layout.bottomMargin, // draw bottom to top from margin
      this.layout.topMargin
    );
  };
}
