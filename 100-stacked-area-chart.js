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
  this.yAxisLabel = "Value";

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
    numYTickLabels: 8,
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

    // Set min and max years: assumes data is sorted by date.
    this.xLabels = this.data.getColumn(0);
    // this.endX = this.data.getString(this.data.getRowCount() - 1, 0);

    // Find min and max pay values for mapping to canvas height.
    this.minVal = 0; //
    this.maxVal = 1;
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

    console.log(this.maxActualValues);
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
    // Empty the list of lines
    this.areaLines = [];
    // Loop over all rows and draw a line from the previous value to
    // the current.
    var yHeights = [];
    for (var j = 0; j < this.data.getRowCount(); j++) {
      yHeights.push(this.layout.bottomMargin);
    }

    for (var j = 1; j < this.data.getColumnCount(); j++) {
      var previous = {
        x: 0,
        val: this.data.getNum(0, j),
        label: this.data.getColumn(j),
        xlabel: this.data.getString(0, 0),
      };
      for (var i = 1; i < this.data.getRowCount(); i++) {
        // Create an object to store data for the current year.
        var current = {
          // Convert strings to numbers.
          x: i,
          // y: this.mapYToHeight(this.data.getNum(i, j)),
          val: this.data.getNum(i, j),
          label: this.data.getColumn(j),
          xlabel: this.data.getString(i, 0),
        };
        if (previous != null) {
          // console.log(
          //   this.mapYToHeight(current.val / this.maxActualValue) -
          //     (this.layout.bottomMargin - yHeights[i])
          // );
          // console.log(this.mapYToHeight(current.val / this.maxActualValue));
          var tempAreaLine = new AreaLine(
            this.mapXToWidth(previous.x),
            this.mapYToHeight(previous.val / this.maxActualValues[i - 1]) -
              (this.layout.bottomMargin - yHeights[i - 1]),
            this.mapXToWidth(current.x),
            this.mapYToHeight(current.val / this.maxActualValues[i]) -
              (this.layout.bottomMargin - yHeights[i]),
            yHeights[i - 1],
            yHeights[i],
            j
          );
          this.areaLines.push(tempAreaLine);

          yHeights[i - 1] =
            this.mapYToHeight(previous.val / this.maxActualValues[i - 1]) -
            (this.layout.bottomMargin - yHeights[i - 1]);
          // The number of x-axis labels to skip so that only
          // numXTickLabels are drawn.
          var xLabelSkip = ceil(this.numXLabels / this.layout.numXTickLabels);

          //

          if (i % xLabelSkip == 0) {
            drawXAxisTickLabel(
              previous.year,
              this.layout,
              this.mapXToWidth.bind(this)
            );
          }
        }
        // console.log(this.areaLines);
        // Assign current year to previous year so that it is available
        // during the next iteration of this loop to give us the start
        // position of the next line segment.
        previous = current;
      }
      yHeights[this.data.getRowCount() - 1] =
        this.mapYToHeight(
          current.val / this.maxActualValues[this.data.getRowCount() - 1]
        ) -
        (this.layout.bottomMargin - yHeights[this.data.getRowCount() - 1]);
      // console.log(yHeights);
    }
    // console.log(this.areaLines);
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
}
