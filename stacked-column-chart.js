function StackedColumnChart() {
  // Name for the visualisation to appear in the menu bar.
  this.name = "Stacked Column Chart";

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = "stacked-column-chart";

  // Title to display above the plot.
  this.title = "Stacked Column Chart Demo";

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
      "./data/new-data/segments_table2.csv",
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

    // this.xAxisLabel = this.data.columns[0];
    this.yAxisLabel = this.data.columns[0];

    var maxHeight = 0;
    var curHeightArray = [];

    for (var i = 1; i < this.data.getColumnCount(); i++) {
      var curHeight = 0;
      for (var j = 0; j < this.data.getRowCount(); j++) {
        curHeight += this.data.getNum(j, i);
        if (curHeight > maxHeight) {
          maxHeight = curHeight;
        }
      }
      curHeightArray.push(curHeight);
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
      this.data.getColumnCount();

    // Loop over every row in the data.
    for (var i = 1; i < this.data.getColumnCount(); i++) {
      diff = 0;
      for (var j = 0; j < this.data.getRowCount(); j++) {
        // Calculate the x position for each company.
        var lineX = lineWidth * (i - 1) + this.layout.leftMargin;

        // Create an object that stores data from the current row.
        var columnValue = {
          // Add each row's data to the columnValue variable
          name: this.data.columns[i],
          value: this.data.getNum(j, i),
        };

        // Draw female employees rectangle.
        fill(colorTheme[j % colorTheme.length]);
        x = lineX;
        y =
          (1 - curHeightArray[i - 1] / maxHeight) *
            (this.layout.bottomMargin - this.layout.topMargin) +
          this.layout.topMargin +
          diff;
        w = lineWidth;
        h =
          (this.layout.bottomMargin - this.layout.topMargin) *
          (columnValue.value / maxHeight);
        stroke(1);
        rect(x, y, w, h);
        strokeWeight(0);
        fill("#FFFFFF");
        text(columnValue.value, x + lineWidth / 2, y + h / 2);

        diff += h;

        if (i < 2) {
          this.makeLegendItem(
            this.data.getString(j, 0),
            j,
            colorTheme[j % colorTheme.length]
          );
        }
      }

      // Draw the columnValue name on the bottom margin.
      fill(0);
      noStroke();
      textAlign("center", "bottom");
      text(
        columnValue.name,
        lineX + lineWidth * 0.5,
        this.layout.bottomMargin + 20
      );
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
