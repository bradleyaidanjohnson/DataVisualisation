function AreaChart() {
  // Name for the visualisation to appear in the menu bar.
  this.name = "Area Chart";

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = "area-chart";

  // Title to display above the plot.
  this.title = "Area Chart Demo";

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

  this.chartOptions = {
    "Simple Area Chart": "./data/new-data/area_chart_data.csv",
    "Seasonal Sales": "./data/new-data/area_chart_region.csv",
    Stocks: "./data/new-data/area_chart_stocks.csv",
  };

  this.currentSelection = "Simple Area Chart";

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function () {
    var self = this;
    this.data = loadTable(
      this.chartOptions[this.currentSelection],
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
    if (!this.loaded) {
      console.log("Data not yet loaded");
      return;
    }

    // Create a select DOM element.
    this.select = createSelect();

    // Set select position.
    this.select.position(350, 700);

    // Fill the options with all company names.
    for (var optionKey in this.chartOptions) {
      this.select.option(optionKey);
    }
    // Font defaults.
    textSize(16);
  };

  this.destroy = function () {
    this.select.remove();
  };

  this.draw = function () {
    if (!this.loaded) {
      console.log("Data not yet loaded");
      return;
    } else if (this.select.value() !== this.currentSelection) {
      this.currentSelection = this.select.value();
      this.data = loadTable(
        this.chartOptions[this.currentSelection],
        "csv",
        "header",
        // Callback function to set the value
        // this.loaded to true.
        function (table) {
          self.loaded = true;
        }
      );
      return;
    }

    // Set labels for the x axis
    this.xLabels = this.data.getColumn(0);

    // Find min and max pay values for mapping to canvas height.
    this.minVal = 0;
    this.maxVal = 0;
    for (var i = 0; i < this.data.getRowCount(); i++) {
      for (var j = 1; j < this.data.getColumnCount(); j++) {
        var currVal = this.data.getNum(i, j);
        if (currVal > this.maxVal) {
          this.maxVal = currVal;
        }
      }
    }

    this.numXLabels = max(0, this.xLabels.length - 1);
    this.xAxisLabel = this.data.columns[0];

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
    // Loop over all rows and draw a vector for each value
    for (var j = 1; j < this.data.getColumnCount(); j++) {
      var previous = {
        x: 0,
        val: this.data.getNum(0, j),
        label: this.data.getColumn(j),
        xlabel: this.data.getString(0, 0),
      };
      for (var i = 1; i < this.data.getRowCount(); i++) {
        // Create an object to store data for the current value.
        var current = {
          // Convert strings to numbers.
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
            this.mapYToHeight(previous.val),
            this.mapXToWidth(current.x),
            this.mapYToHeight(current.val),
            this.layout.bottomMargin,
            this.layout.bottomMargin,
            j
          );
          this.areaLines.push(tempAreaLine);
          // The number of x-axis labels to skip so that only
          // numXTickLabels are drawn.
          var xLabelSkip = ceil(this.numXLabels / this.layout.numXTickLabels);
          if (i % xLabelSkip == 0) {
            drawXAxisTickLabel(
              previous.year,
              this.layout,
              this.mapXToWidth.bind(this)
            );

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
    textSize(10);
    text(label, x + boxWidth + 10, y + boxWidth / 2);
    textSize(16);
  };
}
