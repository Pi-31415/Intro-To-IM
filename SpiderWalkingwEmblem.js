//Spider Walking with gears and pi emblem
//Spider is walking and draggable
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
    if (d < 50) {
      // Assuming the body has a radius of 50 pixels for clicking
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

    // Draw spider body
    fill(0);
    ellipse(0, -20, 180, 80);

    // Draw gears on the spider body
    this.drawGears();
    drawPiEmblem(-40, -60, 0.4);
    pop();
  }

  drawGears() {
    let gearAngles = [frameCount * 0.05, frameCount * 0.07, frameCount * 0.06]; // Different rotation speeds for each gear
    drawGear(-60, 0, 11, 70, 20, 60, gearAngles[0]); // Left gear
    drawGear(60, 0, 12, 10, 20, 30, gearAngles[1]); // Right gear
    drawGear(0, -40, 10, 8, 15, 45, gearAngles[2]); // Top gear
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
      strokeWeight(16);
      line(0, 0, this.segmentLength, 0);
    }

    // Draw a red dot at the end effector
    fill(255, 0, 0); // Set color to red
    noStroke(); // No border for the circle
    //circle(this.segmentLength, 0, 10); // Draw red circle at the end
    // Draw a rectangle at the end effector
    this.drawEndEffector();

    pop();
  }
  drawEndEffector() {
    // Set rectangle properties
    const rectWidth = 20; // Width of the rectangle
    const rectHeight = 50; // Height of the rectangle

    // Since the last translate() in the loop moved the origin to the end of the last segment,
    // draw the rectangle at this new origin. No rotation is applied to the rectangle.
    fill(0, 0, 0); // Set color to green for visibility
    noStroke();
    rect(this.segmentLength, -rectHeight / 2, rectWidth, rectHeight);
  }
}

//Pi Emblem for Spider

function drawPiEmblem(x, y, scale) {
  const points = [
    { x: 46.3, y: 72.7 },
    { x: 46.3, y: 46 },
    { x: 153.1, y: 46.6 },
    { x: 153.1, y: 72.9 },
    { x: 125.1, y: 72.9 },
    { x: 125.3, y: 126.8 },
    { x: 127.9, y: 126.8 },
    { x: 127.9, y: 99.6 },
    { x: 152.9, y: 99.6 },
    { x: 152.9, y: 153 },
    { x: 101.3, y: 153.2 },
    { x: 101.5, y: 72.3 },
    { x: 98.7, y: 72.1 },
    { x: 98.7, y: 152.8 },
    { x: 46.4, y: 152.9 },
    { x: 46.4, y: 126.3 },
    { x: 73.1, y: 126.7 },
    { x: 73.3, y: 72.7 },
  ];

  beginShape();
  fill("#ff0000");
  for (let i = 0; i < points.length; i++) {
    vertex(x + points[i].x * scale, y + points[i].y * scale);
  }
  endShape(CLOSE);
}

//Gears for spider

function drawGear(x, y, teeth, tWidth, tHeight, radius, angleGear) {
  push(); // Save current drawing state
  noFill();
  strokeWeight(0);
  translate(x, y); // Move to the specified coordinates
  rotate(angleGear); // Rotate by the current angleGear in degrees

  // Draw central circle and additional circles for decoration
  fill(0, 0, 0, 200); // Red semi-transparent fill
  ellipse(0, 0, radius * 2, radius * 2);
  ellipse(0, 0, radius, radius);
  ellipse(0, radius * 0.75, radius * 0.3, radius * 0.3);
  ellipse(0, -radius * 0.75, radius * 0.3, radius * 0.3);
  ellipse(-radius * 0.75, 0, radius * 0.3, radius * 0.3);
  ellipse(radius * 0.75, 0, radius * 0.3, radius * 0.3);

  // Draw each tooth
  for (let i = 0; i < teeth; i++) {
    let toothAngleGear = (360 / teeth) * i; // Calculate tooth angle in degrees
    push();
    rotate(toothAngleGear);
    rect(radius, -tWidth / 2, tHeight, tWidth);
    pop();
  }

  pop(); // Restore original drawing state
}

let rightLeg, leftLeg, rightLeg1, leftLeg1, rightLeg2, leftLeg2, spiderBody;
let legs = []; // Array to hold the leg instances
let spiderAnimatedCheckbox;
let spiderAnimated = true;
let gaitHorizontalDistance;

function setup() {
  createCanvas(windowWidth, windowHeight);
  gaitHorizontalDistance = windowWidth / 0.6;
  spiderBody = new SpiderBody(width / 2, height / 2 + 100);
  // Initialize leg instances and add them to the legs array
  legs.push(new MechanicalLeg(4, 180, true)); // Right-facing leg
  legs.push(new MechanicalLeg(4, 180, false)); // Left-facing leg
  legs.push(new MechanicalLeg(5, 150, true)); // Another right-facing leg
  legs.push(new MechanicalLeg(5, 150, false)); // Another left-facing leg
  legs.push(new MechanicalLeg(4, 200, true)); // And so on...
  legs.push(new MechanicalLeg(4, 200, false));

  // Create a checkbox for spider animation
  spiderAnimatedCheckbox = createCheckbox("Spider Animated", false);
  spiderAnimatedCheckbox.changed(toggleAnimation);
}
function toggleAnimation() {
  spiderAnimated = this.checked();
}

function draw() {
  background(255);
  updateAndDrawLegs();
  spiderBody.update();
  spiderBody.draw();
}

function updateAndDrawLegs() {
  let time = millis() / 300;
  let radius = 50; // Radius for walking animation

  // Define base target positions for each leg
  let baseTargets = [
    { x: gaitHorizontalDistance, y: 900 },
    { x: gaitHorizontalDistance, y: 900 },
    { x: gaitHorizontalDistance, y: 900 },
    { x: gaitHorizontalDistance, y: 900 },
    { x: gaitHorizontalDistance, y: 900 },
    { x: gaitHorizontalDistance, y: 900 },
    { x: gaitHorizontalDistance, y: 900 },
    { x: gaitHorizontalDistance, y: 900 },
  ];

  for (let i = 0; i < legs.length; i++) {
    let leg = legs[i];
    let angleSpeedMultiplier = 0.3 + i * 0.4;
    let angle = time * angleSpeedMultiplier;

    // Reverse direction for left-facing legs
    if (!leg.isRightFacing) {
      angle = -angle;
    }

    let targetX = baseTargets[i].x;
    let targetY = baseTargets[i].y;

    if (spiderAnimated) {
      targetX += 2 * radius * cos(angle);
      targetY += 0.5 * radius * sin(angle);
    }

    // Draw each leg with the computed target position

    drawLeg(
      leg,
      targetX - spiderBody.position.x,
      targetY - spiderBody.position.y
    );
  }
}

function drawLeg(leg, targetX, targetY) {
  push();
  translate(spiderBody.position.x, spiderBody.position.y);

  let rotation = leg.update(targetX, targetY, gaitHorizontalDistance, height);
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
