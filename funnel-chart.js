function FunnelChart() {
  // Name for the visualisation to appear in the menu bar.
  this.name = "Funnel Chart";

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = "funnel-chart";

  // Title to display above the plot.
  this.title = "Funnel Chart Demo";

  var marginSize = 85;

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
      "./data/new-data/funnel-demo.csv",
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

    this.xAxisLabel = this.data.columns[1];
    this.yAxisLabel = this.data.columns[0];

    var maxWidth = 0;

    for (var i = 0; i < this.data.getRowCount(); i++) {
      if (this.data.getNum(i, 1) > maxWidth) {
        maxWidth = this.data.getNum(i, 1);
      }
    }

    // Draw the title above the plot.
    this.drawTitle();

    // Draw x and y axis.
    // drawAxis(this.layout);

    // Draw x and y axis labels.
    // drawAxisLabels(this.xAxisLabel, this.yAxisLabel, this.layout);

    // Draw labels at the top of the plot.
    this.drawCategoryLabels();

    var lineHeight =
      (this.layout.bottomMargin - this.layout.topMargin) /
      this.data.getRowCount();

    // Draw all y-axis labels.
    drawXAxisTickLabelsFlip(
      0,
      maxWidth,
      this.layout,
      this.mapValuesToWidth.bind(this),
      0
    );

    // Loop over every row in the data.
    for (var i = 0; i < this.data.getRowCount(); i++) {
      // Calculate the x position for each company.
      var lineX = lineHeight * i + this.layout.topMargin;

      // Create an object that stores data from the current row.
      var columnValue = {
        // Add each row's data to the columnValue variable
        name: this.data.getString(i, 0),
        value: this.data.getNum(i, 1),
      };

      // Draw the columnValue name on the left margin.
      fill(0);
      noStroke();
      textAlign("center", "center");
      textSize(14);
      text(
        columnValue.name,
        this.layout.leftMargin - 30,
        lineX + lineHeight / 2
      );
      textSize(14);

      // Draw the value %s name on the right margin.
      fill(0);
      noStroke();
      textAlign("center", "center");
      textSize(14);
      text(
        ((columnValue.value / maxWidth) * 100).toFixed(2).toString() + "%",
        this.layout.rightMargin + 30,
        lineX + lineHeight / 2
      );
      textSize(14);

      // Draw bar.
      fill(colorTheme[i % colorTheme.length]);
      rect(
        ((1 - columnValue.value / maxWidth) *
          (this.layout.rightMargin - this.layout.leftMargin)) /
          2 +
          this.layout.leftMargin,
        lineX,
        (this.layout.rightMargin - this.layout.leftMargin) *
          (columnValue.value / maxWidth),
        lineHeight
      );
      // Draw value inside rectangle
      fill(0);
      noStroke();
      textAlign("center", "bottom");
      textSize(18);
      fill("#FFFFFF");
      text(
        // Source: https://stackoverflow.com/questions/2901102/how-to-format-a-number-with-commas-as-thousands-separators
        columnValue.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        (this.layout.rightMargin - this.layout.leftMargin) / 2 +
          this.layout.leftMargin,
        lineX + lineHeight / 2
      );
      textSize(14);
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

  this.mapValuesToWidth = function (value) {
    var maxWidth = 0;

    for (var i = 0; i < this.data.getRowCount(); i++) {
      if (this.data.getNum(i, 1) > maxWidth) {
        maxWidth = this.data.getNum(i, 1);
      }
    }

    return map(
      value,
      0,
      maxWidth,
      this.layout.leftMargin, // draw bottom to top from margin
      this.layout.rightMargin
    );
  };
}
