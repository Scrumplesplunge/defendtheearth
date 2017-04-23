var canvas;
var display;
var font = new Font(images.text);

// Initialize the universe.
var universe = new Universe();
var earth = new PhysicsObject(
    images.earth, new Vector(0, 0), Config.EARTH_RADIUS, Config.EARTH_MASS);
earth.angularVelocity = 0.05;
universe.add(earth);
var ship = new Ship(
    new Vector(Config.EARTH_RADIUS + 2 * Config.STARTING_ALTITUDE, 0));
universe.add(ship);
var enemy = new Enemy(
    new Vector(-Config.EARTH_RADIUS - Config.STARTING_ALTITUDE, 0),
    new EnemyOptions());
universe.add(enemy);

// Compute the velocity required for the ship to be in a (roughly) circular
// orbit.
var a = Universe.gravity(earth, ship).len() / ship.mass;
ship.velocity.y = Math.sqrt(ship.position.x * a);
ship.angularVelocity = ship.velocity.y / ship.position.x;

var a = Universe.gravity(earth, enemy).len() / enemy.mass;
enemy.velocity.y = Math.sqrt(ship.position.x * a);

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
  var ctx = display.context;
  ctx.save();
    ctx.translate(50, 50);
    ctx.scale(20, 20);
    font.draw(ctx, "THIS IS SOME TEXT!");
  ctx.restore();
}

// Update the state of the world.
function update() {
  display.update(Config.UPDATE_DELTA);
  universe.update(Config.UPDATE_DELTA);
  draw();
}

function main() {
  canvas = document.getElementById("screen");
  display = new Display(canvas);
  display.target = ship;

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  setInterval(update, 1000 * Config.UPDATE_DELTA);
}

window.addEventListener("load", main);
