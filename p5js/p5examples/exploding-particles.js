let particles = [];
let shrapnel = [];
var friction = .996;
var gravity = .12;
var topspeed = 20;

function setup() {
  var cnv = createCanvas(window.innerWidth, window.innerHeight);
  cnv.style('display', 'block');
  background(0);

  particles[0] = new Particle(width/2, height/2, 16);
}

function draw() {
  background(0, 0, 0, 175);

  for (var i = 0; i < particles.length; i++){
    particles[i].update();
    particles[i].show();

    if( !particles[i].isUseful ) {
      particles[i].explode();
      particles.splice(i, 1);
    }
  }

  for (var i = 0; i < shrapnel.length; i++){
    shrapnel[i].update();
    shrapnel[i].show();

    if( !shrapnel[i].isUseful ) {
      shrapnel.splice(i, 1);
    }
  }
}

class Particle {

  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.velocity = createVector(random(-10, 10), random(-10, 10));
    this.speed = sqrt( pow(this.velocity.x, 2) + pow(this.velocity.y, 2) );
    this.isUseful = true;

    this.col = color(random(170, 255), random(170, 255), random(170, 255));
    this.rcol = color(this.col.levels[0], this.col.levels[1], this.col.levels[2]);
  }

  show() {
    stroke(this.rcol);
    strokeWeight(this.r/2);
    noFill();
    ellipse(this.x,this.y,this.r,this.r);
  }

  update() {
    this.velocity.x *= friction;
    this.velocity.y *= friction;
    this.velocity.y += gravity;

    this.x += this.velocity.x;
    this.y += this.velocity.y;

    this.x = constrain(this.x, this.r, width - this.r);
    this.y = constrain(this.y, this.r, height - this.r);

    if (this.x <= this.r || this.x >= width - this.r) {
      this.velocity.x *= -0.93;
    }
    if (this.y <= this.r || this.y >= height - this.r) {
      this.velocity.y *= -0.93;
    }

    this.speed = constrain(sqrt( pow(this.velocity.x, 2) + pow(this.velocity.y, 2) ), 0, topspeed);

    this.rcol.levels[0] = this.col.levels[0] * map(this.speed, 0, topspeed, 0.6, 1);
    this.rcol.levels[1] = this.col.levels[1] * map(this.speed, 0, topspeed, 0.6, 1);
    this.rcol.levels[2] = this.col.levels[2] * map(this.speed, 0, topspeed, 0.6, 1);

    if (this.speed <= 1) {
      this.isUseful = false;
    }
  }

  explode() {
    for(let i = 0; i < 3; i++) {
      var shrap = new Particle(this.x, this.y, this.r / 2);
      shrapnel.push(shrap);
    }

  }


}

function mousePressed(){
  var nP = new Particle(mouseX, mouseY, 16);
  particles.push(nP);
}
