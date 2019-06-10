let part;
let pressed = false;

let NUM_PARTICLES = 255;
let MAX_SPEED = 5;
let MIN_ACC_MULT = 0.0005;
let MAX_ACC_MULT = 0.001;

function setup() {
  var cnv = createCanvas(window.innerWidth, window.innerHeight);
  cnv.style('display', 'block');
  colorMode(HSB);

  background(0);
  part = new ParticleSystem(width/2, height/2);
  for(let i = 0; i < NUM_PARTICLES; i++){
    part.add();
  }
}

function draw() {
  background(0, 0, 0, 0.05);
  part.update();
  part.show();

}

function windowResized() {
   resizeCanvas(window.innerWidth, window.innerHeight);
}

function mousePressed(){
  pressed = true;
}

function mouseReleased(){
  pressed = false;
}

class ParticleSystem {
  constructor(x, y){
    this.pos = createVector(x, y);
    this.particles = [];
  }

  add(){
    var xo = random(-width / 2, width / 2);
    var yo = random(-height / 2, height / 2);
    this.particles.push(new Particle(this.pos.x + xo, this.pos.y + yo));
  }

  update(){
    let mpos = createVector(mouseX, mouseY);
    if(!pressed){
      this.moveTowards(mpos);
    }
    else{
      this.moveAway(mpos);
    }
    for(let particle of this.particles){
      particle.update();
    }
  }

  show(){
    for(var particle of this.particles){
      particle.show();
    }
  }

  moveTowards(target){
    for(var particle of this.particles){
      particle.moveTowards(target);
    }
  }

  moveAway(target){
    for(var particle of this.particles){
      particle.moveAway(target);
    }
  }
}

class Particle {
  constructor(x, y){
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
  }

  update(){
    this.vel.add(this.acc);
    this.pos.add(this.vel);

    this.acc.mult(0.99);
    this.vel.mult(0.99);

    this.pos.x = constrain(this.pos.x, 0, width);
    this.pos.y = constrain(this.pos.y, 0, height);
    this.acc.limit(MAX_SPEED);
    this.vel.limit(MAX_SPEED);
  }

  show(){
    push();
    //var col = map(this.pos.x, 0, width, 0, 360);
    var col = map(this.vel.mag(), 0, MAX_SPEED, 0, 360, true);

    stroke(col, 100, 100);
    fill(col, 100, 100);
    ellipse(this.pos.x, this.pos.y, 3);
    pop();
  }

  moveTowards(target){
    var force = p5.Vector.sub(target, this.pos).normalize();

    var multi = map(p5.Vector.dist(this.pos, target), 0, width, MIN_ACC_MULT, MAX_ACC_MULT);
    force.mult(multi);
    this.addForce(force);
  }

  moveAway(target){
    var force = p5.Vector.sub(this.pos, target).normalize();

    var multi = map(p5.Vector.dist(this.pos, target), 0, width, MAX_ACC_MULT, MIN_ACC_MULT);
    force.mult(multi);
    this.addForce(force);
  }

  addForce(vector){
    this.acc.add(vector);
  }

}
