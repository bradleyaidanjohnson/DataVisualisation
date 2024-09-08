function GaugeChart(x, y, diameter) {
  // Constructor
  this.x = x;
  this.y = y;
  this.diameter = diameter;
  this.labelSpace = 30;
  this.metTarget = false;
  this.extra = 20;

  this.get_radians = function (data) {
    // Total is difference between max and min
    var total = data.max - data.min;

    // Get radians function for later
    this.get_radians_value = function (value, max) {
      // Return the radian or 360 if its over
      return (Math.min((value / max) * 360, 360) * TWO_PI) / 2 / 180;
    };
    // Loop the data
    for (let key in data) {
      // If the key is found
      if (data.hasOwnProperty(key)) {
        // Apply the function to the value and update the dictionary
        data[key] = this.get_radians_value(data[key] - data.min, total) / 2;
      }
    }
    return data;
  };

  this.draw = function (data, labels, title) {
    // https://builtin.com/software-engineering-perspectives/json-stringify#:~:text=parse%20around%20JSON.,or%20objects%20will%20be%20copied.&text=If%20you%20are%20sure%20your,and%20stringify%20to%20deep%20copy.
    var dataCopy = JSON.parse(JSON.stringify(data));
    // https://p5js.org/examples/form-pie-chart.html

    // Create a dict of angles in radians for the datas
    var anglesDict = this.get_radians(data);
    //Logic for an unmet target
    if (anglesDict.current < anglesDict.target) {
      // Order current before target
      angles = [
        anglesDict.min,
        anglesDict.current,
        anglesDict.target,
        anglesDict.max,
      ];
      this.metTarget = false;
      //Logic if target is met
    } else {
      // Order target before current
      angles = [
        anglesDict.min,
        anglesDict.target,
        anglesDict.current,
        anglesDict.max,
      ];
      this.metTarget = true;
    }
    // Initialise the first angle to be the start pos, and last angle the same for now
    var firstAngle = 180 * (TWO_PI / 2 / 180);
    var lastAngle = firstAngle;

    // If target is met, swap labels for legend
    if (this.metTarget) {
      let temp = labels[1];
      labels[1] = labels[2];
      labels[2] = temp;
    }
    // Loop through available angles
    for (var i = 0; i < angles.length; i++) {
      // Set a base colour
      var currColour = [0, 211, 0];
      // If target is met and now drawing the target portion
      if (this.metTarget && i == 1) {
        currColour = [0, 200, 0];
        // If target is met and now drawing the current portion
      } else if (this.metTarget && i == 2) {
        currColour = [0, 200, 255];

        // If target is not met and now drawing the current portion
      } else if (!this.metTarget && i == 1) {
        // Dynamically change colour from red to yellow to show how far to go
        currColour = [
          255,
          Math.round((anglesDict.current / anglesDict.target) * 255),
          0,
        ];
        // If target is not met and now drawing the gap to target
      } else if (!this.metTarget && i == 2) {
        currColour = [211, 211, 211];
        // From end to the max colour
      } else {
        currColour = [211, 211, 211, 100];
      }
      // Draw segment
      fill(...currColour);
      stroke(0);
      strokeWeight(0);
      arc(
        this.x,
        this.y,
        this.diameter,
        this.diameter,
        lastAngle,
        angles[i] + firstAngle + 0.001
      ); // Hack for 0!
      // If labels exist
      if (labels) {
        // If the label isnt min
        if (labels[i] != "min") {
          // Make a legend item to represent the segment
          this.makeLegendItem(labels[i], i, currColour);
        }
      }
      // Update the lastangle position to start the new arc from this point
      if (angles[i] + firstAngle >= TWO_PI) {
        lastAngle = angles[i] + firstAngle - TWO_PI;
      } else {
        lastAngle = angles[i] + firstAngle;
      }
    }
    // Draw title if present
    if (title) {
      noStroke();
      textAlign("center", "center");
      textSize(24);
      text(title, this.x, this.y - this.diameter * 0.65);
    }
    // Draw centre circle to make a gauge shape
    fill("#FFFFFF");
    stroke(0);
    circle(this.x, this.y, this.diameter / 2);

    // Initialise an empty object of data label coordinates
    var dataLabelCoords = {};
    // Loop the angles
    for (let key in anglesDict) {
      // adapted from https://gist.github.com/netgfx/0f25a166fa0354049cd02c8d6c768e50
      tempArray = [
        this.x +
          (this.diameter / 2 + this.extra) *
            Math.cos(anglesDict[key] + TWO_PI / 2),
        this.y +
          (this.diameter / 2 + this.extra) *
            Math.sin(anglesDict[key] + TWO_PI / 2),
      ];
      // Place the coords into the object with the key as the angle
      dataLabelCoords[key] = tempArray;
    }

    // Draw line from centre of gauge to current position for needle
    stroke(255);
    rect(this.x - this.diameter / 2, this.y, diameter, diameter);
    stroke(0);
    strokeWeight(5);
    line(
      this.x,
      this.y,
      dataLabelCoords.current[0],
      dataLabelCoords.current[1]
    );
    strokeWeight(1);

    // Loop through coords to draw data labels in the correct places
    for (let key in dataLabelCoords) {
      text(dataCopy[key], dataLabelCoords[key][0], dataLabelCoords[key][1]);
    }
  };

  // Make legend function
  this.makeLegendItem = function (label, i, colour) {
    var x = this.x + 50 + this.diameter / 2;
    var y = this.y + this.labelSpace * i - this.diameter / 3;
    // Set legend box dimensions
    var boxWidth = this.labelSpace / 2;
    var boxHeight = this.labelSpace / 2;

    fill(...colour);
    rect(x, y, boxWidth, boxHeight);

    fill("black");
    noStroke();
    textAlign("left", "center");
    textSize(12);
    text(label, x + boxWidth + 10, y + boxWidth / 2);
    textSize(16);
  };
}
