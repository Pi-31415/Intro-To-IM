// Global Variables
let spritesheet, spritedata, bgImage;
let animation = [];
let player;
let playerScale = 1.0; // Scale factor for the player

function preload() {
  spritedata = loadJSON('https://intro-to-im.vercel.app/piWalk.json');
  spritesheet = loadImage('https://intro-to-im.vercel.app/piWalk.png');
  bgImage = loadImage('https://c.files.bbci.co.uk/24DA/production/_125543490_sunset2.jpg');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  const animationFrames = spritedata.frames.map(f => spritesheet.get(f.frame.x, f.frame.y, f.frame.w, f.frame.h));
  animation.push(...animationFrames);
  player = new Sprite(animation, width / 2, 0, 0.4);
}

function draw() {
  image(bgImage, 0, 0, windowWidth, windowHeight);
  player.show();
  player.animate();
  player.checkEdges();
}

class Sprite {
   constructor(animation, x, y, speed) {
    this.x = x;
    this.y = y;
    this.animation = animation;
    this.w = this.animation[0].width * playerScale;
    this.h = this.animation[0].height * playerScale;
    this.len = this.animation.length;
    this.speed = speed;
    this.index = 0;
    this.flipped = false;

    // Adjustable parameters for the rectangle
    this.rectWidth = 150;  // Example width
    this.rectHeight = 350; // Example height
    this.rectOffsetX = 0; // Relative origin X offset
    this.rectOffsetY = 150; // Relative origin Y offset
  }

  show() {
    let index = floor(this.index) % this.len;
    push();
    translate(this.x + this.w / 2, this.y + this.h / 2);
    scale(this.flipped ? -playerScale : playerScale, playerScale);
    image(this.animation[index], -this.w / 2, -this.h / 2);

    // Draw bounding box in green
    stroke(0, 255, 0);
    noFill();
    rectMode(CENTER);
    rect(0, 0, this.w, this.h);

    // Draw midpoint of the bounding box
    fill(255, 0, 0); // Red color for midpoint
    ellipse(0, 0, 10, 10); // Midpoint marker

    // Draw adjustable rectangle
    stroke(255, 165, 0); // Orange color for the adjustable rectangle
    noFill();
    rectMode(CENTER);
    rect(this.rectOffsetX, this.rectOffsetY, this.rectWidth, this.rectHeight);

    pop();
  }

  animate() {
    if (keyIsDown(LEFT_ARROW)) {
      this.x -= 5;
      this.flipped = true;
    } else if (keyIsDown(RIGHT_ARROW)) {
      this.x += 5;
      this.flipped = false;
    }
    this.index += this.speed;
  }

  checkEdges() {
    if (this.x < 0) {
      this.x = 0;
    } else if (this.x + this.w > width) {
      this.x = width - this.w;
    }
  }
}
