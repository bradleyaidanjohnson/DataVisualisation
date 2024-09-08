function ClusterBarChart() {
  // Name for the visualisation to appear in the menu bar.
  this.name = "Cluster Bar Chart";

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = "cluster-bar-chart";

  // Title to display above the plot.
  this.title = "Cluster Bar Chart Demo";

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
    "Simple Chart": "./data/new-data/bcsc_base.csv",
    "Performance by Department":
      "./data/new-data/bcsc_performance_by_department.csv",
    "Department by Performance":
      "./data/new-data/bcsc_department._by_performance.csv",
    "Factory by Production": "./data/new-data/bcsc_production_by_factory.csv",
    "Production by Factory": "./data/new-data/bcsc_factory_by_production.csv",
    "Costs and Expenses": "./data/new-data/bcsc_revenue_and_expenses.csv",
    "Expenses and Costs": "./data/new-data/bcsc_expenses_and_costs.csv",
    "Revenue by Region": "./data/new-data/bcsc_revenue_by_region.csv",
    "Region by Revenue": "./data/new-data/bcsc_region_by_revenue.csv",
    "Profit and Sales by Product":
      "./data/new-data/bcsc_sales_and_profit_by_product.csv",
    "Product by Profit and Sales":
      "./data/new-data/bcsc_product_by_sales_and_profit.csv",
    "Sales by Category": "./data/new-data/bcsc_sales_by_category.csv",
    "Category by Sales": "./data/new-data/bcsc_category_by_sales.csv",
    "Sales by Department": "./data/new-data/bcsc_sales_by_department.csv",
    "Department by Sales": "./data/new-data/bcsc_department_by_sales.csv",
    "Sales by Region": "./data/new-data/bcsc_sales_by_region.csv",
    "Region by Sales": "./data/new-data/bcsc_region_by_sales.csv",
  };

  this.currentSelection = "Simple Chart";

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
    this.xAxisLabel = "";
    this.yAxisLabel = "";
    this.maxWidth = 0;
    // Set max width to the highest value
    for (var i = 1; i < this.data.getColumnCount(); i++) {
      for (var j = 0; j < this.data.getRowCount(); j++) {
        if (this.data.getNum(j, i) > this.maxWidth) {
          this.maxWidth = this.data.getNum(j, i);
        }
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
      // Loop again for every row for the cluster
      for (var j = 0; j < this.data.getRowCount(); j++) {
        // Calculate the Y position
        var lineY = lineHeight * (i - 1) + this.layout.topMargin;

        // Create an object that stores data from the current row.
        var columnValue = {
          // Add each row's data to the columnValue variable
          name: this.data.columns[i],
          value: this.data.getNum(j, i),
        };

        // Draw bar based on clustering row count number of times per column.
        fill(colorTheme[j % colorTheme.length]);
        let x = this.layout.leftMargin;
        let y = lineY + (lineHeight / this.data.getRowCount()) * j;
        let w =
          (this.layout.rightMargin - this.layout.leftMargin) *
          (columnValue.value / this.maxWidth);
        let h = lineHeight / this.data.getRowCount();
        stroke(0, 0, 0);
        strokeWeight(0.5);
        rect(x, y, w, h);
        strokeWeight(0);
        fill("#FFFFFF");
        textSize(11);
        textAlign("center", "center");
        text(columnValue.value, x + w / 2, y + h / 2);
        textSize(16);
        // Draw legend
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
      textAlign("left", "bottom");
      textSize(11);
      text(
        columnValue.name,
        this.layout.leftMargin - 60,
        this.layout.topMargin + lineY
      );
      textSize(16);
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
    textSize(12);
    text(label, x + boxWidth + 10, y + boxWidth / 2);
    textSize(16);
  };
}
