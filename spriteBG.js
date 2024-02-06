// Sprite Sheet with BG
let spritesheet;
let spritedata;

let animation = [];
let piCharacters = [];
let bgImage; // Variable for the background image


function preload() {
  spritedata = loadJSON('https://intro-to-im.vercel.app/piWalk.json'); // Path to your JSON file
  spritesheet = loadImage('https://intro-to-im.vercel.app/piWalk.png'); // Path to your spritesheet
  bgImage = loadImage('https://c.files.bbci.co.uk/24DA/production/_125543490_sunset2.jpg'); // Load your background image
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  background(255); // Set the background to white

  let spriteFrames = spritedata.frames; // Renamed to avoid conflict with the reserved keyword
  for (let i = 0; i < spriteFrames.length; i++) {
    let frame = spriteFrames[i].frame;
    let img = spritesheet.get(frame.x, frame.y, frame.w, frame.h);
    animation.push(img);
  }

  for (let i = 0; i < 3; i++) {
    piCharacters[i] = new Sprite(animation, random(0, windowWidth), i, random(0.3, 0.4));
  }
}

function draw() {
 image(bgImage, 0, 0, windowWidth, windowHeight); // Display the background image

  for (let character of piCharacters) {
    character.show();
    character.animate();
  }
}

class Sprite {
  constructor(animation, x, y, speed) {
    this.x = x;
    this.y = y;
    this.animation = animation;
    this.w = this.animation[0].width;
    this.len = this.animation.length;
    this.speed = speed;
    this.index = 0;
  }

  show() {
    let index = floor(this.index) % this.len;
    image(this.animation[index], this.x, this.y);
  }

  animate() {
    this.index += this.speed;
    this.x += this.speed * 15;

    if (this.x > width) {
      this.x = -this.w;
    }
  }
}
