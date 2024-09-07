function GaugeChartDemo() {
  // Name for the visualisation to appear in the menu bar.
  this.name = "Gauge Chart";

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = "gauge-chart-demo";

  // Property to represent whether data has been loaded.
  this.loaded = false;

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function () {
    var self = this;
    this.data = loadTable(
      "./data/new-data/gauge_sample.csv",
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
    this.select.position(350, 100);

    // Fill the options with all company names.
    for (var i = 1; i < this.data.getColumnCount(); i++) {
      this.select.option(this.data.columns[i]);
    }
  };

  this.destroy = function () {
    this.select.remove();
  };

  // Create a new pie chart object.
  this.gauge = new GaugeChart(width / 2, height / 2, width * 0.4);

  this.draw = function () {
    if (!this.loaded) {
      console.log("Data not yet loaded");
      return;
    }

    // Get the value we're interested in from the
    // select item.
    var currSelected = this.select.value();

    // Get the column of raw data for companyName.
    var col = this.data.getColumn(currSelected);

    // Convert all data strings to numbers.
    col = stringsToNumbers(col);

    colDict = {
      min: col[0],
      current: col[1],
      target: col[2],
      max: col[3],
    };

    // Copy the row labels from the table (the first item of each row).
    var labels = this.data.getColumn(0);

    // Make a title.
    var title = "Sales Target " + currSelected;

    // Draw the pie chart!
    this.gauge.draw(colDict, labels, title);
  };
}
