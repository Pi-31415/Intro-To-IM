// ░█▀█░▀█▀░░░█▀▄░█▀█░█░█░█▀▀░█░█░█▀█░█░█░▀█▀
// ░█▀▀░░█░░░░█░█░█░█░█░█░█░█░█▀█░█░█░█░█░░█░
// ░▀░░░▀▀▀░░░▀▀░░▀▀▀░▀▀▀░▀▀▀░▀░▀░▀░▀░▀▀▀░░▀░

// Just copy the whole thing and paste in sketch.js on P5.js online editor, then enjoy the magic.

// Define global variables
// theta_spacing: Controls the spacing between points along the theta angle in the polar coordinates (affects resolution of the shape)
let theta_spacing = 0.3;

// phi_spacing: Controls the spacing between points along the phi angle in the polar coordinates (affects resolution of the shape)
let phi_spacing = 0.09;

// R1: The radius of the circle that forms the 'tube' of the torus (donut)
let R1 = 1;

// R2: The radius from the center of the tube to the center of the torus
let R2 = 2;

// K2: A constant used for 3D to 2D projection, affecting the depth effect
let K2 = 5;

// screen_width: The width of the screen or canvas
let screen_width = 600;

// screen_height: The height of the screen or canvas
let screen_height = 600;

// K1: A scaling factor for the 3D to 2D projection, calculated based on screen dimensions and torus radii
let K1 = screen_width * K2 * 3 / (8 * (R1 + R2));

// A: Angle used for rotating the torus along one axis (rotation over time)
let A = 1.0;

// B: Angle used for rotating the torus along another axis (rotation over time)
let B = 1.0;


// Setup function to initialize the canvas
function setup() {
  createCanvas(650, 650); // Create a canvas of size 650x650
  frameRate(20); // Set the frame rate to 20 frames per second
}

// Draw function, called repeatedly to render frames
function draw() {
  background(0); // Set the background to black
  renderFrame(A, B); // Call the function to render each frame
  A += 0.005; // Increment A for rotation
  B += 0.03;  // Increment B for rotation
}

// Function to render each frame
function renderFrame(A, B) {
  // Calculate cos and sin values for rotation
  let cosA = cos(A);
  let sinA = sin(A);
  let cosB = cos(B);
  let sinB = sin(B);

  textSize(20); // Set the size of the Pi characters
  textAlign(CENTER, CENTER); // Align the text to the center

  // Calculate color oscillation for dynamic color change
  let colorOscillation = (sin(millis() / 500) + 1) / 2;
  let greenValue = colorOscillation * 255;
  let blueValue = (1 - colorOscillation) * 255;

  // Use a for loop for theta
  for (let theta = 0; theta < 2 * PI; theta += theta_spacing) {
    let costheta = cos(theta);
    let sintheta = sin(theta);

    // Use a while loop for phi
    let phi = 0;
    while (phi < 2 * PI) {
      phi += phi_spacing;
      let cosphi = cos(phi);
      let sinphi = sin(phi);

      // Calculate 3D coordinates on the torus
      let circlex = R2 + R1 * costheta;
      let circley = R1 * sintheta;

      // Project the 3D coordinates to 2D
      let x = circlex * (cosB * cosphi + sinA * sinB * sinphi) - circley * cosA * sinB;
      let y = circlex * (sinB * cosphi - sinA * cosB * sinphi) + circley * cosA * cosB;
      let z = K2 + cosA * circlex * sinphi + circley * sinA;
      let ooz = 1 / z;

      // Calculate projected 2D coordinates
      let xp = width / 2 + K1 * ooz * x;
      let yp = height / 2 - K1 * ooz * y;

      // Calculate brightness based on the normal to the surface
      let L = cosphi * costheta * sinB - cosA * costheta * sinphi - sinA * sintheta + cosB * (cosA * sintheta - costheta * sinA * sinphi);
      if (L > 0) {
        fill(0, greenValue * L, blueValue * L); // Set color with oscillating G and B values
        noStroke();
        text('π', xp, yp); // Draw the Pi character at the calculated position
      }
    }
  }
}
