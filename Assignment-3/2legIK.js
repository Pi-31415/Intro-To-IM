//2 Leg facing left and right working
class MechanicalLeg {
  constructor(numSegments, segmentLength, isRightFacing = true) {
    this.numSegments = numSegments;
    this.segmentLength = segmentLength;
    this.isRightFacing = isRightFacing; // New parameter to determine the facing direction
    this.angleX = 0;
    this.angleY = 0;
    this.points = [];
    this.totalLength = this.segmentLength * (this.numSegments - 1);
  }

  update(mouseX, mouseY, canvasWidth, canvasHeight) {
    this.totalLength = this.segmentLength * (this.numSegments - 1);
    this.angleX = 0;
    this.angleY = 0;
    this.legLength = max(
      dist(mouseX, mouseY, canvasWidth / 2, canvasHeight / 2),
      2
    );

    let initialRotation = atan2(
      mouseY - canvasHeight / 2,
      mouseX - canvasWidth / 2
    );
    let rotation = initialRotation;

    while (this.totalLength > this.legLength) {
      this.angleX += 0.01 / this.numSegments;
      this.angleY =
        (PI * (this.numSegments - 2) - (this.numSegments - 2) * this.angleX) /
        2;

      let theta = 0;
      this.points = [];
      this.points[0] = { x: this.segmentLength, y: 0 };

      for (let i = 1; i < this.numSegments; i++) {
        theta += this.angleX;
        this.points.push({
          x: this.points[i - 1].x + this.segmentLength * cos(theta),
          y: this.points[i - 1].y + this.segmentLength * sin(theta),
        });
      }

      this.totalLength = dist(
        this.points[0].x,
        this.points[0].y,
        this.points[this.points.length - 1].x,
        this.points[this.points.length - 1].y
      );
      rotation =
        -atan2(
          this.points[this.points.length - 1].y - this.points[0].y,
          this.points[this.points.length - 1].x - this.points[0].x
        ) + initialRotation;
    }
    rotation = this.isRightFacing ? rotation : PI - rotation;
    return rotation;
  }

  draw(rotation) {
    push();

    // Draw segments
    for (let i = 0; i < this.numSegments - 1; i++) {
      if (i !== 0) translate(this.segmentLength, 0);
      rotate(this.isRightFacing ? this.angleX : -this.angleX); // Invert rotation if left-facing
      line(0, 0, this.segmentLength, 0);
    }


    // Draw a red dot at the end effector
    fill(255, 0, 0); // Set color to red
    noStroke(); // No border for the circle
    circle(this.segmentLength, 0, 10); // Draw red circle at the end

    pop();
  }
}

let rightLeg, leftLeg;

function setup() {
  createCanvas(800, 800);
    rightLeg = new MechanicalLeg(4, 120, true); // Right-facing leg
  leftLeg = new MechanicalLeg(4, 120, false); // Left-facing leg

}
function draw() {
  background(255);

  // Draw the right leg
  drawLeg(rightLeg);

  // Draw the left leg
  drawLeg(leftLeg);
}

function drawLeg(leg) {
  let rotation = leg.update(mouseX, mouseY, width, height);

  translate(width / 2, height / 2);
  if (rotation) rotate(rotation);

  leg.draw(rotation);

  rotate(-rotation);
  translate(-width / 2, -height / 2);
}
