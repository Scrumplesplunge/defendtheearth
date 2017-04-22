var UPDATE_DELTA = 0.03;

var canvas;
var context;

// Initialize the universe.
var universe = new Universe();
var earth = new PhysicsObject(images.earth, new Vector(300, 300), 100, 1000);
universe.add(earth);
var ship = new PhysicsObject(images.ship, new Vector(450, 300), 10, 1);
universe.add(ship);

var bullets = [];
var MAX_BULLETS = 100;
var oldest = 0;
function addBullet(bullet) {
  universe.add(bullet);
  if (bullets.length < MAX_BULLETS) {
    bullets.push(bullet);
  } else {
    universe.remove(bullets[oldest]);
    bullets[oldest] = bullet;
    oldest = (oldest + 1) % MAX_BULLETS;
  }
}

function addBullets() {
  var leftBullet = new PhysicsObject(
      images.bullet, ship.fromLocal(new Vector(-3, -8)), 2, 1);
  var rightBullet = new PhysicsObject(
      images.bullet, ship.fromLocal(new Vector(3, -8)), 2, 1);
  leftBullet.velocity.y = -500;
  rightBullet.velocity.y = -500;

  addBullet(leftBullet);
  addBullet(rightBullet);
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
var tick = 0;
function update() {
  universe.update(UPDATE_DELTA);
  if (++tick % 3 == 0) addBullets();
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
