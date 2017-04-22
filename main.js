var UPDATE_DELTA = 0.02;

var controls = {
  thrust: "w",
  jet_left: "a",
  jet_right: "d",
  jet_back: "s",
}

var canvas;
var display;

// Initialize the universe.
var universe = new Universe();
var earth = new PhysicsObject(images.earth, new Vector(0, 0), 50, 1e9);
earth.angularVelocity = 0.05;
universe.add(earth);
var ship = new Ship(new Vector(150, 0), {});
universe.add(ship);

// When the size of the browser window changes, update the dimensions of the
// canvas.
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  draw();
}

// Redraw the state of the world without modifying anything.
function draw() {
  display.clear();
  display.draw(ctx => universe.draw(ctx));
}

// Update the state of the world.
function update() {
  universe.update(UPDATE_DELTA);
  draw();
}

function main() {
  canvas = document.getElementById("screen");
  display = new Display(canvas);

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  setInterval(update, 1000 * UPDATE_DELTA);
}

window.addEventListener("load", main);
