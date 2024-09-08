function BarChart() {
  // Name for the visualisation to appear in the menu bar.
  this.name = "Bar Chart";

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = "bar-chart";

  // Title to display above the plot.
  this.title = "Bar Chart Demo";

  // Names for each axis.
  this.xAxisLabel = "";
  this.yAxisLabel = "";

  var marginSize = 35;

  // Initialize max width variable
  this.maxWidth = 0;

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
    "Simple Bar Chart": "./data/new-data/treemap_makeup.csv",
    "Monthly Sales": "./data/new-data/bc_ monthly_sales.csv",
    "Monthly Rainfall": "./data/new-data/bc_ monthly_rainfall.csv",
    "Store Revenue": "./data/new-data/bc_ store_revenue.csv",
    "Monthly Temperatures": "./data/new-data/bc_monthly_temp.csv",
    Visits: "./data/new-data/bc_visits.csv",
    Other: "./data/new-data/100_stacked_area_chart_data.csv",
    "Market Share": "./data/new-data/100_stacked_area_market_share.csv",
    "Simple Stacked Area Chart": "./data/new-data/stacked_area_chart_data.csv",
    "Monthly Expenses": "./data/new-data/stacked_area_monthly_expenses.csv",
    "Annual Volatile": "./data/new-data/stacked_area_annual_volatile.csv",
    "Monthly Random Spikes": "./data/new-data/stacked_area_monthly_random.csv",
    "Quarterly Sharp": "./data/new-data/stacked_area_quarterly_sharp.csv",
    "Weekly Chaotic": "./data/new-data/stacked_area_weekly_chaotic.csv",
  };

  this.currentSelection = "Simple Bar Chart";

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

    // Store labels
    this.xAxisLabel = this.data.columns[1];
    this.yAxisLabel = this.data.columns[0];

    this.maxWidth = 0;
    // Set max width to the highest value
    for (var i = 0; i < this.data.getRowCount(); i++) {
      if (this.data.getNum(i, 1) > this.maxWidth) {
        this.maxWidth = this.data.getNum(i, 1);
      }
    }
    // Draw the title above the plot.
    this.drawTitle();

    // Draw x and y axis.
    drawAxis(this.layout);

    // Draw x and y axis labels.
    drawAxisLabels(this.xAxisLabel, this.yAxisLabel, this.layout);
    var lineHeight =
      (this.layout.bottomMargin - this.layout.topMargin) /
      this.data.getRowCount();

    // Draw all y-axis labels.
    drawXAxisTickLabelsFlip(
      0,
      this.maxWidth,
      this.layout,
      this.mapValuesToWidth.bind(this),
      0
    );

    // Loop over every row in the data.
    for (var i = 0; i < this.data.getRowCount(); i++) {
      // Calculate the x position for each column.
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
      textAlign("center", "bottom");
      textSize(8);
      text(
        columnValue.name,
        this.layout.leftMargin - 20,
        this.layout.topMargin + lineX
      );
      textSize(14);

      // Draw bar.
      fill(colorTheme[i % colorTheme.length]);
      rect(
        this.layout.leftMargin,
        lineX,
        (this.layout.rightMargin - this.layout.leftMargin) *
          (columnValue.value / this.maxWidth),
        lineHeight
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
  this.mapValuesToWidth = function (value) {
    return map(
      value,
      0,
      this.maxWidth,
      this.layout.leftMargin, // draw bottom to top from margin
      this.layout.rightMargin
    );
  };
}
