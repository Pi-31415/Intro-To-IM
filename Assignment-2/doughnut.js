let theta_spacing = 0.07;
let phi_spacing = 0.04;
let R1 = 1;
let R2 = 2;
let K2 = 5;
let screen_width = 400;
let screen_height = 400;
let K1 = screen_width * K2 * 3 / (8 * (R1 + R2));
let A = 1.0;
let B = 1.0;


function setup() {
  createCanvas(500, 500); // Scale up for visibility
  frameRate(20);
}

function draw() {
  background(0);
  renderFrame(A, B);
  A += 0.08;
  B += 0.03;
}

function renderFrame(A, B) {
  let cosA = cos(A);
  let sinA = sin(A);
  let cosB = cos(B);
  let sinB = sin(B);

  let theta = 0;
  while (theta < 2 * PI) {
    theta += theta_spacing;
    let costheta = cos(theta);
    let sintheta = sin(theta);

    let phi = 0;
    while (phi < 2 * PI) {
      phi += phi_spacing;
      let cosphi = cos(phi);
      let sinphi = sin(phi);

      let circlex = R2 + R1 * costheta;
      let circley = R1 * sintheta;

      let x = circlex * (cosB * cosphi + sinA * sinB * sinphi) - circley * cosA * sinB;
      let y = circlex * (sinB * cosphi - sinA * cosB * sinphi) + circley * cosA * cosB;
      let z = K2 + cosA * circlex * sinphi + circley * sinA;
      let ooz = 1 / z;

      let xp = width / 2 + K1 * ooz * x;
      let yp = height / 2 - K1 * ooz * y;

      let L = cosphi * costheta * sinB - cosA * costheta * sinphi - sinA * sintheta + cosB * (cosA * sintheta - costheta * sinA * sinphi);
      if (L > 0) {
        stroke(255 * L);
        point(xp, yp);
      }
    }
  }
}
