var canvas;
var context;

// When the size of the browser window changes, update the dimensions of the
// canvas.
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  draw();
}

// Redraw the state of the world without modifying anything.
function draw() {
  context.save();
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.translate(canvas.width / 2, canvas.height / 2);
    var t = Date.now() / 1000;
    context.translate(100 * Math.sin(t), 100 * Math.cos(t));
    context.fillRect(-25, -25, 50, 50);
  context.restore();
}

// Update the state of the world.
var tick = 0;
function update() {
  tick++;
  draw(context);
}

function main() {
  canvas = document.getElementById("screen");
  context = canvas.getContext("2d");
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  setInterval(update, 30);
}

window.addEventListener("load", main);
