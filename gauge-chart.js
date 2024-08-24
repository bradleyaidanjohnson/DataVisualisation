function GaugeChart(x, y, diameter) {
  this.x = x;
  this.y = y;
  this.diameter = diameter;
  this.labelSpace = 30;
  this.metTarget = false;
  this.extra = 20;

  this.get_radians = function (data) {
    var total = data.max - data.min;
    console.log(total);
    if (data.current < data.target) {
      console.log("target not reached");
    } else {
      console.log("target reached");
    }
    this.get_radians_value = function (value, max) {
      return (Math.min((value / max) * 360, 360) * TWO_PI) / 2 / 180;
    };
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        // Apply the function to the value and update the dictionary
        data[key] = this.get_radians_value(data[key] - data.min, total) / 2;
      }
    }
    // console.log(data);
    return data;
  };

  this.draw = function (data, labels, colours, title) {
    // Deep copy citation needed
    var dataCopy = JSON.parse(JSON.stringify(data));
    console.log(dataCopy);
    // https://p5js.org/examples/form-pie-chart.html

    var anglesDict = this.get_radians(data);
    if (anglesDict.current < anglesDict.target) {
      angles = [
        anglesDict.min,
        anglesDict.current,
        anglesDict.target,
        anglesDict.max,
      ];
      this.metTarget = false;
    } else {
      angles = [
        anglesDict.min,
        anglesDict.target,
        anglesDict.current,
        anglesDict.max,
      ];
      this.metTarget = true;
    }
    // console.log(angles);
    var firstAngle = 180 * (TWO_PI / 2 / 180);
    var lastAngle = firstAngle;

    if (this.metTarget) {
      let temp = labels[1];
      labels[1] = labels[2];
      labels[2] = temp;
    }

    for (var i = 0; i < angles.length; i++) {
      var currColour = [0, 211, 0];
      if (this.metTarget && i == 1) {
        // currColour = [144, 238, 144];
        currColour = [0, 200, 0];
      } else if (this.metTarget && i == 2) {
        // currColour = [0, 200, 0, 200];
        currColour = [0, 200, 255];
      } else if (!this.metTarget && i == 1) {
        currColour = [
          255,
          Math.round((anglesDict.current / anglesDict.target) * 255),
          0,
        ];
      } else if (!this.metTarget && i == 2) {
        currColour = [211, 211, 211];
      } else {
        currColour = [211, 211, 211, 100];
      }

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

      if (labels) {
        if (labels[i] != "min") {
          this.makeLegendItem(labels[i], i, currColour);
        }
      }
      if (angles[i] + firstAngle >= TWO_PI) {
        lastAngle = angles[i] + firstAngle - TWO_PI;
      } else {
        lastAngle = angles[i] + firstAngle;
      }
    }

    if (title) {
      noStroke();
      textAlign("center", "center");
      textSize(24);
      text(title, this.x, this.y - this.diameter * 0.65);
    }

    fill("#FFFFFF");
    stroke(0);
    circle(this.x, this.y, this.diameter / 2);

    dataLabelCoords = {};
    for (let key in anglesDict) {
      // coordinate location citation needed
      tempArray = [
        this.x +
          (this.diameter / 2 + this.extra) *
            Math.cos(anglesDict[key] + TWO_PI / 2),
        this.y +
          (this.diameter / 2 + this.extra) *
            Math.sin(anglesDict[key] + TWO_PI / 2),
      ];
      dataLabelCoords[key] = tempArray;
    }

    console.log(dataLabelCoords);

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

    for (let key in dataLabelCoords) {
      text(dataCopy[key], dataLabelCoords[key][0], dataLabelCoords[key][1]);
    }
  };

  this.makeLegendItem = function (label, i, colour) {
    var x = this.x + 50 + this.diameter / 2;
    var y = this.y + this.labelSpace * i - this.diameter / 3;
    var boxWidth = this.labelSpace / 2;
    var boxHeight = this.labelSpace / 2;

    fill(...colour);
    rect(x, y, boxWidth, boxHeight);

    fill("black");
    noStroke();
    textAlign("left", "center");
    textSize(12);
    text(label, x + boxWidth + 10, y + boxWidth / 2);
  };
}
