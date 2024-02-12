//SpiderIK is done, just not walking yet

class SpiderBody {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.dragging = false;
    this.dragOffset = createVector(0, 0);
  }

  update() {
    if (this.dragging) {
      this.position.x = mouseX + this.dragOffset.x;
      this.position.y = mouseY + this.dragOffset.y;
    }
  }

  mousePressed() {
    let d = dist(mouseX, mouseY, this.position.x, this.position.y);
    if (d < 50) { // Assuming the body has a radius of 50 pixels for clicking
      this.dragging = true;
      this.dragOffset.x = this.position.x - mouseX;
      this.dragOffset.y = this.position.y - mouseY;
    }
  }

  mouseReleased() {
    this.dragging = false;
  }

  draw() {
    push();
    translate(this.position.x, this.position.y);
    fill(100); // Color of the spider body
    ellipse(0, 0, 100, 100); // Drawing the spider body
    pop();
  }
}

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

    update(targetX, targetY, canvasWidth, canvasHeight) {
    this.totalLength = this.segmentLength * (this.numSegments - 1);
    this.angleX = 0;
    this.angleY = 0;
    this.legLength = max(
      dist(targetX, targetY, canvasWidth / 2, canvasHeight / 2),
      2
    );

    let initialRotation = atan2(
      targetY - canvasHeight / 2,
      targetX - canvasWidth / 2
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

let rightLeg, leftLeg,rightLeg1, leftLeg1,rightLeg2, leftLeg2, spiderBody;

function setup() {
  createCanvas(800, 800);
  spiderBody = new SpiderBody(width / 2, height / 2+100);
  rightLeg = new MechanicalLeg(4, 200, true); // Right-facing leg
  leftLeg = new MechanicalLeg(4, 200, false); // Left-facing leg
  rightLeg1 = new MechanicalLeg(4, 170, true); // Right-facing leg
  leftLeg1 = new MechanicalLeg(4, 170, false); // Left-facing leg
   rightLeg2 = new MechanicalLeg(3, 300, true); // Right-facing leg
  leftLeg2 = new MechanicalLeg(3, 300, false); // Left-facing leg
}

function draw() {
  background(255);

  spiderBody.update();
  spiderBody.draw();

  // Define target positions for each leg
  let rightLegTarget = { x: 1000, y: 1000 }; // Example coordinates
  let leftLegTarget = { x: 1000, y: 1000 }; // Example coordinates

  // Draw the right leg
  drawLeg(rightLeg, rightLegTarget.x - spiderBody.position.x, rightLegTarget.y - spiderBody.position.y);

  // Draw the left leg
  drawLeg(leftLeg, leftLegTarget.x - spiderBody.position.x, leftLegTarget.y - spiderBody.position.y);
  
   // Draw the right leg
  drawLeg(rightLeg1, rightLegTarget.x - spiderBody.position.x-100, rightLegTarget.y - spiderBody.position.y);

  // Draw the left leg
  drawLeg(leftLeg1, leftLegTarget.x - spiderBody.position.x-100, leftLegTarget.y - spiderBody.position.y);
  
     // Draw the right leg
  drawLeg(rightLeg2, rightLegTarget.x - spiderBody.position.x+100, rightLegTarget.y - spiderBody.position.y);

  // Draw the left leg
  drawLeg(leftLeg2, leftLegTarget.x - spiderBody.position.x+100, leftLegTarget.y - spiderBody.position.y);
}

function drawLeg(leg, targetX, targetY) {
  push();
  translate(spiderBody.position.x, spiderBody.position.y);
  
  let rotation = leg.update(targetX, targetY, width, height);
  if (rotation) rotate(rotation);
  leg.draw(rotation);

  pop();
}

function mousePressed() {
  spiderBody.mousePressed();
}

function mouseReleased() {
  spiderBody.mouseReleased();
}
