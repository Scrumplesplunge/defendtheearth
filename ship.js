var Keys = {
  W: 87,
  A: 65,
  S: 83,
  D: 68,
  SPACE: 32,
};

var leftGunOffset = new Vector(-3, -8);
var rightGunOffset = new Vector(3, -8);

class Ship extends PhysicsObject {
  constructor(position) {
    super(images.ship, position, 10, 1e3);
    this.thrust = 0;
    this.turn = 0;
    this.firing = false;
    this.bulletDelay = 0;

    window.addEventListener("keydown", event => this.handleKeyDown(event));
    window.addEventListener("keyup", event => this.handleKeyUp(event));
  }

  draw(ctx) {
    super.draw(ctx);
    if (this.thrust > 0) {
      var size = random(8, 12);

      // Draw the left thruster.
      var angle = this.angle + random(-0.1, 0.1);
      var position = this.fromLocal(new Vector(-2, 10));
      ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.angle);
        ctx.translate(-2, 6);
        ctx.drawImage(images.flame, -0.5 * size, 0, size, size);
      ctx.restore();

      // Draw the right thruster.
      var angle = this.angle + random(-0.1, 0.1);
      var position = this.fromLocal(new Vector(2, 10));
      ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.angle);
        ctx.translate(2, 6);
        ctx.drawImage(images.flame, -0.5 * size, 0, size, size);
      ctx.restore();
    }
  }

  update(dt) {
    // Handle movement controls.
    this.applyForce(this.forward().mul(Config.ENGINE_FORCE * this.thrust));
    var damping = Math.pow(Config.DAMPING_RATE, Config.UPDATE_DELTA);
    var target = Config.ROTATE_SPEED * this.turn;
    this.angularVelocity = damping * this.angularVelocity + target;

    // Handle gunfire.
    if (this.firing) {
      this.bulletDelay -= dt;
      if (this.bulletDelay <= 0) {
        console.log("pew");
        var leftGun = this.fromLocal(leftGunOffset);
        var rightGun = this.fromLocal(rightGunOffset);
        Bullet.fire(this, rightGun, this.forward(), Config.BULLET_SPRAY);
        Bullet.fire(this, leftGun, this.forward(), Config.BULLET_SPRAY);
        this.bulletDelay += Config.BULLET_DELAY;
      }
    }

    super.update(dt);
  }

  handleKeyDown(event) {
    switch (event.keyCode) {
      case Keys.W: this.thrust = 1; break;
      case Keys.A: this.turn = -1; break;
      case Keys.D: this.turn = 1; break;
      case Keys.SPACE: this.firing = true; break;
    }
  }

  handleKeyUp(event) {
    switch (event.keyCode) {
      case Keys.W: this.thrust = 0; break;
      case Keys.A: this.turn = 0; break;
      case Keys.D: this.turn = 0; break;
      case Keys.SPACE: this.firing = false; break;
    }
  }
}
