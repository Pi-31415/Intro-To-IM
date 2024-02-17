function setup() {
  // Create the canvas
  createCanvas(windowWidth, windowHeight);
  background(0); // Set background to black

  // Data for the bar graph (adjustable)
  let data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

  // Calculate dynamic dimensions
  let padding = 200; // padding around the graph
  let graphWidth = width - 2 * padding;
  let graphHeight = height - 2 * padding;
  let barWidth = graphWidth / data.length; // Calculate based on data length and graph width

  // Colors (adjustable)
  let colors = []; // Array to hold the bar colors
  for (let i = 0; i < data.length; i++) {
    colors.push(color(255, 105 + i * 10, 0)); // Gradually changing the color
  }

  // Draw the bars
  for (let i = 0; i < data.length; i++) {
    fill(colors[i]);
    noStroke();
    rect(padding + i * barWidth, height - padding - data[i] * barWidth, barWidth - 1, data[i] * barWidth);
  }

  // Draw the axes
  stroke(255);
  strokeWeight(2);
  line(padding, padding-90, padding, height - padding); // Vertical axis
  line(padding, height - padding, width - padding, height - padding); // Horizontal axis

  // Adding labels (text) to the bars - horizontal (X-axis) values
  fill(255); // White color for text
  noStroke();
  textSize(16);
  textAlign(CENTER, CENTER);
  for (let i = 0; i < data.length; i++) {
    text(i+1, padding + i * barWidth + barWidth / 2, height - padding + 20);
  }

  // Adding labels (text) to the bars - vertical (Y-axis) values
  for (let i = 0; i <= 15; i++) {
    text(i, padding - 20, height - padding - i * barWidth + barWidth / 2);
  }

  // Axis labels
  textSize(20);
  // Y-axis label
  push();
  translate(100, height / 2);
  rotate(-HALF_PI);
  text("Number of Bars in this Bar Graph", 0, 0);
  pop();
  // X-axis label
  text("Units of x-axis", width / 2, height - 130);

  // Graph Title
  // Graph Title
    fill(255, 165, 0); // Set fill to orange for the rectangle
    stroke(255, 165, 0); // Set stroke to orange to match the fill
    rectMode(CENTER); // Set rect mode to CENTER for easy positioning
    let titleText = "Pi's some sort of data visualization";
    textSize(24);
    let titleWidth = textWidth(titleText) + 100; // Calculate the width of the rectangle based on text width
    let titleHeight = 35; // Height of the rectangle
    let titleX = width / 2;
    let titleY = padding - 140;
    let borderRadius = 7; // Border radius for the rectangle
    // Draw the rectangle behind the title
    rect(titleX, titleY, titleWidth, titleHeight, borderRadius);

    // Draw the title text
    fill(0); // Set fill to black for the text
    noStroke(); // No stroke for the text
    textStyle(BOLD); // Set the text style to bold
    textAlign(CENTER, BOTTOM);
    // Position the text over the rectangle
    text(titleText, titleX, titleY + titleHeight / 2 - 5);
}

function draw() {
 
}
