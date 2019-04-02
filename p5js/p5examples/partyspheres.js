let spheres = [];

function setup(){
  var cnv = createCanvas(window.innerWidth, window.innerHeight, WEBGL);
  cnv.style('display', 'block');
  colorMode(HSB);
  angleMode(DEGREES);
  spheres.push(new partySphere(100, 50, 1, 0, 0, true));
  spheres.push(new partySphere(200, 50, -0.5, 0, 0, false));
  spheres.push(new partySphere(300, 50, 0.25, 0, 0, false));
}

function draw(){
  background(0);
  orbitControl();

  for(ps of spheres){
    ps.update();
    ps.show();
  }
}

class partySphere{
  constructor(size, range, xRot, yRot, zRot, doFill){
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.medSize = size;
    this.size = size;
    this.range = range;
    this.hue = 0;
    this.sat = 180;
    this.brt = 180;
    this.grow = true;
    this.growSpeed = range / random(100, 150);
    this.rotation = [xRot, yRot, zRot];
    this.xRot = xRot;
    this.yRot = yRot;
    this.zRot = zRot;
    this.doFill = doFill;
  }

  show(){
    push();
    rotateX(this.rotation[0]);
    rotateY(this.rotation[1]);
    rotateZ(this.rotation[2]);
    if(this.doFill){ fill(360 - this.hue, this.sat, this.brt) }
    else{ noFill(); }
    stroke(this.hue, this.sat, this.brt);
    translate(0, 0, 0);
    sphere(this.size);
    pop();
  }

  update(){
    this.hue = map(this.size, this.medSize - this.range, this.medSize + this.range, 0, 360);
    if(this.grow){ this.size += this.growSpeed; }
    else { this.size -= this.growSpeed; }

    if(this.size <= this.medSize - this.range || this.size >= this.medSize + this.range ){
         this.grow = !this.grow;
       }

    this.rotation[0] += this.xRot;
    this.rotation[1] += this.yRot;
    this.rotation[2] += this.zRot;
    for(let axis of this.rotation){
      axis %= 360;
    }
  }
}
