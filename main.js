var UPDATE_DELTA = 0.02;

var controls = {
  thrust: "w",
  jet_left: "a",
  jet_right: "d",
  jet_back: "s",
}

var canvas;
var context;

// Initialize the universe.
var universe = new Universe();
var earth = new PhysicsObject(images.earth, new Vector(300, 300), 50, 1e9);
earth.angularVelocity = 0.05;
universe.add(earth);
var ship = new Ship(new Vector(450, 300), {});
universe.add(ship);

function addBullets() {
  Bullet.fire(ship, ship.fromLocal(new Vector(-3, -8)), ship.forward(),
              Config.BULLET_SPRAY);
  Bullet.fire(ship, ship.fromLocal(new Vector(3, -8)), ship.forward(),
              Config.BULLET_SPRAY);
}

// When the size of the browser window changes, update the dimensions of the
// canvas.
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  draw();
}

// Redraw the state of the world without modifying anything.
function draw() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  universe.draw(context);
}

// Update the state of the world.
//var tick = 0;
function update() {
  universe.update(UPDATE_DELTA);
  //if (++tick % 3 == 0) addBullets();
  draw(context);
}

function main() {
  canvas = document.getElementById("screen");
  context = canvas.getContext("2d");
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  setInterval(update, 1000 * UPDATE_DELTA);
}

window.addEventListener("load", main);
