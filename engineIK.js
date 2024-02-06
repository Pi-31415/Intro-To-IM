//Based on https://editor.p5js.org/rjgilmour/sketches/RTw0LWXMy

//Refactored (but not into class yet)

// Define initial parameters for the IK system
let numSegments = 4; // Number of leg segments
let legLength = 200; // Initial length of the leg
let segmentLength = 85; // Length of each segment
let angleX = 0; // Angle for IK calculations
let angleY = 0; // Angle for IK calculations
let points = []; // Array to store joint positions
let totalLength = segmentLength * (numSegments - 1); // Total length of the leg when straight

// Preload function for loading assets
function preload() {
  segmentImage = loadImage('spider_leg_segment.png'); // Load image for leg segment visualization
}

// GUI parameters
let params = {
  numSegments: 4,
  segmentLength: 87
}

// Setup function to initialize the canvas and GUI
function setup() {
  createCanvas(800, 800); // Create a canvas of size 800x800
  gui = new dat.GUI(); // Initialize GUI
  gui.add(params, 'numSegments', 3, 20); // Slider for number of segments
  gui.add(params, 'segmentLength', 0, 100); // Slider for segment length
}

// Main draw function
function draw() {
  background(255); // Set background color to white
  
  // Update segment length and number based on GUI input
  segmentLength = params.segmentLength;
  numSegments = round(params.numSegments);
  
  totalLength = segmentLength * (numSegments - 1);
  angleX = 0;
  angleY = 0;
  
  // Calculate the dynamic leg length based on mouse position
  legLength = max(dist(mouseX, mouseY, width / 2, height / 2), 2);  
  
  // Calculate initial rotation based on mouse position
  let initialRotation = atan2(mouseY - height / 2, mouseX - width / 2);
  let rotation = initialRotation;
  
  // Inverse Kinematics calculations
  while (totalLength > legLength) {
    angleX += 0.01 / numSegments;
    angleY = (PI * (numSegments - 2) - (numSegments - 2) * angleX) / 2;
    
    let theta = 0;
    points = [];
    points[0] = { x: segmentLength, y: 0 };
    
    // Calculate joint positions
    for (let i = 1; i < numSegments; i++) {
      theta += angleX;
      points.push({
        x: points[i - 1].x + segmentLength * cos(theta),
        y: points[i - 1].y + segmentLength * sin(theta)
      });
    }

    // Update total length and rotation based on new joint positions
    totalLength = dist(points[0].x, points[0].y, points[points.length - 1].x, points[points.length - 1].y);
    rotation = -atan2(points[points.length - 1].y - points[0].y, points[points.length - 1].x - points[0].x) + initialRotation;
  }
  
  // Drawing transformations
  translate(width / 2, height / 2);
  if (rotation) rotate(rotation);
  
  // Draw each segment
  push();
  for (let i = 0; i < numSegments - 1; i++) {
    if (i !== 0) translate(segmentLength, 0);
    rotate(angleX);
    line(0, 0, segmentLength, 0);
    push();
    scale(0.9, 2 / (i + 1));
    image(segmentImage, 0, 0);
    pop();
  }
  pop();
  
  // Reset transformations
  push();
  rotate(-rotation);
  translate(-width / 2, -height / 2);
  pop();
  
  // Redraw joint positions for visualization
  theta = 0;
  points = [];
  points[0] = { x: 0, y: 0 };
  for (let i = 1; i < numSegments; i++) {
    theta += angleX;
    points.push({
      x: points[i - 1].x + segmentLength * cos(theta),
      y: points[i - 1].y + segmentLength * sin(theta)
    });
  }
  
  // Draw circles at each joint
  for (let i = 0; i < points.length; i++) {
    circle(points[i].x, points[i].y, 5);
  }
}
