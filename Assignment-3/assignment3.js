//  __        __    _ _             
//  \ \      / /_ _| | | _____ _ __ 
//   \ \ /\ / / _` | | |/ / _ \ '__|
//    \ V  V / (_| | |   <  __/ |   
//     \_/\_/ \__,_|_|_|\_\___|_|   
// Pi Ko (pk2269@nyu.edu)                                 

//Spider is walking and draggable
class SpiderBody {
  constructor(x, y) {
    this.position = createVector(x, y);
    this.baseY = y; // Base y-position to oscillate around
    this.dragging = false;
    this.dragOffset = createVector(0, 0);
    this.oscillationAmplitude = 30; // Amplitude of the up-and-down movement
    this.oscillationSpeed = 0.05; // Speed of the up-and-down movement
  }

  update() {
    this.position.x = mouseX - 50;
    // Apply a sin motion when not dragging
    this.position.y =
      mouseY +
      sin(frameCount * this.oscillationSpeed) * this.oscillationAmplitude;
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
// For drawing Gears on the spider
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


//Swarm Functions

// Blast class
class Blast {
  constructor(x, y) {
    this.maxLifePoints = 80;
    this.lifePoints = this.maxLifePoints;
    this.radius = 1;
    this.location = createVector(x, y);
  }

  // Update the blast's properties
  update() {
    this.lifePoints -= 1;
    var softener = 3;
    this.intensity = 1 / (this.maxLifePoints - this.lifePoints + softener);
    this.radius += this.intensity * 70;
    this.repel();
  }

  // Repel entities within the blast radius
  repel() {
    for (let entity of swarm) {
      let distance = p5.Vector.dist(entity.location, this.location);
      if (distance <= this.radius * 1.8) {
        let force = p5.Vector.sub(entity.location, this.location);
        force.setMag(this.intensity * 6);
        entity.applyForce(force);
      }
    }
  }

  // Display the blast
  display() {
    let opacity = map(this.lifePoints, this.maxLifePoints, 0, 200, 0);
    stroke(0, opacity);
    strokeWeight(map(this.lifePoints, this.maxLifePoints, 0, 1, 20));
    noFill();
    ellipse(this.location.x, this.location.y, this.radius * 2);
  }
}

// Entity (swarm member) class
class Entity {
  constructor(x, y) {
    this.location = createVector(x, y);
    this.velocity = createVector();
    this.acceleration = createVector();
    this.maxSpeed = 3.7;
    this.maxForce = 0.1;
  }
// Update entity state
  do() {
    this.flock();
    this.update();
  }

  // Calculate steering forces
  flock() {
    let seekForce = this.seek(target.position);
    let separateForce = this.separate();

    this.applyForce(seekForce);
    this.applyForce(separateForce);
  }

  // Seek towards a target
  seek(target) {
    let desired = p5.Vector.sub(target, this.location);
    desired.setMag(this.maxSpeed);
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxForce);
    return steer;
  }

  // Separate from nearby entities
  separate() {
    let desiredSeparation = 130;
    let steer = createVector();
    let count = 0;

    for (let other of swarm) {
      let d = p5.Vector.dist(this.location, other.location);
      if (d > 0 && d < desiredSeparation) {
        let diff = p5.Vector.sub(this.location, other.location);
        diff.normalize();
        diff.div(d);
        steer.add(diff);
        count++;
      }
    }

    if (count > 0) {
      steer.div(count);
    }

    if (steer.mag() > 0) {
      steer.setMag(this.maxForce);
    }
    return steer;
  }

  // Apply a force to the entity
  applyForce(force) {
    this.acceleration.add(force);
  }

  // Update the entity's position
  update() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.location.add(this.velocity);
    this.acceleration.mult(0);
  }

  // Display the entity
  display() {
    stroke(0);
    strokeWeight(2);
    point(this.location.x, this.location.y);
  }
}


// Handle updating and displaying blasts
function handleBlasts() {
  for (let i = blasts.length - 1; i >= 0; i--) {
    if (blasts[i].lifePoints <= 0) {
      blasts.splice(i, 1);
    } else {
      blasts[i].update();
      blasts[i].display();
    }
  }
}

// Update and display the swarm
function handleSwarm() {
  for (let entity of swarm) {
    entity.do();
    entity.display();
  }
}

// Mouse clicked event for triggering blasts
function mouseClicked() {
  blasts.push(new Blast(mouseX, mouseY));
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

//Target for Swarm

// Moving target class
class MovingTarget {
  constructor(x, y) {
    this.origin = createVector(x, y);
    this.position = this.origin;
  }
  
   // Update the target's position in a circular path
  update() {
    this.position = createVector(mouseX-100,mouseY+20);
  }

  // Display the target
  display() {
    stroke(0);
    strokeWeight(2);
    fill(0, 150);
    ellipse(this.position.x, this.position.y, 20, 20);
    fill(0);
    noStroke();
    textSize(12);
    text('Target', this.position.x + 15, this.position.y + 5);
  }
}


let rightLeg, leftLeg, rightLeg1, leftLeg1, rightLeg2, leftLeg2, spiderBody;
let legs = []; // Array to hold the leg instances
let spiderAnimatedCheckbox;
let spiderAnimated = true;
let gaitHorizontalDistance;
//Swarm Parameters
let swarm = []; // Array to hold the swarm entities
let target;     // The moving target
let blasts = []; // Array to hold the blasts
let showTarget = true; // Boolean to show/hide the target

// Grassland parameters
let grassSpeed = 5;
let grass = [];

//Audio Functions
// Global variables
let gainNode,mySound,
  explosionSound,
  fft,
  customFont,
  toggleSoundButton;

function preload() {
  customFont = loadFont("https://intro-to-im.vercel.app/API/earthorbiter.ttf");
  mySound = loadSound(
    "https://intro-to-im.vercel.app/API/gunninforyou_cut.mp3"
  );
  explosionSound = loadSound(
    "https://intro-to-im.vercel.app/API/explosion.mp3"
  );
}



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
  //Add Swarm
  
  // Initialize the swarm with 200 entities
  for (let i = 0; i < 16; i++) {
    swarm.push(new Entity(random(width), random(height)));
  }

  // Initialize the target with circular motion parameters
  target = new MovingTarget(mouseX, mouseY);
  initializeGrass();

  //Music Setup
  mySound.loop();
  fft = new p5.FFT(0.9);
  fft.setInput(mySound);
  gainNode = new p5.Gain();
  mySound.disconnect();
  mySound.connect(gainNode);
  gainNode.amp(0.15);
  gainNode.connect();
  toggleSoundButton = createButton("Music Off")
    .position(windowWidth - 120, 20)
    .mousePressed(toggleSound);
  styleToggleButton();
}

function styleToggleButton() {
  const colorRatio = 1;
  const color = `rgb(${colorRatio * 255}, ${(1 - colorRatio) * 255}, 0)`;
  toggleSoundButton
    .style("background-color", "transparent")
    .style("color", color)
    .style("border", `1px solid ${color}`);
}

function toggleSound() {
  if (mySound.isPlaying()) {
    mySound.pause();
    toggleSoundButton.html("Music On");
  } else {
    mySound.loop();
    toggleSoundButton.html("Music Off");
  }
}

//Draw Music Visualizer
function drawVisualizer() {
  //console.log("Audio");
  push();
  let waveform = fft.waveform();
  noFill();
  beginShape();
  strokeWeight(1);
  stroke(255, 0, 0);

  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 0, waveform.length, 0, width);
    let y = map(waveform[i], -1, 1, 0, height);
    vertex(x, y);
  }
  endShape();
  pop();
}

function toggleAnimation() {
  spiderAnimated = this.checked();
}

function draw() {
  background(255);
  drawVisualizer();
  mySound.setVolume(1);
  updateAndDrawLegs();
  //Add Swarm
   // Handle blast updates and rendering
  handleBlasts();

  // Update and display the swarm entities
  handleSwarm();
  target.update();
  drawLinesBetweenEntities();
  spiderBody.update();
  spiderBody.draw();
  drawGrass();
  fill(0);
  rect(0,height - 90,windowWidth,100);
  //Add Texts
  push();
  strokeWeight(0);
  textAlign(CENTER, CENTER);
  textSize(30);
  textFont(customFont);
  fill(0);
  text("Pi's\nPracticality Walker", windowWidth / 2, 50);
  textSize(16);
  fill(255);
  text(
    "Move the mouse around.\nAnimation is not hard coded, but \"procedurally generated\" \n on the spot using Inverse Kinematics.",
    windowWidth / 2,
    windowHeight / 2 + 280
  );
  pop();
}

//This layouts the grass, in parallax effect
function initializeGrass() {
  let grassSpacing = 20; // Spacing between each grass blade
  for (let x = 0; x < width; x += grassSpacing) {
    let grassHeight = random(50, 100); // Random height for each blade of grass
    grass.push({ x: x, height: grassHeight });
  }
}

function drawGrass() {
  push();
  fill(0);
  noStroke();
  grass.forEach((blade, index) => {
    let grassBottomY = height - 90; // Base height of the grass
    triangle(
      blade.x, grassBottomY,
      blade.x + 5, grassBottomY - blade.height,
      blade.x + 10, grassBottomY
    );

    // Update grass position for scrolling
    blade.x -= grassSpeed;
    // Reset position if off-screen
    if (blade.x < -10) {
      blade.x = width;
      blade.height = random(50, 100); // Randomize height again
    }
  });
  pop();
}

//This connects the swarm
function drawLinesBetweenEntities() {
  push();
  const maxDistance = 150; // Maximum distance for drawing lines

  for (let i = 0; i < swarm.length; i++) {
    for (let j = i + 1; j < swarm.length; j++) {
      let distance = dist(
        swarm[i].location.x, swarm[i].location.y,
        swarm[j].location.x, swarm[j].location.y
      );

      if (distance < maxDistance) {
        let opacity = map(distance, 0, maxDistance, 255, 0); // Decrease opacity with distance
        stroke(0, 0, 0, opacity); // Set stroke color with dynamic opacity
        line(
          swarm[i].location.x, swarm[i].location.y,
          swarm[j].location.x, swarm[j].location.y
        );
      }
    }
  }
  pop();
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
