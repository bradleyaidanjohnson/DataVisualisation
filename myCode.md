# My Code

## Bar Chart

```
this.draw = function () {
    if (!this.loaded) {
      console.log("Data not yet loaded");
      return;
    }
    //START
    this.xAxisLabel = this.data.columns[1];
    this.yAxisLabel = this.data.columns[0];
    var maxWidth = 0;
    //END

    for (var i = 0; i < this.data.getRowCount(); i++) {
      if (this.data.getNum(i, 1) > maxWidth) {
        maxWidth = this.data.getNum(i, 1);
      }
    }

    // Draw the title above the plot.
    this.drawTitle();

    // Draw x and y axis.
    drawAxis(this.layout);

    // Draw x and y axis labels.
    drawAxisLabels(this.xAxisLabel, this.yAxisLabel, this.layout);

    // Draw labels at the top of the plot.
    this.drawCategoryLabels();

    var lineHeight =
      (this.layout.bottomMargin - this.layout.topMargin) /
      this.data.getRowCount();

    // Draw all y-axis labels.
    drawXAxisTickLabelsFlip(
      0,
      maxWidth,
      this.layout,
      this.mapValuesToWidth.bind(this),
      0
    );

    // Loop over every row in the data.
    for (var i = 0; i < this.data.getRowCount(); i++) {
      // Calculate the x position for each company.
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
      //START
      fill(colorTheme[i % colorTheme.length]);
      rect(
        this.layout.leftMargin,
        lineX,
        (this.layout.rightMargin - this.layout.leftMargin) *
          (columnValue.value / maxWidth),
        lineHeight
      );
      //END
    }
  };
  //START
  this.mapValuesToWidth = function (value) {
    var maxWidth = 0;

    for (var i = 0; i < this.data.getRowCount(); i++) {
      if (this.data.getNum(i, 1) > maxWidth) {
        maxWidth = this.data.getNum(i, 1);
      }
    }

    return map(
      value,
      0,
      maxWidth,
      this.layout.leftMargin, // draw bottom to top from margin
      this.layout.rightMargin
    );
  };
  //END
```

## Column Chart

```
this.draw = function () {
    if (!this.loaded) {
      console.log("Data not yet loaded");
      return;
    }

    this.xAxisLabel = this.data.columns[0];
    this.yAxisLabel = this.data.columns[1];
    // START
    var maxHeight = 0;

    for (var i = 0; i < this.data.getRowCount(); i++) {
      if (this.data.getNum(i, 1) > maxHeight) {
        maxHeight = this.data.getNum(i, 1);
      }
    }
    // END

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
      this.data.getRowCount();

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
      textAlign("center", "bottom");
      text(
        columnValue.name,
        lineX + lineWidth * 0.5,
        this.layout.bottomMargin + 20
      );

      // Draw female employees rectangle.
      // START
      fill(colorTheme[i % colorTheme.length]);
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
    // END
  };
  // START
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
  // END
```

## Combo Chart

```
// Draw function
  this.draw = function () {
    if (!this.loaded) {
      console.log("Data not yet loaded");
      return;
    }
    //START
    this.xAxisLabel = this.data.columns[0];
    this.yAxisLabel1 = this.data.columns[1];
    this.yAxisLabel2 = this.data.columns[2];

    var maxHeight = 0;
    var maxHeight2 = 0;

    for (var i = 0; i < this.data.getRowCount(); i++) {
      if (this.data.getNum(i, 1) > maxHeight) {
        maxHeight = this.data.getNum(i, 1);
      }
      if (this.data.getNum(i, 2) > maxHeight2) {
        maxHeight2 = this.data.getNum(i, 2);
      }
    }

    // END
    // Draw the title above the plot.
    this.drawTitle();

    // Draw all y-axis labels.
    drawComboYAxisTickLabels(
      // START
      0,
      maxHeight,
      maxHeight2,
      this.layout,
      this.mapValuesToHeight.bind(this),
      this.mapValuesToLineHeight.bind(this),
      0,
      1
      // END
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

    // Draw Female/Male labels at the top of the plot.
    this.drawCategoryLabels();

    var lineWidth =
      (this.layout.rightMargin - this.layout.leftMargin) /
      this.data.getRowCount();

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
      textAlign("center", "bottom");
      text(
        columnValue.name,
        lineX + lineWidth * 0.5,
        this.layout.bottomMargin + 20
      );

      // Draw female employees rectangle.
      //START
      fill(colorTheme[i % colorTheme.length]);
      rect(
        lineX,
        (1 - columnValue.value / maxHeight) *
          (this.layout.bottomMargin - this.layout.topMargin) +
          this.layout.topMargin,
        lineWidth,
        (this.layout.bottomMargin - this.layout.topMargin) *
          (columnValue.value / maxHeight)
      );
      // END
    }

    // Plot all pay gaps between startYear and endYear using the width
    // of the canvas minus margins.
    var previous;
    var numPoints = this.data.getRowCount();

    // Loop over all rows and draw a line from the previous value to
    // the current.
    for (var i = 0; i < numPoints; i++) {
      // Create an object to store data for the current year.
      var current = {
        // Convert strings to numbers.
        year: this.data.getNum(i, 0),
        returnsPerc: this.data.getNum(i, 2),
      };

      if (previous != null) {
        // Draw line segment connecting previous year to current
        // year pay gap.
        stroke(0);
        line(
          this.mapYearToWidth(previous.year),
          this.mapValuesToLineHeight(previous.returnsPerc),
          this.mapYearToWidth(current.year),
          this.mapValuesToLineHeight(current.returnsPerc)
        );
        // The number of x-axis labels to skip so that only
        // numXTickLabels are drawn.
        var xLabelSkip = ceil(numPoints / this.layout.numXTickLabels);

        // Draw the tick label marking the start of the previous year.
        // if (i % xLabelSkip == 0) {
        //   drawXAxisTickLabelsFlip(
        //     0,
        //     1,
        //     this.layout,
        //     this.mapYearToWidth.bind(this),
        //     2
        //   );
        // }
      }

      // Assign current year to previous year so that it is available
      // during the next iteration of this loop to give us the start
      // position of the next line segment.
      previous = current;
    }
  };
  // START
  this.mapPercentToHeight = function (percent) {
    // console.log(percent);
    return map(percent, 0, 100, 0, this.layout.plotHeight());
  };
  // END

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
  // START
this.mapValuesToHeight = function (value) {
    var maxHeight = this.data.getNum(0, 1);
    var minHeight = this.data.getNum(0, 1);

    for (var i = 0; i < this.data.getRowCount(); i++) {
      if (this.data.getNum(i, 1) > maxHeight) {
        maxHeight = this.data.getNum(i, 1);
      }
      if (this.data.getNum(i, 1) < minHeight) {
        minHeight = this.data.getNum(i, 1);
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

  this.mapValuesToLineHeight = function (value) {
    var maxHeight = this.data.getNum(0, 2);
    var minHeight = this.data.getNum(0, 2);

    for (var i = 0; i < this.data.getRowCount(); i++) {
      if (this.data.getNum(i, 2) > maxHeight) {
        maxHeight = this.data.getNum(i, 2);
      }
      if (this.data.getNum(i, 1) < minHeight) {
        minHeight = this.data.getNum(i, 1);
      }
    }
  }
  // END
```

## Doughnut Chart

```

```

## Funnel Chart

```
// Draw function
  this.draw = function () {
    if (!this.loaded) {
      console.log("Data not yet loaded");
      return;
    }

    this.xAxisLabel = this.data.columns[1];
    this.yAxisLabel = this.data.columns[0];

    // START
    var maxWidth = 0;

    for (var i = 0; i < this.data.getRowCount(); i++) {
      if (this.data.getNum(i, 1) > maxWidth) {
        maxWidth = this.data.getNum(i, 1);
      }
    }
    // END

    // Draw the title above the plot.
    this.drawTitle();

    // Draw x and y axis.
    // drawAxis(this.layout);

    // Draw x and y axis labels.
    // drawAxisLabels(this.xAxisLabel, this.yAxisLabel, this.layout);

    // Draw labels at the top of the plot.
    this.drawCategoryLabels();

    var lineHeight =
      (this.layout.bottomMargin - this.layout.topMargin) /
      this.data.getRowCount();

    // Draw all y-axis labels.
    drawXAxisTickLabelsFlip(
      0,
      maxWidth,
      this.layout,
      this.mapValuesToWidth.bind(this),
      0
    );

    // Loop over every row in the data.
    for (var i = 0; i < this.data.getRowCount(); i++) {
      // Calculate the x position for each company.
      var lineX = lineHeight * i + this.layout.topMargin;

      // Create an object that stores data from the current row.
      var columnValue = {
        // Add each row's data to the columnValue variable
        name: this.data.getString(i, 0),
        value: this.data.getNum(i, 1),
      };
      // START
      // Draw the columnValue name on the left margin.
      fill(0);
      noStroke();
      textAlign("center", "center");
      textSize(14);
      text(
        columnValue.name,
        this.layout.leftMargin - 30,
        lineX + lineHeight / 2
      );
      textSize(14);

      // Draw the value %s name on the right margin.
      fill(0);
      noStroke();
      textAlign("center", "center");
      textSize(14);
      text(
        ((columnValue.value / maxWidth) * 100).toFixed(2).toString() + "%",
        this.layout.rightMargin + 30,
        lineX + lineHeight / 2
      );
      textSize(14);

      // Draw bar.
      fill(colorTheme[i % colorTheme.length]);
      rect(
        ((1 - columnValue.value / maxWidth) *
          (this.layout.rightMargin - this.layout.leftMargin)) /
          2 +
          this.layout.leftMargin,
        lineX,
        (this.layout.rightMargin - this.layout.leftMargin) *
          (columnValue.value / maxWidth),
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
    // END
  };
```

## Sketch

```
// START
var colorTheme = [
  "#01B8AA",
  "#374649",
  "#FD625E",
  "#F2C80F",
  "#5F6B6D",
  "#8AD4EB",
  "#FE9666",
  "#A66999",
];
// END
```

## Helper Functions

```
// START
function drawComboAxis(layout, colour = 0) {
  stroke(color(colour));

  // x-axis
  line(
    layout.leftMargin,
    layout.bottomMargin,
    layout.rightMargin,
    layout.bottomMargin
  );

  // y-axis 1
  line(
    layout.leftMargin,
    layout.topMargin,
    layout.leftMargin,
    layout.bottomMargin
  );

  // y-axis 2
  line(
    layout.rightMargin,
    layout.topMargin,
    layout.rightMargin,
    layout.bottomMargin
  );
}
function drawComboAxisLabels(xLabel, yLabel_1, yLabel_2, layout) {
  fill(0);
  noStroke();
  textAlign("center", "center");

  // Draw x-axis label.
  text(
    xLabel,
    layout.plotWidth() / 2 + layout.leftMargin,
    layout.bottomMargin + layout.marginSize * 1.5
  );

  // Draw y-axis label.
  push();
  translate(
    layout.leftMargin - layout.marginSize * 1.5,
    layout.bottomMargin / 2
  );
  rotate(-PI / 2);
  text(yLabel_1, 0, 0);
  pop();

  // Draw y-axis label.
  push();
  translate(
    layout.rightMargin + layout.marginSize * 1.5,
    layout.bottomMargin / 2
  );
  rotate(-PI / 2);
  text(yLabel_2, 0, 0);
  pop();
}
function drawComboYAxisTickLabels(
  min,
  max,
  max2,
  layout,
  mapFunction,
  mapFunction2,
  decimalPlaces,
  decimalPlaces2
) {
  // Map function must be passed with .bind(this).
  var range = max - min;
  var range2 = max2 - min;
  var yTickStep = range / layout.numYTickLabels;
  var yTickStep2 = range2 / layout.numYTickLabels;

  fill(0);
  noStroke();
  textSize(8);
  textAlign("right", "center");

  // Draw all axis 1 tick labels and grid lines.
  for (i = 0; i <= layout.numYTickLabels; i++) {
    var value = min + i * yTickStep;
    var y = mapFunction(value);

    // Add tick label.
    text(value.toFixed(decimalPlaces), layout.leftMargin - layout.pad, y);

    if (layout.grid) {
      // Add grid line.
      stroke(200);
      line(layout.leftMargin, y, layout.rightMargin, y);
    }
  }
  textAlign("right", "center");

  // Draw all axis 2 tick labels.
  for (i = 0; i <= layout.numYTickLabels; i++) {
    var value = min + i * yTickStep2;
    var y = mapFunction2(value);

    // Add tick label.
    text(value.toFixed(decimalPlaces2), layout.rightMargin + layout.pad * 7, y);
  }
  textSize(14);
}
function drawXAxisTickLabelsFlip(min, max, layout, mapFunction, decimalPlaces) {
  // Map function must be passed with .bind(this).
  var range = max - min;
  var yTickStep = range / layout.numYTickLabels;

  fill(0);
  noStroke();
  textAlign("right", "center");

  // Draw all axis tick labels and grid lines.
  for (i = 0; i <= layout.numYTickLabels; i++) {
    var value = min + i * yTickStep;
    var x = mapFunction(value);

    // Add tick label.
    text(value.toFixed(decimalPlaces), x, layout.bottomMargin + layout.pad * 3);

    if (layout.grid) {
      // Add grid line.
      stroke(200);
      line(x, layout.topMargin, x, layout.bottomMargin);
    }
  }
}
// END
```
