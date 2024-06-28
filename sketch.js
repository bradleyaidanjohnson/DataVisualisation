// Global variable to store the gallery object. The gallery object is
// a container for all the visualisations.
var gallery;
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

function setup() {
  // Create a canvas to fill the content div from index.html.
  var c = createCanvas(1024, 576);
  c.parent("app");

  // Create a new gallery object.
  gallery = new Gallery();

  // Add the visualisation objects here.
  gallery.addVisual(new TechDiversityRace());
  gallery.addVisual(new TechDiversityGender());
  gallery.addVisual(new PayGapByJob2017());
  gallery.addVisual(new PayGapTimeSeries());
  gallery.addVisual(new ClimateChange());
  gallery.addVisual(new ColumnChart());
  gallery.addVisual(new BarChart());
  gallery.addVisual(new ComboChart());
}

function draw() {
  background(255);
  if (gallery.selectedVisual != null) {
    gallery.selectedVisual.draw();
  }
}
