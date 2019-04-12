
let left;
let right;
let stack;
let g1;


function setup() {
  var cnv = createCanvas(window.innerWidth, window.innerHeight);
  cnv.style('display', 'block');
  let a = new Vertex('a', 0, 0);
  let b = new Vertex('b', 25, 25);
  let c = new Vertex('c', 50, 50);
  let d = new Vertex('d', 75, 75);
  let e = new Vertex('e', 100, 100);
  g1 = new Graph([ [a, b], [b, c], [c, d], [d, e] ]);
  left = new Set();
  right = new Set();
  left.add(a);
  stack = [a];
}

function draw() {
  background(0);
  translate(width/2, height/2);
  g1.show();
}

function keyPressed(){
  partition();
  sortVertexPositions();
}

function partition(){
  while(stack.length != 0){
    let current = stack.pop();
    let neighbors = g1.neighbors[current.label];
    for(let v of neighbors){
      if(!left.has(v) && !right.has(v)){
        if(left.has(current)){
          right.add(v);
        }
        else if(right.has(current)){
          left.add(v);
        }
        stack.push(v);
      }
      else if(left.has(v) && left.has(current) || right.has(v) && right.has(current)){
        left = null;
        right = null;
        return;
      }
    }
  }
}

function sortVertexPositions(){
  let x = -50;
  let y = 0;
  for(let v of left){
    v.x = x;
    v.y = y;
    y += 25;
  }
  x = 50;
  y = 0;
  for(let v of right){
    v.x = x;
    v.y = y;
    y += 25;
  }
}

class Vertex{

  constructor(label, x, y){
    this.label = label;
    this.x = x;
    this.y = y;
  }

  show(){
    stroke(255);
    fill(255);
    ellipse(this.x, this.y, 10);
  }

}

class Graph{

  constructor(edges){
    this.edges = edges;
    this.vertices = this.findVertices(edges);
    this.neighbors = this.findNeighbors(edges);
  }

  show(){
    for(let edge of this.edges){
      edge[0].show();
      edge[1].show();
      stroke(255);
      line(edge[0].x, edge[0].y, edge[1].x, edge[1].y);
    }
  }

  findVertices(edges){
    let vertices = new Set();
    for(let i = 0; i < edges.length; i++){
      vertices.add(edges[i][0]);
      vertices.add(edges[i][1]);
    }
    return vertices;
  }

  findNeighbors(edges){
    let neighbors = {};
    for(let i = 0; i < edges.length; i++){
      let v1 = edges[i][0];
      let v2 = edges[i][1];

      if(neighbors[v1.label] == null){
        neighbors[v1.label] = new Set();
      }
      if(neighbors[v2.label] == null){
        neighbors[v2.label] = new Set();
      }
      neighbors[v1.label].add(v2);
      neighbors[v2.label].add(v1);
    }
    return neighbors;
  }

}
