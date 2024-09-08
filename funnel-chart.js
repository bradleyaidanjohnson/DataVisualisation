function FunnelChart() {
  // Name for the visualisation to appear in the menu bar.
  this.name = "Funnel Chart";

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = "funnel-chart";

  // Title to display above the plot.
  this.title = "Funnel Chart Demo";

  var marginSize = 85;

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
  };

  this.chartOptions = {
    "Simple Funnel Chart": "./data/new-data/funnel-demo.csv",
    "2 Stages": "./data/new-data/funnel-2stage.csv",
    "Gradual Decline Many Stages":
      "./data/new-data/funnel-gradual_manystages.csv",
    "Narrow Few Stages": "./data/new-data/funnel-narrow_few.csv",
    "Narrow Moderate Decline": "./data/new-data/funnel-narrow_moderate.csv",
    "Narrow Small Sample Size": "./data/new-data/funnel-narrow_smallsample.csv",
    "Wide Gradual Decline": "./data/new-data/funnel-wide_gradual.csv",
    "Wide Many Stages": "./data/new-data/funnel-wide_many.csv",
    "Wide Minimal Decline": "./data/new-data/funnel-wide_minimal.csv",
    "Wide Sharp Decline": "./data/new-data/funnel-wide_sharp.csv",
    "Wide Variable Decline": "./data/new-data/funnel-wide_variable.csv",
  };

  this.currentSelection = "Simple Funnel Chart";

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
    // Set axis labels
    this.xAxisLabel = this.data.columns[1];
    this.yAxisLabel = this.data.columns[0];
    this.maxWidth = 0;
    // Loop values to set maxwidth
    for (var i = 0; i < this.data.getRowCount(); i++) {
      if (this.data.getNum(i, 1) > this.maxWidth) {
        this.maxWidth = this.data.getNum(i, 1);
      }
    }

    // Draw the title above the plot.
    this.drawTitle();
    // Initialise a lineheigh variable
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
      // Set the line heigh per bar
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
      textAlign("left", "center");
      textSize(14);
      text(
        columnValue.name,
        this.layout.leftMargin - 150,
        lineX + lineHeight / 2
      );
      textSize(14);

      // Draw the value %s name on the right margin.
      fill(0);
      noStroke();
      textAlign("center", "center");
      textSize(14);
      text(
        ((columnValue.value / this.maxWidth) * 100).toFixed(1).toString() + "%",
        this.layout.rightMargin + 30,
        lineX + lineHeight / 2
      );
      textSize(14);

      // Draw bar.
      fill(colorTheme[i % colorTheme.length]);
      rect(
        ((1 - columnValue.value / this.maxWidth) *
          (this.layout.rightMargin - this.layout.leftMargin)) /
          2 +
          this.layout.leftMargin,
        lineX,
        (this.layout.rightMargin - this.layout.leftMargin) *
          (columnValue.value / this.maxWidth),
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
