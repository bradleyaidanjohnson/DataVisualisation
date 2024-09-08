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
  // Initialize max height variables for both axes
  this.maxHeight = 0;
  this.maxHeight2 = 0;

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
    "Simple Combo Chart": "./data/new-data/makeup-combo.csv",
    "Expenses vs Expense Ratio":
      "./data/new-data/combo_expenses_expense_ratio.csv",
    "Production vs Efficiency Rate":
      "./data/new-data/combo_production_efficiency_rate.csv",
    "Revenue vs Profit Margin":
      "./data/new-data/combo_revenue_profit_margin.csv",
    "Sales vs Growth": "./data/new-data/combo_sales_growth.csv",
    "Traffic vs Conversion Rate":
      "./data/new-data/combo_traffic_conversion_rate.csv",
  };

  this.currentSelection = "Simple Combo Chart";

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

  // Draw function
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
    // Font defaults.
    textSize(16);

    // Set min and max x values
    this.startXVal = this.data.getNum(0, 0);
    this.endXVal = this.data.getNum(this.data.getRowCount() - 1, 0);

    // Dynamically set x tick labels
    numXTickLabels = this.data.getRowCount() + 1;
    // Set labels
    this.xAxisLabel = this.data.columns[0];
    this.yAxisLabel1 = this.data.columns[1];
    this.yAxisLabel2 = this.data.columns[2];
    this.maxHeight = 0;
    this.maxHeight2 = 0;
    // Loop rows for both max values
    for (var i = 0; i < this.data.getRowCount(); i++) {
      if (this.data.getNum(i, 1) > this.maxHeight) {
        this.maxHeight = this.data.getNum(i, 1);
      }
      if (this.data.getNum(i, 2) > this.maxHeight2) {
        this.maxHeight2 = this.data.getNum(i, 2);
      }
    }

    // Draw the title above the plot.
    this.drawTitle();

    // Draw all y-axis labels.
    drawComboYAxisTickLabels(
      0,
      this.maxHeight,
      this.maxHeight2,
      this.layout,
      this.mapValuesToHeight.bind(this),
      this.mapValuesToLineHeight.bind(this),
      0,
      1
    );

    // Draw x and y axis.
    drawComboAxis(this.layout);

    // Draw x and y axis labels.
    drawComboAxisLabels(
      this.xAxisLabel,
      this.yAxisLabel1,
      this.yAxisLabel2,
      this.layout
    );
    // Initiate variable to hold width of line
    var lineWidth =
      (this.layout.rightMargin - this.layout.leftMargin) /
      this.data.getRowCount();

    // Loop over every row in the data.
    for (var i = 0; i < this.data.getRowCount(); i++) {
      // Calculate the x line for the row
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

      // Draw bar
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

    // Initiate previous vairble and get the number of points from the rowcount
    var previous;
    var numPoints = this.data.getRowCount();

    // Loop over all rows and draw a line from the previous value to
    // the current.
    for (var i = 0; i < numPoints; i++) {
      // Create an object to store data for the current year.
      var current = {
        year: this.data.getNum(i, 0),
        returnsPerc: this.data.getNum(i, 2),
      };
      // If this is the first loop, skip drawing the line as there is no origin
      if (previous != null) {
        // Draw line segment connecting previous to current
        stroke(0);
        line(
          this.mapXValToWidth(previous.year),
          this.mapValuesToLineHeight(previous.returnsPerc),
          this.mapXValToWidth(current.year),
          this.mapValuesToLineHeight(current.returnsPerc)
        );
      }

      // Assign previous to current
      previous = current;
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
  // Map values to height for bars
  this.mapValuesToHeight = function (value) {
    return map(
      value,
      0,
      this.maxHeight,
      this.layout.bottomMargin, // draw bottom to top from margin
      this.layout.topMargin
    );
  };
  // Map values to heights for lines
  this.mapValuesToLineHeight = function (value) {
    return map(
      value,
      0,
      this.maxHeight2,
      this.layout.bottomMargin, // draw bottom to top from margin
      this.layout.topMargin
    );
  };
  // Map x values to width function
  this.mapXValToWidth = function (value) {
    return map(
      value,
      this.startXVal,
      this.endXVal,
      this.layout.leftMargin, // Draw left-to-right from margin.
      this.layout.rightMargin
    );
  };
}
