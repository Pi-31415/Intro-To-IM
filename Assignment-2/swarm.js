// sketch.js


let swarm = [];
let blasts = [];
let showLines = true;
let showUI = true;
let blur = false;
let slider;
let swarmCenter;
let swarmRadius;
let rotationSpeed = 0.2; // Increased rotation speed

function setup() {
  createCanvas(1000, 1000);
  swarmCenter = createVector(width / 2, height / 2);
  swarmRadius = 2;

  slider = createSlider(1, 500, 200);
  let sliderBuffer = 5;
  slider.position(width / 2 - slider.width / 2, height - slider.height - sliderBuffer);

  for (let i = 0; i < slider.value(); i++) {
    let angle = random(TWO_PI);
    let x = swarmCenter.x + swarmRadius * cos(angle);
    let y = swarmCenter.y + swarmRadius * sin(angle);
    swarm.push(new Entity(x, y, angle));
  }

  blasts = [];
}

function draw() {
  if (blur) {
    background(0, 80);
  } else {
    background(0);
  }

  handleBlasts();
  handleSwarm();

  if (showUI) {
    displayFrameRate();
    displayPopulationSize();
  }
}

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

function handleSwarm() {
  if (swarm.length < slider.value()) {
    for (let i = 0; i <= slider.value() - swarm.length; i++) {
      let angle = random(TWO_PI);
      let x = swarmCenter.x + swarmRadius * cos(angle);
      let y = swarmCenter.y + swarmRadius * sin(angle);
      swarm.push(new Entity(x, y, angle));
    }
  } else if (swarm.length > slider.value()) {
    swarm.splice(slider.value(), swarm.length);
  }

  for (let entity of swarm) {
    entity.do();
    entity.display();
  }
}

function displayPopulationSize() {
  textAlign(LEFT, BOTTOM);
  textSize(15);
  fill(255, 200);
  noStroke();
  text(swarm.length, width / 2 + slider.width / 2 + 10, height - 3 - 5);
}

function displayFrameRate() {
  textAlign(LEFT, BOTTOM);
  let notRed = map(frameRate(), 30, 55, 0, 255);
  textSize(15);
  fill(255, notRed, notRed, 200);
  text(floor(frameRate()), 5, 17);
}

function mouseClicked() {
  if (!onSlider(mouseX, mouseY)) {
    blasts.push(new Blast());
  }
}

function onSlider(x, y) {
  return y > height - slider.height - 10 && x > width / 2 - slider.width / 2 - 5 && x < width / 2 + slider.width / 2 + 5;
}

function keyPressed() {
  if (key === "l" || key === "L") {
    showLines = !showLines;
  }
  if (key === "u" || key === "U") {
    showUI = !showUI;
    showUI ? slider.show() : slider.hide();
  }
  if (key === "b" || key === "B") {
    blur = !blur;
  }
}

class Blast {
  constructor() {
    this.maxLifePoints = 80;
    this.lifePoints = this.maxLifePoints;
    this.radius = 1;
    this.location = createVector(mouseX, mouseY);
  }

  update() {
    this.lifePoints -= 1;
    let softener = 3;
    this.intensity = 1 / (this.maxLifePoints - this.lifePoints + softener);
    this.radius += this.intensity * 70;
    this.repel();
  }

  repel() {
    for (let entity of swarm) {
      let connection = p5.Vector.sub(entity.location, this.location);
      let distance = connection.mag();
      if (distance <= this.radius * 1.8) {
        let repelForce = connection.setMag(this.intensity * 6);
        entity.applyForce(repelForce);
      }
    }
  }

  display() {
    let opacity = map(this.lifePoints, this.maxLifePoints, 0, 200, 0);
    noFill();
    stroke(255, opacity);
    strokeWeight(map(this.lifePoints, this.maxLifePoints, 0, 1, 20));
    circle(this.location.x, this.location.y, this.radius);
  }
}


class Entity {
  constructor(x, y, angle) {
    this.location = createVector(x, y);
    this.angle = angle;
    this.acceleration = createVector();
    this.velocity = createVector();
    this.maxSpeed = 5; // Increased speed
    this.maxSteeringForce = 0.1; // Increased steering force for agility
    this.radius = 1.5;
    this.wanderTheta = 0;
  }

  do() {
    this.seek();
    this.wander();
    this.update();
  }
  
    wander() {
    // Wander effect for more dynamic movement
    let wanderRadius = 0.01;
    let wanderDistance = 0.05;
    let change = 0.3;
    this.wanderTheta += random(-change, change); 

    let wanderPoint = this.velocity.copy().normalize().mult(wanderDistance).add(this.location);
    let wanderForce = p5.Vector.fromAngle(this.wanderTheta).setMag(wanderRadius);
    wanderForce.add(wanderPoint);

    let steering = wanderForce.sub(this.location);
    steering.limit(this.maxSteeringForce);
    this.applyForce(steering);
  }

  seek() {
    this.angle += rotationSpeed; // Increase the angle more quickly
    let target = p5.Vector.add(swarmCenter, p5.Vector.fromAngle(this.angle).mult(swarmRadius));
    let desired = p5.Vector.sub(target, this.location);
    desired.setMag(this.maxSpeed);
    let steering = desired.sub(this.velocity);
    steering.limit(this.maxSteeringForce);
    this.applyForce(steering);
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.location.add(this.velocity);
    this.acceleration.mult(0);
  }

  display() {
    fill(255);
    noStroke();
    push();
    translate(this.location.x, this.location.y);
    text('π', -this.radius, this.radius);
    pop();
  }
}
