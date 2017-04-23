var canvas;
var display;
var font = new Font(images.text);
var soundtrack = sounds.background.repeat();

// Initialize the universe.
var universe = new Universe();
var earth = new Earth(new Vector(0, 0));
universe.add(earth);
var ship = new Ship(
    new Vector(Config.EARTH_RADIUS + Config.STARTING_ALTITUDE, 0));
universe.add(ship);

// Initialize enemies.
function addEnemy(config) {
  var startingDirection = Vector.fromAngle(random(-Math.PI, Math.PI));
  var startingOffset = startingDirection.mul(
      Config.EARTH_RADIUS + Config.ENEMY_STARTING_ALTITUDE);
  var startingPosition = earth.position.add(startingOffset);
  var enemy = new Enemy(startingPosition, config);
  universe.add(enemy);
}
for (var i = 0; i < 5; i++)
  addEnemy(new EnemyOptions().setSize(15));

// Compute the velocity required for the ship to be in a (roughly) circular
// orbit.
var a = Universe.gravity(earth, ship).len() / ship.mass;
ship.velocity.y = Math.sqrt(ship.position.x * a);
ship.angularVelocity = ship.velocity.y / ship.position.x;

// When the size of the browser window changes, update the dimensions of the
// canvas.
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  draw();
}

function info(ctx, object) {
  ctx.save();
    font.color = "#ffffff";
    var message = object.name.toUpperCase() + ": ";
    font.draw(ctx, message);
    ctx.translate(font.measure(message), 0);
    if (object.health <= 0) {
      font.color = "#ff0000";
      font.draw(ctx, "DESTROYED");
    } else {
      font.color = "#00ff00";
      font.draw(ctx, Math.ceil(object.health).toString());
    }
  ctx.restore();
}

// Redraw the state of the world without modifying anything.
function draw() {
  display.clear();
  display.draw(ctx => universe.draw(ctx));
  var ctx = display.context;
  ctx.save();
    ctx.translate(20, 20);
    ctx.scale(20, 20);
    info(ctx, earth);
    ctx.translate(0, 1);
    info(ctx, ship);
  ctx.restore();
  ctx.save();
    ctx.translate(display.canvas.width - 20, 20);
    ctx.scale(20, 20);
    ctx.translate(-1, 0);
    font.color = soundtrack.paused ? "#ff0000" : "#00ff00";
    font.draw(ctx, soundtrack.paused ? "|" : "<");
    var message = "MUSIC (M): ";
    ctx.translate(-font.measure(message), 0);
    font.color = "#ffffff";
    font.draw(ctx, message);
  ctx.restore();
}

window.addEventListener("keydown", function(event) {
  if (event.keyCode != Keys.M) return;
  if (soundtrack.paused) {
    soundtrack.play();
  } else {
    soundtrack.pause();
  }
});

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
