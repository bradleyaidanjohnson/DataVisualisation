function StackedBarChart() {
  // Name for the visualisation to appear in the menu bar.
  this.name = "Stacked Bar Chart";

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = "stacked-bar-chart";

  // Title to display above the plot.
  this.title = "Stacked Bar Chart Demo";

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
    // Set axis labels
    this.xAxisLabel = this.data.columns[1];
    this.yAxisLabel = this.data.columns[0];
    // Initialise array to hold widths
    var curWidthArray = [];
    // Loop through finding the width of each column and adding them to array
    // or setting max width if they are the highest
    for (var i = 1; i < this.data.getColumnCount(); i++) {
      var curWidth = 0;
      for (var j = 0; j < this.data.getRowCount(); j++) {
        curWidth += this.data.getNum(j, i);
        if (curWidth > this.maxWidth) {
          this.maxWidth = curWidth;
        }
      }
      // Add width to array
      curWidthArray.push(curWidth);
    }

    // Draw the title above the plot.
    this.drawTitle();

    // Draw x and y axis.
    drawAxis(this.layout);

    // Draw x and y axis labels.
    drawAxisLabels(this.xAxisLabel, this.yAxisLabel, this.layout);
    // Initiate lineheight variable to the correct % of canvas height
    var lineHeight =
      (this.layout.bottomMargin - this.layout.topMargin) /
      (this.data.getColumnCount() - 1);

    // Draw all y-axis labels.
    drawXAxisTickLabelsFlip(
      0,
      this.maxWidth,
      this.layout,
      this.mapValuesToWidth.bind(this),
      0
    );

    // Loop over every row in the data.
    for (var i = 1; i < this.data.getColumnCount(); i++) {
      // Set diff to 0 for each column
      diff = 0;
      // Loop again for every row for the stack
      for (var j = 0; j < this.data.getRowCount(); j++) {
        // Calculate the Y position
        var lineY = lineHeight * (i - 1) + this.layout.topMargin;

        // Create an object that stores data from the current row.
        var columnValue = {
          // Add each row's data to the columnValue variable
          name: this.data.columns[i],
          value: this.data.getNum(j, i),
        };
        // Draw bar based on stacking row count number of times per column.
        fill(colorTheme[j % colorTheme.length]);
        let x = this.layout.leftMargin + diff;
        let y = lineY;
        // set w based on value
        let w =
          (this.layout.rightMargin - this.layout.leftMargin) *
          (columnValue.value / this.maxWidth);
        let h = lineHeight;
        stroke(0, 0, 0);
        strokeWeight(0.5);
        rect(x, y, w, h);
        strokeWeight(0);
        fill("#FFFFFF");
        text(columnValue.value, x + w / 2, y + lineHeight / 2);
        // add the w value to current differnece
        diff += w;
        // Draw a legend
        if (i < 2) {
          this.makeLegendItem(
            this.data.getString(j, 0),
            j,
            colorTheme[j % colorTheme.length]
          );
        }
      }

      // Draw the columnValue name on the left margin.
      fill(0);
      noStroke();
      textAlign("center", "bottom");
      textSize(8);
      text(
        columnValue.name,
        this.layout.leftMargin - 20,
        this.layout.topMargin + lineY
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

  // Draw legend
  this.makeLegendItem = function (label, i, colour) {
    var x = this.layout.leftMargin + i * 100;
    var y = this.layout.bottomMargin + 30;
    // Legend box dimensions
    var boxWidth = 20;
    var boxHeight = 20;

    fill(colour);
    rect(x, y, boxWidth, boxHeight);

    fill("black");
    noStroke();
    textAlign("left", "center");
    textSize(8);
    text(label, x + boxWidth + 10, y + boxWidth / 2);
    textSize(14);
  };
}
