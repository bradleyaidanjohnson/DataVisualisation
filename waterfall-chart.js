function WaterfallChart() {
  // Name for the visualisation to appear in the menu bar.
  this.name = "Waterfall Chart";

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = "waterfall-chart";

  // Title to display above the plot.
  this.title = "Waterfall Chart Demo";

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
      // "./data/new-data/waterfall.csv",
      "./data/new-data/waterfall-cat.csv",
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

    this.xAxisLabel = this.data.columns[0];
    this.yAxisLabel = this.data.columns[1];

    var maxHeight = 0;
    var colCount = this.data.getColumnCount();
    var rowCount = this.data.getRowCount();
    // console.log(colCount);

    if (colCount === 2) {
      var colValues = this.data.getColumn(this.data.columns[1]);
      var colNums = colValues.map(Number);

      maxHeight = colNums.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      }, 0);
    } else if (colCount > 2) {
      for (var i = 0; i < rowCount; i++) {
        var sum = 0;
        for (var j = 1; j < colCount; j++) {
          if (this.data.getNum(i, j) > 0) {
            sum = sum + this.data.getNum(i, j);
          }
        }
        if (sum > maxHeight) {
          maxHeight = sum;
        }
      }
    }

    console.log(maxHeight);

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
    if (colCount === 2) {
      var lineWidth =
        (this.layout.rightMargin - this.layout.leftMargin) /
        this.data.getRowCount();

      // Loop over every row in the data.
      var columnTop = this.layout.bottomMargin;
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
        columnTop =
          (1 - columnValue.value / maxHeight) *
            (this.layout.bottomMargin - this.layout.topMargin) +
          this.layout.topMargin -
          this.layout.bottomMargin +
          columnTop;
        // Draw rectangle
        if (columnValue.value < 0) {
          fill(255, 0, 0);
        } else {
          fill(colorTheme[i % colorTheme.length]);
        }

        rect(
          lineX,
          columnTop,
          lineWidth,
          (this.layout.bottomMargin - this.layout.topMargin) *
            (columnValue.value / maxHeight)
        );
      }
    } else if (colCount > 2) {
      var lineWidth =
        (this.layout.rightMargin - this.layout.leftMargin) /
        (this.data.getRowCount() * this.data.getRowCount());

      for (var i = 0; i < this.data.getRowCount(); i++) {
        // Loop over every row in the data.
        var rowSum = 0;
        var columnTop = this.layout.bottomMargin;
        for (var j = 1; j < this.data.getColumnCount(); j++) {
          // i = row, j = column
          // Calculate the x position for each company.
          var lineX =
            lineWidth * ((i + 1) * colCount - (colCount - (j - 1))) +
            this.layout.leftMargin;

          // Create an object that stores data from the current row.
          var columnValue = {
            // Add each row's data to the columnValue variable
            name: this.data.columns[j],
            value: this.data.getNum(i, j),
          };
          rowSum = rowSum + columnValue.value;
          // console.log(columnValue.name);

          // Draw the columnValue name on the bottom margin.
          fill(0);
          noStroke();
          textAlign("center", "bottom");
          text(
            columnValue.name,
            lineX + lineWidth * 0.5,
            this.layout.bottomMargin + 20
          );
          columnTop =
            (1 - columnValue.value / maxHeight) *
              (this.layout.bottomMargin - this.layout.topMargin) +
            this.layout.topMargin -
            this.layout.bottomMargin +
            columnTop;
          // Draw rectangle
          if (columnValue.value < 0) {
            fill(255, 0, 0);
          } else {
            fill(colorTheme[(j + 4) % colorTheme.length]);
          }

          rect(
            lineX,
            columnTop,
            lineWidth,
            (this.layout.bottomMargin - this.layout.topMargin) *
              (columnValue.value / maxHeight)
          );
        }
        // Draw a total rect
        var lineX =
          lineWidth * ((i + 1) * colCount - (colCount - (j - 1))) +
          this.layout.leftMargin;

        // Create an object that stores data from the current row.
        var columnValue = {
          // Add each row's data to the columnValue variable
          name: this.data.getString(i, 0) + " Total",
          value: rowSum,
        };
        fill(0);
        noStroke();
        textAlign("center", "bottom");
        text(
          columnValue.name,
          lineX + lineWidth * 0.5,
          this.layout.bottomMargin + 20
        );
        // Draw rectangle
        if (columnValue.value < 0) {
          fill(255, 0, 0);
        } else {
          fill(0, 0, 0);
        }

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
}
