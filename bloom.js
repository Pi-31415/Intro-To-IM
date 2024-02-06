// Sprite but with bloom added

let blurH, blurV, bloom;
let spritesheet, spritedata, bgImage;
let animation = [];
let piCharacters = [];

function preload() {
  spritedata = loadJSON('https://intro-to-im.vercel.app/piWalk.json');
  spritesheet = loadImage('https://intro-to-im.vercel.app/piWalk.png');
  bgImage = loadImage('https://c.files.bbci.co.uk/24DA/production/_125543490_sunset2.jpg');
  
  // Load shaders
  blurH = loadShader('https://intro-to-im.vercel.app/base.vert', 'https://intro-to-im.vercel.app/blur.frag');
  blurV = loadShader('https://intro-to-im.vercel.app/base.vert', 'https://intro-to-im.vercel.app/blur.frag');
  bloom = loadShader('https://intro-to-im.vercel.app/base.vert', 'https://intro-to-im.vercel.app/bloom.frag');
}

let pass1, pass2, bloomPass;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  noStroke();

  let spriteFrames = spritedata.frames;
  for (let i = 0; i < spriteFrames.length; i++) {
    let frame = spriteFrames[i].frame;
    let img = spritesheet.get(frame.x, frame.y, frame.w, frame.h);
    animation.push(img);
  }

  for (let i = 0; i < 3; i++) {
    piCharacters[i] = new Sprite(animation, random(0, windowWidth), i, random(0.3, 0.4));
  }

  pass1 = createGraphics(windowWidth, windowHeight, WEBGL);
  pass2 = createGraphics(windowWidth, windowHeight, WEBGL);
  bloomPass = createGraphics(windowWidth, windowHeight, WEBGL);

  pass1.noStroke();
  pass2.noStroke();
  bloomPass.noStroke();
}

function draw() {
  background(0);

  // First Pass - Horizontal Blur
  pass1.shader(blurH);
  blurH.setUniform("tex0", bgImage);
  blurH.setUniform("texelSize", [1.0 / width, 1.0 / height]);
  blurH.setUniform("direction", [1.0, 0.0]);
  pass1.rect(0, 0, width, height);

  // Second Pass - Vertical Blur
  pass2.shader(blurV);
  blurV.setUniform("tex0", pass1);
  blurV.setUniform("texelSize", [1.0 / width, 1.0 / height]);
  blurV.setUniform("direction", [0.0, 1.0]);
  pass2.rect(0, 0, width, height);

  // Bloom Pass
  bloomPass.shader(bloom);
  bloom.setUniform("tex0", bgImage);
  bloom.setUniform("tex1", pass2);
  bloom.setUniform("mouseX", mouseX / width);
  bloomPass.rect(0, 0, width, height);

  // Draw the final bloom effect
  image(bloomPass, -width / 2, -height / 2, width, height);

  // Reset shader and draw sprites
  resetShader();
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
    translate(-width / 2, -height / 2); // Adjust for WEBGL coordinates
    image(this.animation[index], this.x, this.y);
    translate(width / 2, height / 2); // Reset translation
  }

  animate() {
    this.index += this.speed;
    this.x += this.speed * 15;

    if (this.x > width) {
      this.x = -this.w;
    }
  }
}
