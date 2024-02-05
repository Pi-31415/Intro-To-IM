//      _               _           _   
//     / \   __ _  __ _(_)_ __  ___| |_ 
//    / _ \ / _` |/ _` | | '_ \/ __| __|
//   / ___ \ (_| | (_| | | | | \__ \ |_ 
//  /_/   \_\__, |\__,_|_|_| |_|___/\__|
//          |___/                       
//    ____     __                    
//   / __/__  / /________  ___  __ __
//  / _// _ \/ __/ __/ _ \/ _ \/ // /
// /___/_//_/\__/_/  \___/ .__/\_, / 
//                      /_/   /___/  
// By Pi

// Constants
const TRAIL_LENGTH = 45;
const NUM_GROUPS = 17;
const SWARM_SIZE = 10;
const CIRCLE_SPEED = 0.02;
const MAX_BLAST_LIFE = 80;
const BLAST_RADIUS = 50;
const ENTITY_MAX_SPEED = 5;
const ENTITY_MAX_FORCE = 0.2;
const DESIRED_SEPARATION = 35;
const MAX_DISTANCE = 45;
const STABLE_CHAOS_VALUE = 250;

// Global variables
let gainNode,
  swarms = [],
  targets = [],
  blasts = [],
  showTarget = true,
  currentChaosValue = 0;
let circleRadius,
  circleOrigin,
  mySound,
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
  circleRadius = min(windowWidth, windowHeight) / 2;
  circleOrigin = createVector(windowWidth / 2, windowHeight / 2);

  for (let i = 0; i < NUM_GROUPS; i++) {
    swarms.push(
      Array.from(
        { length: SWARM_SIZE },
        () => new Entity(random(width), random(height), i)
      )
    );
    targets.push(
      new MovingTarget(
        circleOrigin,
        circleRadius,
        CIRCLE_SPEED,
        (TWO_PI / NUM_GROUPS) * i
      )
    );
  }

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
  const colorRatio = min(currentChaosValue / STABLE_CHAOS_VALUE, 1);
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
  noFill();
  strokeWeight(1);

  // Calculate the color based on the chaos value
  const colorRatio = min(currentChaosValue / STABLE_CHAOS_VALUE, 1);
  const r = colorRatio * 255;
  const g = (1 - colorRatio) * 255;
  const b = 0;
  //Only show Pi logo when in ordered, not chaotic mode
  stroke(r, g, b, (1 - colorRatio) * 255);

  for (let i = 0; i < points.length; i++) {
    vertex(x + points[i].x * scale, y + points[i].y * scale);
  }
  endShape(CLOSE);
}

function calculateChaos() {
  let totalDistance = 0;
  let entityCount = 0;

  swarms.forEach((swarm) => {
    // Selecting half of the entities randomly for optimization
    for (let i = 0; i < swarm.length; i += 2) {
      let entity = swarm[i];
      let distance = p5.Vector.dist(entity.location, circleOrigin);
      totalDistance += distance;
      entityCount++;
    }
  });

  // Calculating the average distance
  let averageDistance = entityCount > 0 ? totalDistance / entityCount : 0;
  if (averageDistance - STABLE_CHAOS_VALUE <= 1) {
    currentChaosValue = 0;
    return 0;
  } else {
    currentChaosValue = averageDistance - STABLE_CHAOS_VALUE;
    return averageDistance - STABLE_CHAOS_VALUE;
  }
}
function displayChaos(value) {
  push();
  textAlign(CENTER, CENTER);
  textSize(18);
  textFont(customFont);

  // Set color based on chaos value
  const colorRatio = min(currentChaosValue / STABLE_CHAOS_VALUE, 1);
  fill(colorRatio * 255, (1 - colorRatio) * 255, 0);

  let chaosText = "";
  if (value < 50) chaosText = "System Organized";
  else if (value < 100) chaosText = "System Moderately Organized";
  else if (value < STABLE_CHAOS_VALUE) chaosText = "System Chaotic";
  else chaosText = "System Extremely Chaotic";

  text(chaosText, windowWidth / 2, windowHeight / 2 + 100);
  pop();
}

function calculateVolume(chaosValue) {
  if (chaosValue < 50) {
    // When chaosValue is less than 50, volume is at maximum
    return 1;
  } else {
    // Exponential decay for chaosValue greater than 50
    return exp(-0.02 * (chaosValue - 2));
  }
}

function drawVisualizer() {
  let waveform = fft.waveform();
  noFill();
  beginShape();

  // Calculate the color based on the chaos value
  const colorRatio = min(currentChaosValue / STABLE_CHAOS_VALUE, 1);
  const r = colorRatio * 255;
  const g = (1 - colorRatio) * 255;
  const b = 0;

  strokeWeight(1);
  stroke(r, g, b, (1 - colorRatio) * 255 * 0.15);

  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 0, waveform.length, 0, width);
    let y = map(waveform[i], -1, 1, 0, height);
    vertex(x, y);
  }
  endShape();
}
function draw() {
  background(0);
  let chaosValue = calculateChaos();
  drawVisualizer();
  drawPiEmblem(
    windowWidth / 2 - (mouseX * 1) / 20 - 90,
    windowHeight / 2 - (mouseY * 1) / 20 - 100,
    1
  );

  targets.forEach((target) => target.update());
  handleBlasts();
  swarms.forEach((swarm) => handleSwarm(swarm));
  if (showTarget) drawLinesBetweenEntities();
  displayChaos(chaosValue);

  mySound.setVolume(calculateVolume(chaosValue));
  push();
  strokeWeight(0);
  textAlign(CENTER, CENTER);
  textSize(30);
  textFont(customFont);
  fill(255);
  text("Against Entropy", windowWidth / 2, 50);
  textSize(16);
  fill(200);
  text(
    "Click anywhere to disturb the system",
    windowWidth / 2,
    windowHeight / 2 + 200
  );
  pop();
  styleToggleButton();
}

function handleBlasts() {
  blasts = blasts.filter((blast) => {
    blast.update();
    blast.display();
    return blast.lifePoints > 0;
  });
}

function handleSwarm(swarm) {
  swarm.forEach((entity) => {
    entity.do(swarm);
    entity.display();
  });
}

function mouseClicked() {
  blasts.push(new Blast(mouseX, mouseY));
  // Play explosion sound
  explosionSound.play();
  explosionSound.setVolume(0.08); // Set to desired volume level
}

function keyPressed() {
  if (key === "t" || key === "T") showTarget = !showTarget;
}

// Moving target class
class MovingTarget {
  constructor(origin, radius, speed, angle) {
    this.center = origin; // Center point around which the target revolves
    this.radius = radius; // Radius of revolution
    this.speed = speed; // Speed of revolution
    this.angle = angle; // Starting angle for the revolution
  }

  // Update the target's position in a circular orbit
  update() {
    this.angle += this.speed;
    let x = this.center.x + this.radius * cos(this.angle);
    let y = this.center.y + this.radius * sin(this.angle);
    this.position = createVector(x, y);
  }

  // Display the target
  display() {
    stroke(255);
    strokeWeight(2);
    fill(255, 150);
    ellipse(this.position.x, this.position.y, 20, 20);
    fill(255);
    noStroke();
    textSize(12);
    text("Target", this.position.x + 15, this.position.y + 5);
  }
}

// Blast class
class Blast {
  constructor(x, y) {
    this.maxLifePoints = MAX_BLAST_LIFE;
    this.lifePoints = this.maxLifePoints;
    this.radius = BLAST_RADIUS;
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
    for (let swarm of swarms) {
      for (let entity of swarm) {
        let distance = p5.Vector.dist(entity.location, this.location);
        if (distance <= this.radius * 1.8) {
          let force = p5.Vector.sub(entity.location, this.location);
          force.setMag(this.intensity * 20);
          entity.applyForce(force);
        }
      }
    }
  }

  // Display the blast
  display() {
    push();
    let opacity = map(this.lifePoints, this.maxLifePoints, 0, 200, 0);
    stroke(255, 155, 0, opacity);
    strokeWeight(map(this.lifePoints, this.maxLifePoints, 0, 1, 20));
    noFill();
    ellipse(this.location.x, this.location.y, this.radius * 2);
    pop();
  }
}

// Entity (swarm member) class
class Entity {
  constructor(x, y, groupIndex) {
    this.trail = [];
    this.location = createVector(x, y); // Position of the entity
    this.velocity = createVector(); // Movement velocity of the entity
    this.acceleration = createVector(); // Acceleration for applying forces
    this.maxSpeed = ENTITY_MAX_SPEED; // Maximum speed of the entity
    this.maxForce = ENTITY_MAX_FORCE; // Maximum steering force for movement
    this.groupIndex = groupIndex; // Index of the swarm group this entity belongs to
  }

  // Main function called in draw to update entity behavior
  do(swarm) {
    let targetPosition = targets[this.groupIndex].position; // Get associated target position
    let seekForce = this.seek(targetPosition); // Calculate steering force towards the target
    let separateForce = this.separate(swarm); // Calculate separation force from other entities

    this.applyForce(seekForce); // Apply steering force towards the target
    this.applyForce(separateForce); // Apply separation force
    this.update(); // Update the entity's position based on forces
  }

  // Seek steering force towards a target
  seek(target) {
    let desired = p5.Vector.sub(target, this.location); // Desired velocity towards the target
    desired.setMag(this.maxSpeed); // Set to maximum speed
    let steer = p5.Vector.sub(desired, this.velocity); // Steering = Desired minus Velocity
    steer.limit(this.maxForce); // Limit the steering force
    return steer;
  }

  // Separation force to avoid crowding local flockmates
  separate(swarm) {
    let desiredSeparation = DESIRED_SEPARATION; // Desired separation distance
    let steer = createVector(); // Steering force to be returned
    let count = 0; // Count how many entities are too close

    // Check every entity in the swarm
    for (let other of swarm) {
      let d = p5.Vector.dist(this.location, other.location); // Distance from other entity
      if (d > 0 && d < desiredSeparation) {
        // If the entity is too close
        let diff = p5.Vector.sub(this.location, other.location); // Calculate vector pointing away
        diff.normalize();
        diff.div(d); // Weight by distance
        steer.add(diff);
        count++;
      }
    }

    if (count > 0) {
      steer.div(count); // Average the steering forces
    }

    if (steer.mag() > 0) {
      steer.setMag(this.maxForce); // Set magnitude to maximum force if not zero
    }
    return steer;
  }

  // Apply a force to the entity
  applyForce(force) {
    this.acceleration.add(force); // Add the force to acceleration
  }

  // Update the entity's position
  update() {
    this.trail.push(this.location.copy()); // Add the current position
    if (this.trail.length > TRAIL_LENGTH) {
      this.trail.shift(); // Remove the oldest position
    }
    this.velocity.add(this.acceleration); // Update velocity with acceleration
    this.velocity.limit(this.maxSpeed); // Limit the speed
    this.location.add(this.velocity); // Update the position
    this.acceleration.mult(0); // Reset acceleration
  }

  // Display the entity
  display() {
    // Change color based on chaos value
    const colorRatio = min(currentChaosValue / STABLE_CHAOS_VALUE, 1);
    const r = colorRatio * 255;
    const g = (1 - colorRatio) * 255;
    const b = 0;

    stroke(r, g, b);

    //For loop to draw the trails
    for (let i = this.trail.length - 1; i >= 0; i -= 5) {
      let opacity = map(i, 0, this.trail.length, 0, 255);
      stroke(r, g, b, opacity); // Decreasing opacity
      point(this.trail[i].x, this.trail[i].y);
    }

    strokeWeight(2); // Set stroke weight
    point(this.location.x, this.location.y); // Draw the entity as a point
  }
}

function drawLinesBetweenEntities() {
  // Calculate the color based on the chaos value
  const colorRatio = min(currentChaosValue / STABLE_CHAOS_VALUE, 1);
  const r = colorRatio * 255;
  const g = (1 - colorRatio) * 255;
  const b = 0;

  for (let i = 0; i < swarms.length; i++) {
    for (let j = 0; j < swarms[i].length; j++) {
      let entityA = swarms[i][j];
      for (let k = i; k < swarms.length; k++) {
        for (let l = k === i ? j + 1 : 0; l < swarms[k].length; l++) {
          let entityB = swarms[k][l];
          let distance = p5.Vector.dist(entityA.location, entityB.location);
          if (distance < MAX_DISTANCE) {
            // Use the calculated color with opacity based on distance
            let opacity = map(distance, 0, MAX_DISTANCE, 255, 0);
            stroke(r, g, b, opacity);
            line(
              entityA.location.x,
              entityA.location.y,
              entityB.location.x,
              entityB.location.y
            );
          }
        }
      }
    }
  }
}
