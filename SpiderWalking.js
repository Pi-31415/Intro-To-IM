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
    fill(0); // Color of the spider body
    ellipse(0, -20, 180, 80); // Drawing the spider body
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
      strokeWeight(16);
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
let legs = []; // Array to hold the leg instances
let spiderAnimatedCheckbox;
let spiderAnimated = true;
let gaitHorizontalDistance;

function setup() {
 createCanvas(windowWidth, windowHeight);
  gaitHorizontalDistance = windowWidth/0.6;
  spiderBody = new SpiderBody(width / 2, height / 2+100);
  // Initialize leg instances and add them to the legs array
  legs.push(new MechanicalLeg(4, 180, true));  // Right-facing leg
  legs.push(new MechanicalLeg(4, 180, false)); // Left-facing leg
  legs.push(new MechanicalLeg(5, 150, true));  // Another right-facing leg
  legs.push(new MechanicalLeg(5, 150, false)); // Another left-facing leg
  legs.push(new MechanicalLeg(4, 200, true));  // And so on...
  legs.push(new MechanicalLeg(4, 200, false));
  
   // Create a checkbox for spider animation
  spiderAnimatedCheckbox = createCheckbox('Spider Animated', false);
  spiderAnimatedCheckbox.changed(toggleAnimation);
}
function toggleAnimation() {
  spiderAnimated = this.checked();
}

function draw() {
  background(255);
  spiderBody.update();
  spiderBody.draw();

  updateAndDrawLegs();
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
      targetX += 2*radius * cos(angle);
      targetY += 0.5*radius * sin(angle);
    }

    // Draw each leg with the computed target position
    
        drawLeg(leg, targetX - spiderBody.position.x, targetY - spiderBody.position.y);
  };
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

