// Done, fine tuned the connections

// circle around origin with multiple swarms, and parameters fine tuned

// sketch.js
// A p5.js sketch simulating multiple swarms of entities, each following a moving target, with a global effect for blasts
// Nearly final, circle around origin with multiple swarms, and parameters fine tuned

// sketch.js
// A p5.js sketch simulating multiple swarms of entities, each following a moving target, with a global effect for blasts

let swarms = []; // Array of arrays, each holding a group of swarm entities
let targets = []; // Array to hold the moving targets
let blasts = []; // Array to hold the blasts
let showTarget = true; // Boolean to show/hide the targets

// Parameters for the circular motion of the targets
let circleOrigin;
let circleRadius;
const circleSpeed = 0.03;
const numGroups = 17; // Number of swarms and targets

// setup function
function setup() {
  createCanvas(windowWidth, windowHeight);
  circleRadius = windowHeight / 3;
  circleOrigin = createVector(windowWidth / 2, windowHeight / 2);

  // Initialize swarms and targets
  for (let i = 0; i < numGroups; i++) {
    let swarm = [];
    for (let j = 0; j < 14; j++) {
      swarm.push(new Entity(random(width), random(height), i));
    }
    swarms.push(swarm);

    let angle = TWO_PI / numGroups * i;
    targets.push(new MovingTarget(circleOrigin, circleRadius, circleSpeed, angle));
  }
}

function draw() {
  background(0);

  // Update and display targets
  if (showTarget) {
    for (let target of targets) {
      target.update();
      //target.display();
    }
  }

  // Handle blasts
  handleBlasts();

  // Update and display swarm groups
  for (let swarm of swarms) {
    handleSwarm(swarm);
  }
  
  // Draw lines between entities that are close to each other
  drawLinesBetweenEntities();
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

// Update and display a swarm group
function handleSwarm(swarm) {
  for (let entity of swarm) {
    entity.do(swarm);
    entity.display();
  }
}

// Mouse clicked event for triggering blasts
function mouseClicked() {
  blasts.push(new Blast(mouseX, mouseY));
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
    let opacity = map(this.lifePoints, this.maxLifePoints, 0, 200, 0);
    stroke(255, opacity);
    strokeWeight(map(this.lifePoints, this.maxLifePoints, 0, 1, 20));
    noFill();
    ellipse(this.location.x, this.location.y, this.radius * 2);
  }
}

// Entity (swarm member) class
class Entity {
  constructor(x, y, groupIndex) {
    this.location = createVector(x, y); // Position of the entity
    this.velocity = createVector(); // Movement velocity of the entity
    this.acceleration = createVector(); // Acceleration for applying forces
    this.maxSpeed = 6; // Maximum speed of the entity
    this.maxForce = 0.2; // Maximum steering force for movement
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
    let desiredSeparation = 25; // Desired separation distance
    let steer = createVector(); // Steering force to be returned
    let count = 0; // Count how many entities are too close

    // Check every entity in the swarm
    for (let other of swarm) {
      let d = p5.Vector.dist(this.location, other.location); // Distance from other entity
      if ((d > 0) && (d < desiredSeparation)) { // If the entity is too close
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
    this.velocity.add(this.acceleration); // Update velocity with acceleration
    this.velocity.limit(this.maxSpeed); // Limit the speed
    this.location.add(this.velocity); // Update the position
    this.acceleration.mult(0); // Reset acceleration
  }

  // Display the entity
  display() {
    stroke(255); // Set stroke color for drawing
    strokeWeight(2); // Set stroke weight
    point(this.location.x, this.location.y); // Draw the entity as a point
  }
}


// Function to toggle target visibility
function keyPressed() {
  if (key === 't' || key === 'T') {
    showTarget = !showTarget;
  }
}


// Function to draw lines between entities that are close
function drawLinesBetweenEntities() {
  let maxDistance = 35; // Maximum distance to draw line
  let minDistance = 0;  // Minimum distance for maximum line intensity

  for (let i = 0; i < swarms.length; i++) {
    for (let j = 0; j < swarms[i].length; j++) {
      for (let k = 0; k < swarms.length; k++) {
        for (let l = 0; l < swarms[k].length; l++) {
          // Avoid connecting the same entity with itself
          if (i !== k || j !== l) {
            let entityA = swarms[i][j];
            let entityB = swarms[k][l];
            let distance = p5.Vector.dist(entityA.location, entityB.location);

            if (distance < maxDistance) {
              let alpha = map(distance, minDistance, maxDistance, 255, 0);
              stroke(255, 255, 255, alpha);
              line(entityA.location.x, entityA.location.y, entityB.location.x, entityB.location.y);
            }
          }
        }
      }
    }
  }
}