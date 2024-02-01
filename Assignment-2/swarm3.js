// Working with moving target and blast
// Fine tuned parameters

// sketch.js
// A p5.js sketch simulating a swarm of entities following a moving target and reacting to blasts

let swarm = []; // Array to hold the swarm entities
let target; // The moving target
let blasts = []; // Array to hold the blasts
let showTarget = true; // Boolean to show/hide the target

// Parameters for circular motion of the target
let circleOrtigin;
let circleRadius;
const circleSpeed = 0.015;

function setup() {
  createCanvas(windowWidth, windowHeight);
  circleRadius = windowWidth / 4;
  circleOrigin = createVector(windowWidth / 2, windowHeight / 2); // Initialize circleOrigin here

  // Initialize the swarm with 200 entities
  for (let i = 0; i < 100; i++) {
    swarm.push(new Entity(random(width), random(height)));
  }

  // Initialize the target with circular motion parameters
  target = new MovingTarget(
    circleOrigin.x,
    circleOrigin.y,
    circleRadius,
    circleSpeed
  );
}

function draw() {
  background(0);

  // Update and display the target if it's set to be visible
  if (showTarget) {
    target.update();
    target.display();
  }

  // Handle blast updates and rendering
  handleBlasts();

  // Update and display the swarm entities
  handleSwarm();
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

// Moving target class
class MovingTarget {
  constructor(x, y, radius, speed) {
    this.origin = createVector(x, y);
    this.radius = radius;
    this.speed = speed;
    this.angle = 0;
  }

  // Update the target's position in a circular path
  update() {
    this.angle += this.speed;
    let x = this.origin.x + this.radius * cos(this.angle);
    let y = this.origin.y + this.radius * sin(this.angle);
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
    this.maxLifePoints = 80;
    this.lifePoints = this.maxLifePoints;
    this.radius = 50;
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
        force.setMag(this.intensity * 20);
        entity.applyForce(force);
      }
    }
  }

  // Display the blast
  display() {
    let opacity = map(this.lifePoints, this.maxLifePoints, 0, 200, 0);
    stroke(255, opacity);
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
    this.maxSpeed = 10;
    this.maxForce = 0.2;
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
    let desiredSeparation = 25;
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
    stroke(255);
    strokeWeight(2);
    point(this.location.x, this.location.y);
  }
}

// Function to toggle target visibility
function keyPressed() {
  if (key === "t" || key === "T") {
    showTarget = !showTarget;
  }
}
