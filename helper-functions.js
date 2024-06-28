// --------------------------------------------------------------------
// Data processing helper functions.
// --------------------------------------------------------------------
function sum(data) {
  var total = 0;

  // Ensure that data contains numbers and not strings.
  data = stringsToNumbers(data);

  for (let i = 0; i < data.length; i++) {
    total = total + data[i];
  }

  return total;
}

function mean(data) {
  var total = sum(data);

  return total / data.length;
}

function sliceRowNumbers(row, start = 0, end) {
  var rowData = [];

  if (!end) {
    // Parse all values until the end of the row.
    end = row.arr.length;
  }

  for (i = start; i < end; i++) {
    rowData.push(row.getNum(i));
  }

  return rowData;
}

function stringsToNumbers(array) {
  return array.map(Number);
}

// --------------------------------------------------------------------
// Plotting helper functions
// --------------------------------------------------------------------

function drawAxis(layout, colour = 0) {
  stroke(color(colour));

  // x-axis
  line(
    layout.leftMargin,
    layout.bottomMargin,
    layout.rightMargin,
    layout.bottomMargin
  );

  // y-axis
  line(
    layout.leftMargin,
    layout.topMargin,
    layout.leftMargin,
    layout.bottomMargin
  );
}

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

function drawAxisLabels(xLabel, yLabel, layout) {
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
  text(yLabel, 0, 0);
  pop();
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

function drawYAxisTickLabels(min, max, layout, mapFunction, decimalPlaces) {
  // Map function must be passed with .bind(this).
  var range = max - min;
  var yTickStep = range / layout.numYTickLabels;

  fill(0);
  noStroke();
  textAlign("right", "center");

  // Draw all axis tick labels and grid lines.
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

function drawXAxisTickLabel(value, layout, mapFunction) {
  // Map function must be passed with .bind(this).
  var x = mapFunction(value);

  fill(0);
  noStroke();
  textAlign("center", "center");

  // Add tick label.
  // text(value, x, layout.bottomMargin + layout.marginSize / 2);

  if (layout.grid) {
    // Add grid line.
    stroke(220);
    line(x, layout.topMargin, x, layout.bottomMargin);
  }
}
