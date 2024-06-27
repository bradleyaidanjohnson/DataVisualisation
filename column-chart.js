function ColumnChart() {
  // Name for the visualisation to appear in the menu bar.
  this.name = "Column Chart";

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = "column-chart";

  // Layout object to store all common plot layout parameters and
  // methods.
  this.layout = {
    // Margin positions around the plot. Left and bottom margins are
    // bigger so there is space for axis and tick labels on the canvas.
    leftMargin: 130,
    rightMargin: width,
    topMargin: 30,
    bottomMargin: height,
    pad: 5,

    plotHeight: function () {
      return this.topMargin - this.bottomMargin;
    },

    // Boolean to enable/disable background grid.
    grid: false,

    // Number of axis tick labels to draw so that they are not drawn on
    // top of one another.
    numXTickLabels: 10,
    numYTickLabels: 8,
  };

  // Default visualisation colours.
  this.femaleColour = color(255, 0, 0);
  this.maleColour = color(0, 255, 0);

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function () {
    var self = this;
    this.data = loadTable(
      "./data/new-data/makeup.csv",
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

    // Draw Female/Male labels at the top of the plot.
    this.drawCategoryLabels();

    var lineWidth = (width - this.layout.leftMargin) / this.data.getRowCount();

    var maxHeight = 0;

    for (var i = 0; i < this.data.getRowCount(); i++) {
      if (this.data.getNum(i, 1) > maxHeight) {
        maxHeight = this.data.getNum(i, 1);
      }
    }

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
      textAlign("right", "bottom");
      text(columnValue.name, lineX, this.layout.bottomMargin - 20);

      // Draw female employees rectangle.
      fill(this.femaleColour);
      rect(
        lineX,
        // this.mapPercentToHeight(columnValue.value / maxHeight),
        (1 - columnValue.value / maxHeight) *
          (this.layout.bottomMargin - this.layout.topMargin) +
          this.layout.topMargin,
        lineWidth,
        height -
          (1 - columnValue.value / maxHeight) *
            (this.layout.bottomMargin - this.layout.topMargin) +
          this.layout.topMargin
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
}
