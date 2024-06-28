function ComboChart() {
  // Name for the visualisation to appear in the menu bar.
  this.name = "Combo Chart";

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = "combo-chart";

  // Title to display above the plot.
  this.title = "Combo Chart Demo";

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
      "./data/new-data/makeup-combo.csv",
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
    this.startYear = this.data.getNum(0, "Year");
    this.endYear = this.data.getNum(this.data.getRowCount() - 1, "Year");

    // Find min and max pay gap for mapping to canvas height.
    this.minPayGap = 0; // Pay equality (zero pay gap).
    this.maxPayGap = max(this.data.getColumn("Returns %"));
  };

  // Draw function
  this.draw = function () {
    if (!this.loaded) {
      console.log("Data not yet loaded");
      return;
    }

    this.xAxisLabel = this.data.columns[0];
    this.yAxisLabel = this.data.columns[1];

    var maxHeight = 0;

    for (var i = 0; i < this.data.getRowCount(); i++) {
      if (this.data.getNum(i, 1) > maxHeight) {
        maxHeight = this.data.getNum(i, 1);
      }
    }

    // Draw the title above the plot.
    this.drawTitle();

    // Draw all y-axis labels.
    drawYAxisTickLabels(
      0,
      maxHeight,
      this.layout,
      this.mapValuesToHeight.bind(this),
      0
    );

    // Draw x and y axis.
    drawAxis(this.layout);

    // Draw x and y axis labels.
    drawAxisLabels(this.xAxisLabel, this.yAxisLabel, this.layout);

    // Draw Female/Male labels at the top of the plot.
    this.drawCategoryLabels();

    var lineWidth =
      (this.layout.rightMargin - this.layout.leftMargin) /
      this.data.getRowCount();

    maxHeight = maxHeight * 1.1;

    // Loop over every row in the data.
    for (var i = 0; i < this.data.getRowCount(); i++) {
      // Calculate the x position for each company.
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

      // Draw female employees rectangle.
      fill(colorTheme[i % colorTheme.length]);
      rect(
        lineX,
        (1 - columnValue.value / maxHeight) *
          (this.layout.bottomMargin - this.layout.topMargin) +
          this.layout.topMargin,
        lineWidth,
        (this.layout.bottomMargin - this.layout.topMargin) *
          (columnValue.value / maxHeight)
      );
    }

    // Plot all pay gaps between startYear and endYear using the width
    // of the canvas minus margins.
    var previous;
    var numPoints = this.data.getRowCount();

    // Loop over all rows and draw a line from the previous value to
    // the current.
    for (var i = 0; i < numPoints; i++) {
      // Create an object to store data for the current year.
      var current = {
        // Convert strings to numbers.
        year: this.data.getNum(i, 0),
        returnsPerc: this.data.getNum(i, 2),
      };

      if (previous != null) {
        // Draw line segment connecting previous year to current
        // year pay gap.
        stroke(0);
        line(
          this.mapYearToWidth(previous.year),
          this.mapValuesToLineHeight(previous.returnsPerc),
          this.mapYearToWidth(current.year),
          this.mapValuesToLineHeight(current.returnsPerc)
        );
        // The number of x-axis labels to skip so that only
        // numXTickLabels are drawn.
        var xLabelSkip = ceil(numPoints / this.layout.numXTickLabels);

        // Draw the tick label marking the start of the previous year.
        if (i % xLabelSkip == 0) {
          drawXAxisTickLabel(
            previous.year,
            this.layout,
            this.mapYearToWidth.bind(this)
          );
        }
      }

      // Assign current year to previous year so that it is available
      // during the next iteration of this loop to give us the start
      // position of the next line segment.
      previous = current;
    }
  };

  this.drawCategoryLabels = function () {
    // fill(0);
    // noStroke();
    // textAlign("left", "top");
    // text("Female", this.layout.leftMargin, this.layout.pad);
    // textAlign("center", "top");
    // text("50%", this.midX, this.layout.pad);
    // textAlign("right", "top");
    // text("Male", this.layout.rightMargin, this.layout.pad);
  };

  this.mapPercentToHeight = function (percent) {
    // console.log(percent);
    return map(percent, 0, 100, 0, this.layout.plotHeight());
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

  this.mapValuesToHeight = function (value) {
    var maxHeight = 0;

    for (var i = 0; i < this.data.getRowCount(); i++) {
      if (this.data.getNum(i, 1) > maxHeight) {
        maxHeight = this.data.getNum(i, 1);
      }
    }

    return map(
      value,
      0,
      maxHeight,
      this.layout.bottomMargin, // draw bottom to top from margin
      this.layout.topMargin
    );
  };

  this.mapValuesToLineHeight = function (value) {
    var maxHeight = 0;

    for (var i = 0; i < this.data.getRowCount(); i++) {
      if (this.data.getNum(i, 2) > maxHeight) {
        maxHeight = this.data.getNum(i, 2);
      }
    }

    return map(
      value,
      0,
      maxHeight,
      this.layout.bottomMargin, // draw bottom to top from margin
      this.layout.topMargin
    );
  };

  this.mapYearToWidth = function (value) {
    return map(
      value,
      this.startYear,
      this.endYear,
      this.layout.leftMargin, // Draw left-to-right from margin.
      this.layout.rightMargin
    );
  };
}
