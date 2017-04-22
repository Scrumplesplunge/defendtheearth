var MouseButtons = {
  left: 1,
};

class Display {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.center = new Vector(0, 0);
    this.scale = 1;
    this.mousePosition = new Vector(0, 0);

    window.addEventListener("mousemove", event => this.handleMouseMove(event));
    window.addEventListener("wheel", event => this.handleMouseWheel(event));
  }

  clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  draw(callback) {
    this.context.save();
      this.context.translate(this.canvas.width / 2, this.canvas.height / 2);
      this.context.scale(this.scale, this.scale);
      this.context.translate(-this.center.x, -this.center.y);
      callback(this.context);
    this.context.restore();
  }

  handleMouseMove(event) {
    event.preventDefault();

    var mousePosition = new Vector(event.clientX, event.clientY);
    var leftButtonDown = ((event.buttons & MouseButtons.left) != 0);
    if (leftButtonDown) {
      var drag = mousePosition.sub(this.mousePosition);
      this.center = this.center.sub(drag.div(this.scale));
    }

    this.mousePosition = mousePosition;
  }

  handleMouseWheel(event) {
    event.preventDefault();

    this.scale *= Math.pow(0.5, event.deltaY / Config.SCROLL_PER_HALF_SCALE);
    if (this.scale < Config.MIN_SCALE) this.scale = Config.MIN_SCALE;
    if (this.scale > Config.MAX_SCALE) this.scale = Config.MAX_SCALE;
  }
}
