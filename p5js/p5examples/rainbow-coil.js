let planets = []

function setup(){
  var cnv = createCanvas(window.innerWidth, window.innerHeight, WEBGL);
  cnv.style('display', 'block');
  for(let i = 0; i < 50; i++){
    planets.push(new planet(i * 10, 0, 10, 400 - 5*i, i));
  }
  frameRate(30);
  colorMode(HSB);
}

function draw(){
  background(0, 0, 0);
  orbitControl();

  for(planet of planets){
    planet.update();
    planet.show();
  }
}

class planet{
  constructor(x, y, size, spd, index){
    this.x = x;
    this.y = y;
    this.z = 0; //spd < 400 ? random(-100, 100) : 0;
    this.size = size;
    this.cDist = x;
    this.oRotation = 0; //random(TWO_PI);
    this.framesPerOrbit = spd;
    this.color = this.x % 360;
    this.sat = 100;
    this.brt = 100;
    this.index = index;
    this.x2 = index != 0 ? planets[index-1].x : 0;
    this.y2 = index != 0 ? planets[index-1].y : 0;
  }

  show(){
    push();
    fill(this.color, this.sat, this.brt);
    stroke(this.color, this.sat, this.brt);
    //line(this.x, this.y, 0, this.x2, this.y2, 0);
    line(0, 0, 0, this.x, this.y, 0);
    translate(this.x, this.y, this.z);
    sphere(this.size);
    pop();
  }

  update(){
    this.x2 = this.index != 0 ? planets[this.index-1].x : 0;
    this.y2 = this.index != 0 ? planets[this.index-1].y : 0;

    if(this.framesPerOrbit != 0){
      this.x = this.cDist * cos(this.oRotation);
      this.y = this.cDist * sin(this.oRotation);
    }
    else{
      this.x = 0;
      this.y = 0;
    }
    this.oRotation += (TWO_PI / this.framesPerOrbit);
    this.oRotation %= (TWO_PI);
  }
}
