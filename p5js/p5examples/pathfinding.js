let CELL_SIZE = 32;
let mainGrid;

let frontier;
let start;
let goal;
let visited;

let searchFinished = false;
let beginSearch = false;

function setup() {
  var cnv = createCanvas(window.innerWidth, window.innerHeight);
  cnv.style('display', 'block');
  background(0);

  mainGrid = new Matrix();
  start = mainGrid.cells[0];
  goal = mainGrid.cells[mainGrid.width * mainGrid.height - 1];
  frontier = new PriorityQueue((a, b) => a[1] > b[1]);
  frontier.push([start, 0]);
  visited = [];
  visited[0] = true;
}

function draw() {
  background(0);
  mainGrid.show();
  push();
  stroke(255);
  strokeWeight(7);
  textAlign(CENTER);
  text("Click and drag to create obstacles. Press SPACE to begin pathfinding. Press R to reset.", width/2, 20);
  pop();

  if(beginSearch == true && !searchFinished){
    searchFinished = search();
  }
}

function keyPressed(){
  if(keyCode == 32){
    beginSearch = true;
  }
  if(keyCode == 82){
    mainGrid = new Matrix();
    start = mainGrid.cells[0];
    goal = mainGrid.cells[mainGrid.width * mainGrid.height - 1];
    frontier = new PriorityQueue((a, b) => a[1] > b[1]);
    frontier.push([start, 0]);
    visited = [];
    visited[0] = true;
    beginSearch = false;
    searchFinished = false;
  }
}

function mouseDragged(){
  let x = floor(mouseX / CELL_SIZE);
  let y = floor(mouseY / CELL_SIZE);
  let index = x + (y * mainGrid.width);
  mainGrid.cells[index].enabled = false;
  mainGrid.cells[index].color = color(0, 0, 0);
}

function search(){
  current = frontier.pop()[0];
  current.color = color(255, 0, 0);

  if(current == goal){
    current.color = color(0, 0, 255);
    current.show();
    return 1;
  }

  for(let neighbor of current.neighbors){
    let next = mainGrid.cells[neighbor];
    if(visited[neighbor] != true && next.enabled){
      frontier.push([next, -heuristic(next, goal)]);
      //console.log(heuristic(next, goal));
      visited[neighbor] = true;
      next.color = color(0, 255, 0);
    }
  }

  return 0;
}

function heuristic(a, b){
  //return abs(a.x - b.x) + abs(a.y - b.y);
  return dist(a.x, a.y, b.x, b.y);
}

class Cell{
  constructor(x, y, index){
    this.x = x;
    this.y = y;
    this.index = index;
    this.color = color(255, 255, 255);
    this.neighbors = [];
    this.enabled = true;
  }

  show(){
    push();
    strokeWeight(1);
    stroke(0);
    fill(this.color);
    rect(this.x, this.y, CELL_SIZE, CELL_SIZE);
    pop();
  }
}

class Matrix{
  constructor(){
    this.cells = [];

    this.width = floor(width / CELL_SIZE);
    this.height = floor(height / CELL_SIZE);

    let cellCount = 0;
    for(let i = 0; i < this.height; i++){
      for(let j = 0; j < this.width; j++){
        this.cells.push(new Cell(j*CELL_SIZE, i*CELL_SIZE, cellCount));
        cellCount++;
      }
    }

    this.buildNeighbors();
  }

  show(){
    for(let cell of this.cells){
      cell.show();
    }
  }

  buildNeighbors(){
    let cellCount = 0;
    for(let i = 0; i < this.width; i++){
      for(let j = 0; j < this.height; j++){
        this.cells[cellCount].neighbors = [];

        let curCol = cellCount % this.width;
        if(curCol > 0){
          this.cells[cellCount].neighbors.push(cellCount - 1);
        }
        if(curCol < this.width - 1){
          this.cells[cellCount].neighbors.push(cellCount + 1);
        }
        if(cellCount - this.width >= 0){
          this.cells[cellCount].neighbors.push(cellCount - this.width);
        }
        if(cellCount + this.width <= (this.width * this.height) - 1){
          this.cells[cellCount].neighbors.push(cellCount + this.width);
        }
        cellCount++;
      }
    }
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//                      Priority Queue implementation created by vaxquis.                               //
// https://stackoverflow.com/questions/42919469/efficient-way-to-implement-priority-queue-in-javascript //
//////////////////////////////////////////////////////////////////////////////////////////////////////////

const top_a = 0;
const parent = i => ((i + 1) >>> 1) - 1;
const left = i => (i << 1) + 1;
const right = i => (i + 1) << 1;

class PriorityQueue {
  constructor(comparator = (a, b) => a > b) {
    this._heap = [];
    this._comparator = comparator;
  }
  size() {
    return this._heap.length;
  }
  isEmpty() {
    return this.size() == 0;
  }
  peek() {
    return this._heap[top_a];
  }
  push(...values) {
    values.forEach(value => {
      this._heap.push(value);
      this._siftUp();
    });
    return this.size();
  }
  pop() {
    const poppedValue = this.peek();
    const bottom = this.size() - 1;
    if (bottom > top_a) {
      this._swap(top_a, bottom);
    }
    this._heap.pop();
    this._siftDown();
    return poppedValue;
  }
  replace(value) {
    const replacedValue = this.peek();
    this._heap[top_a] = value;
    this._siftDown();
    return replacedValue;
  }
  _greater(i, j) {
    return this._comparator(this._heap[i], this._heap[j]);
  }
  _swap(i, j) {
    [this._heap[i], this._heap[j]] = [this._heap[j], this._heap[i]];
  }
  _siftUp() {
    let node = this.size() - 1;
    while (node > top_a && this._greater(node, parent(node))) {
      this._swap(node, parent(node));
      node = parent(node);
    }
  }
  _siftDown() {
    let node = top_a;
    while (
      (left(node) < this.size() && this._greater(left(node), node)) ||
      (right(node) < this.size() && this._greater(right(node), node))
    ) {
      let maxChild = (right(node) < this.size() && this._greater(right(node), left(node))) ? right(node) : left(node);
      this._swap(node, maxChild);
      node = maxChild;
    }
  }
}