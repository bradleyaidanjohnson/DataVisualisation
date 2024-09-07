function HundredStackedAreaChart() {
  // Name for the visualisation to appear in the menu bar.
  this.name = "100% Stacked Area Chart";

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = "hundred-stacked-area-chart";

  // Title to display above the plot.
  this.title = "100% Stacked Area Chart Demo";

  // Names for each axis.
  this.xAxisLabel = "";
  this.yAxisLabel = "%";

  // Array of areaLines to hold lines drawn before filling
  this.areaLines = [];

  var marginSize = 35;

  this.numXLabels = 0;

  // Layout object to store all common plot layout parameters and
  // methods.
  this.layout = {
    marginSize: marginSize,

    // Margin positions around the plot. Left and bottom have double
    // margin size to make space for axis and tick labels on the canvas.
    leftMargin: marginSize * 2,
    rightMargin: width - marginSize,
    topMargin: marginSize,
    bottomMargin: height - marginSize * 2,
    pad: 5,

    plotWidth: function () {
      return this.rightMargin - this.leftMargin;
    },

    plotHeight: function () {
      return this.bottomMargin - this.topMargin;
    },

    // Boolean to enable/disable background grid.
    grid: true,

    // Number of axis tick labels to draw so that they are not drawn on
    // top of one another.
    numXTickLabels: 10,
    numYTickLabels: 10,
  };

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function () {
    var self = this;
    this.data = loadTable(
      "./data/new-data/100_stacked_area_chart_data.csv",
      "csv",
      "header",
      // Callback function to set the value
      // this.loaded to true.
      function (table) {
        self.loaded = true;
      }
    );
  };

  this.setup = function () {
    // Font defaults.
    textSize(16);

    // Set labels for the x axis
    this.xLabels = this.data.getColumn(0);

    // Find min and max values for mapping to canvas height.
    this.minVal = 0; //
    this.maxVal = 100;
    // Create an array of max values that correspond to each row for later normalization
    this.maxActualValues = [];
    for (var i = 0; i < this.data.getRowCount(); i++) {
      var currVal = 0;
      for (var j = 1; j < this.data.getColumnCount(); j++) {
        currVal = currVal + this.data.getNum(i, j);
      }
      this.maxActualValues.push(currVal);
    }

    this.numXLabels = max(0, this.xLabels.length - 1);
    this.xAxisLabel = this.data.columns[0];
  };
  this.destroy = function () {};

  this.draw = function () {
    if (!this.loaded) {
      console.log("Data not yet loaded");
      return;
    }

    // Draw the title above the plot.
    this.drawTitle();

    // Draw all y-axis labels.
    drawYAxisTickLabels(
      this.minVal,
      this.maxVal,
      this.layout,
      this.mapYToHeight.bind(this),
      0
    );

    drawAreaXAxisTickLabel(this.data.getColumn(0), this.layout);

    // Draw x and y axis.
    drawAxis(this.layout);

    // Draw x and y axis labels.
    drawAxisLabels(this.xAxisLabel, this.yAxisLabel, this.layout);

    // Plot all values

    // Reset list of areaLines to empty every draw
    this.areaLines = [];
    // Initiate yHeights to set the base of each vector's heights, (starts at bottom margin).
    var yHeights = [];
    for (var j = 0; j < this.data.getRowCount(); j++) {
      yHeights.push(this.layout.bottomMargin);
    }

    // Loop over all rows and draw a vector for each value
    for (var j = 1; j < this.data.getColumnCount(); j++) {
      // Initialize a previous to the left margin to begin drawing vectors
      var previous = {
        x: 0,
        val: this.data.getNum(0, j),
        label: this.data.getColumn(j),
        xlabel: this.data.getString(0, 0),
      };
      for (var i = 1; i < this.data.getRowCount(); i++) {
        // Create an object to store data for the current value.
        var current = {
          x: i,
          val: this.data.getNum(i, j),
          label: this.data.getColumn(j),
          xlabel: this.data.getString(i, 0),
        };
        if (previous != null) {
          // Create a new AreaLine variable for the next vector
          // each vector is built on the previous shape
          var tempAreaLine = new AreaLine(
            this.mapXToWidth(previous.x),
            this.mapYToHeight(
              (previous.val / this.maxActualValues[i - 1]) * 100
            ) -
              (this.layout.bottomMargin - yHeights[i - 1]),
            this.mapXToWidth(current.x),
            this.mapYToHeight((current.val / this.maxActualValues[i]) * 100) -
              (this.layout.bottomMargin - yHeights[i]),
            yHeights[i - 1],
            yHeights[i],
            j
          );
          // Push the vector to the list of vectors
          this.areaLines.push(tempAreaLine);

          yHeights[i - 1] =
            this.mapYToHeight(
              (previous.val / this.maxActualValues[i - 1]) * 100
            ) -
            (this.layout.bottomMargin - yHeights[i - 1]);
          // The number of x-axis labels to skip so that only
          // numXTickLabels are drawn.
          var xLabelSkip = ceil(this.numXLabels / this.layout.numXTickLabels);

          if (i % xLabelSkip == 0) {
            drawXAxisTickLabel(
              previous.year,
              this.layout,
              this.mapXToWidth.bind(this)
            );
            // Draw legend
            this.makeLegendItem(
              this.data.columns[j],
              j - 1,
              colorTheme[(j - 1) % colorTheme.length]
            );
          }
        }
        // Set previous to the current value ready for the next iteration
        previous = current;
      }
      // Update the final yHeight in the column (has to be done outside the loop)
      yHeights[this.data.getRowCount() - 1] =
        this.mapYToHeight(
          (current.val / this.maxActualValues[this.data.getRowCount() - 1]) *
            100
        ) -
        (this.layout.bottomMargin - yHeights[this.data.getRowCount() - 1]);
    }
    // Draw all vectors
    for (let tempo of this.areaLines) {
      tempo.fillLine();
    }
  };

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

  this.mapXToWidth = function (value) {
    // console.log(this.numXLabels);
    return map(
      value,
      0,
      this.numXLabels,
      this.layout.leftMargin, // Draw left-to-right from margin.
      this.layout.rightMargin
    );
  };

  this.mapYToHeight = function (value) {
    return map(
      value,
      this.minVal,
      this.maxVal,
      this.layout.bottomMargin, // draw bottom to top from margin
      this.layout.topMargin
    );
  };

  this.makeLegendItem = function (label, i, colour) {
    var x = this.layout.leftMargin + i * 100;
    var y = this.layout.bottomMargin + 30;
    var boxWidth = 20;
    var boxHeight = 20;

    fill(colour);
    rect(x, y, boxWidth, boxHeight);

    fill("black");
    noStroke();
    textAlign("left", "center");
    textSize(12);
    text(label, x + boxWidth + 10, y + boxWidth / 2);
  };
}
