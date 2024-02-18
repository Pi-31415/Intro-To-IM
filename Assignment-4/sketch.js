// ____        _              _     
// |  _ \  __ _| |_ __ ___   _(_)____
// | | | |/ _` | __/ _` \ \ / / |_  /
// | |_| | (_| | || (_| |\ V /| |/ / 
// |____/ \__,_|\__\__,_| \_/ |_/___|
// "some sort of data visualization" with "things that are not necessary" removed
// Pi Ko (pk2269@nyu.edu)
function setup() {
  // Create the canvas
  createCanvas(windowWidth, windowHeight);
  background(0); 
  // Data for the bar graph 
  let data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  // Calculate dynamic dimensions
  let padding = 200; 
  let graphWidth = width - 2 * padding;
  let barWidth = graphWidth / data.length; 
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
  // Adding labels 
  fill(255);
  noStroke();
  textSize(16);
  textAlign(CENTER, CENTER);
  for (let i = 0; i < data.length; i++) {
    text(i+1, padding + i * barWidth + barWidth / 2, height - padding + 20);
  }
  for (let i = 0; i <= 15; i++) {
    text(i, padding - 20, height - padding - i * barWidth + barWidth / 2);
  }
  textSize(20);
  push();
  translate(100, height / 2);
  rotate(-HALF_PI);
  text("Number of Bars in this Bar Graph", 0, 0);
  pop();
  text("Units of x-axis", width / 2, height - 130);
  // Graph Title
  fill(255, 165, 0); // Set fill to orange for the rectangle
  stroke(255, 165, 0); // Set stroke to orange to match the fill
  rectMode(CENTER); 
  let titleText = "Pi's some sort of data visualization";
  textSize(24);
  let titleWidth = textWidth(titleText) + 100; 
  let titleHeight = 35;
  let titleX = width / 2;
  let titleY = padding - 140;
  let borderRadius = 7; 
  rect(titleX, titleY, titleWidth, titleHeight, borderRadius);
  // Draw the title text
  fill(0);
  noStroke(); 
  textStyle(BOLD);
  textAlign(CENTER, BOTTOM);
  // Position the text over the rectangle
  text(titleText, titleX, titleY + titleHeight / 2 - 5);
}

function draw() {
}
