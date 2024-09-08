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

  // Initiate variables for scaling
  var marginSize = 35;
  this.lineWidth = 0;
  this.maxHeight = 0;
  this.minHeight = 0;
  this.heightVal = 0;

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

  this.chartOptions = {
    "Simple Waterfall": "./data/new-data/waterfall.csv",
    "Categorical Waterfall": "./data/new-data/waterfall-cat.csv",
    "Quarterly Revenue": "./data/new-data/waterfall_quarterly_revenue.csv",
    "Daily Profit/Loss": "./data/new-data/waterfall_daily_profit_loss.csv",
    "Annual Performance": "./data/new-data/waterfall_annual_performance.csv",
    "Monthly Budget": "./data/new-data/waterfall_monthly_budget.csv",
    "Project Phases": "./data/new-data/waterfall_project_phases.csv",
    "Seasonal Sales": "./data/new-data/waterfall_seasonal_sales.csv",
  };

  this.currentSelection = "Simple Waterfall";

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
  };

  this.destroy = function () {
    this.select.remove();
  };

  // Draw function
  this.draw = function () {
    // Set max and min heights for canvas
    this.maxHeight = 0;
    this.minHeight = 0;
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
    // Initiate variables to hold the number of rows
    var colCount = this.data.getColumnCount();
    var rowCount = this.data.getRowCount();
    // Initiate a variable to hold the current value outside of the loop
    var currVal = 0;
    // If there are 2 columns set the axis names
    if (colCount === 2) {
      this.xAxisLabel = this.data.columns[0];
      this.yAxisLabel = this.data.columns[1];
      //Loop through rows to set the max/min height based on row total
      for (var i = 0; i < this.data.getRowCount(); i++) {
        currVal = currVal + this.data.getNum(i, 1);
        if (currVal > this.maxHeight) {
          this.maxHeight = currVal;
        }
        if (currVal < this.minHeight) {
          this.minHeight = currVal;
        }
      }
    } else if (colCount > 2) {
      // set labels for column counts greater than 2
      this.xAxisLabel = this.data.columns[0];
      this.yAxisLabel = "Values";

      //Loop through rows to set the max/min height based on row totals
      var currRowValue = 0;
      for (var i = 0; i < rowCount; i++) {
        for (var j = 1; j < colCount; j++) {
          currRowValue = this.data.getNum(i, j) + currRowValue;
          if (currRowValue > this.maxHeight) {
            this.maxHeight = currRowValue;
          }
          if (currRowValue < this.minHeight) {
            this.minHeight = currRowValue;
          }
        }
        currRowValue = 0;
      }
    }
    // Set a heigh value of max - min
    this.heightVal = this.maxHeight - this.minHeight;

    // Draw the title above the plot.
    this.drawTitle();

    // Draw all y-axis labels.
    drawYAxisTickLabels(
      this.minHeight,
      this.maxHeight,
      this.layout,
      this.mapValuesToHeight.bind(this),
      0
    );

    // Draw x and y axis.
    drawSubZeroAxis(this.layout, 0, this.minHeight, this.maxHeight);

    // Draw x and y axis labels.
    drawSubZeroAxisLabels(this.xAxisLabel, this.yAxisLabel, this.layout);

    // Initialise variables to calculate shapes below x axis
    var subZero = this.heightVal - this.maxHeight;
    var subZeroPerc = subZero / this.heightVal;
    var layoutHeight = this.layout.bottomMargin - this.layout.topMargin;
    var subZeroPixels = subZeroPerc * layoutHeight;

    // Variable fo the top of a column
    var columnTop = this.layout.bottomMargin - subZeroPixels;
    // 2 versions of the draw function depending on number of cols
    // Which indicates the type of waterfall chart needed
    // Either categorical or cumulative
    if (colCount === 2) {
      this.lineWidth =
        (this.layout.rightMargin - this.layout.leftMargin) /
        this.data.getRowCount();

      // Loop over every row in the data.
      for (var i = 0; i < this.data.getRowCount(); i++) {
        // Calculate line distance
        var lineX = this.lineWidth * i + this.layout.leftMargin;

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
          lineX + this.lineWidth * 0.5,
          this.layout.bottomMargin + 20
        );
        // Math to recalculate the top of columnn based on where the previous left off
        columnTop =
          (1 - (columnValue.value - this.minHeight) / this.heightVal) *
            (this.layout.bottomMargin - this.layout.topMargin) +
          this.layout.topMargin -
          this.layout.bottomMargin +
          +subZeroPixels +
          columnTop;
        // Draw rectangle
        // Red if negative
        if (columnValue.value < 0) {
          fill(255, 0, 0);
        } else {
          fill(colorTheme[i % colorTheme.length]);
        }
        rect(
          lineX,
          columnTop,
          this.lineWidth,
          (this.layout.bottomMargin - this.layout.topMargin) *
            (columnValue.value / this.heightVal)
        );
      }
      // Logic for categorical waterfall chart
    } else if (colCount > 2) {
      // Line width based on total number of columns
      this.lineWidth =
        (this.layout.rightMargin - this.layout.leftMargin) /
        (this.data.getRowCount() * this.data.getColumnCount());
      // Loop the rows
      for (var i = 0; i < this.data.getRowCount(); i++) {
        // Initiallise a row sum variable each loop
        var rowSum = 0;
        columnTop = this.layout.bottomMargin - subZeroPixels;
        // Loop over the columns each row
        for (var j = 1; j < this.data.getColumnCount(); j++) {
          // i = row, j = column
          // Set line distance based on number of columns
          var lineX =
            this.lineWidth * ((i + 1) * colCount - (colCount - (j - 1))) +
            this.layout.leftMargin;

          // Create an object that stores data from the current row.
          var columnValue = {
            // Add each row's data to the columnValue variable
            name: this.data.columns[j],
            value: this.data.getNum(i, j),
          };
          rowSum = rowSum + columnValue.value;

          // Draw the columnValue name on the bottom margin.
          fill(0);
          noStroke();
          textAlign("center", "bottom");
          // Draw a rotated label
          this.drawRotatedLabel(
            columnValue.name,
            lineX + this.lineWidth * 0.5 - 15,
            this.layout.bottomMargin + 30
          );
          // Calcualte row top position based on the previous
          columnTop =
            (1 - (columnValue.value - this.minHeight) / this.heightVal) *
              (this.layout.bottomMargin - this.layout.topMargin) +
            this.layout.topMargin -
            this.layout.bottomMargin +
            +subZeroPixels +
            columnTop;
          // Draw rectangle
          // Red for negative values
          if (columnValue.value < 0) {
            fill(255, 0, 0);
          } else {
            fill(colorTheme[(j + 4) % colorTheme.length]);
          }
          rect(
            lineX,
            columnTop,
            this.lineWidth,
            (this.layout.bottomMargin - this.layout.topMargin) *
              (columnValue.value / this.heightVal)
          );
        }
        // Draw a total rect outside the column loop
        var lineX =
          this.lineWidth * ((i + 1) * colCount - (colCount - (j - 1))) +
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
        // Draw rotated label for space
        this.drawRotatedLabel(
          columnValue.name,
          lineX + this.lineWidth * 0.5 - 15,
          this.layout.bottomMargin + 30
        );
        // Draw rectangle
        if (columnValue.value < 0) {
          fill(255, 0, 0);
        } else {
          fill(0, 0, 0);
        }
        rect(
          lineX,
          (1 - (columnValue.value - this.minHeight) / this.heightVal) *
            (this.layout.bottomMargin - this.layout.topMargin) +
            this.layout.topMargin,
          this.lineWidth,
          (this.layout.bottomMargin - this.layout.topMargin) *
            (columnValue.value / this.heightVal)
        );
      }
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
      this.minHeight,
      this.maxHeight,
      this.layout.bottomMargin, // draw bottom to top from margin
      this.layout.topMargin
    );
  };
  // Draw rotated labels for space
  this.drawRotatedLabel = function (textString, xPos, yPos) {
    // Store canvas
    push();
    // Move to position
    translate(xPos, yPos);
    // Rotate canvas about position
    rotate((-PI / 4) * 1);
    // Write text
    textAlign("center", "left");
    textSize(min(8, int(this.lineWidth / 3)));
    text(textString, 0, 0);
    textSize(12);
    // Load canvas
    pop();
  };
}
