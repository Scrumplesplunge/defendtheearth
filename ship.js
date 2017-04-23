var leftGunOffset = new Vector(8, -2.5);
var rightGunOffset = new Vector(8, 2.5);
var leftEngineOffset = new Vector(-6, -2.5);
var rightEngineOffset = new Vector(-6, 2.5);

var RotationMode = {
  MOUSE: 0,
  FREE: 1,
  STABLE: 2,
};

class Ship extends PhysicsObject {
  constructor(position) {
    super(images.ship, position, 10, 1e3);
    this.thrust = 0;
    this.turn = 0;
    this.firing = false;
    this.rotationMode = RotationMode.MOUSE;
    this.bulletDelay = 0;
    this.engineSound = sounds.rocketLoop.create();

    window.addEventListener("keydown", event => this.handleKeyDown(event));
    window.addEventListener("keyup", event => this.handleKeyUp(event));
    window.addEventListener("mousedown", event => this.updateMouseState(event));
    window.addEventListener("mouseup", event => this.updateMouseState(event));
  }

  draw(ctx) {
    super.draw(ctx);
    if (this.thrust > 0) {
      var size = random(8, 12);

      // Draw the left thruster.
      ctx.save();
        var position = this.fromLocal(leftEngineOffset);
        ctx.translate(position.x, position.y);
        ctx.rotate(this.angle + random(-0.1, 0.1));
        ctx.drawImage(images.flame, -size, -0.5 * size, size, size);
      ctx.restore();

      // Draw the right thruster.
      ctx.save();
        var position = this.fromLocal(rightEngineOffset);
        ctx.translate(position.x, position.y);
        ctx.rotate(this.angle + random(-0.1, 0.1));
        ctx.drawImage(images.flame, -size, -0.5 * size, size, size);
      ctx.restore();
    }
  }

  update(dt) {
    super.update(dt);

    // Handle movement controls.
    this.applyImpulse(
        this.forward().mul(Config.SHIP_FORCE * this.thrust * dt));

    switch (this.rotationMode) {
      case RotationMode.MOUSE:
        // Ship will always face the mouse.
        var mousePosition = display.fromScreen(display.mousePosition);
        this.angle = mousePosition.sub(this.position).toAngle();
        break;
      case RotationMode.STABLE:
        // Rotation controls will affect angular velocity directly.
        var damping = Math.pow(Config.DAMPING_RATE, Config.UPDATE_DELTA);
        var target = Config.ROTATE_SPEED * this.turn;
        this.angularVelocity = damping * this.angularVelocity + target;
        break;
      case RotationMode.FREE:
        // Rotation controls will affect angular acceleration.
        this.applyAngularImpulse(Config.SHIP_TORQUE * this.turn * dt);
        break;
    }

    // Handle gunfire.
    if (this.firing) {
      this.bulletDelay -= dt;
      if (this.bulletDelay <= 0) {
        sounds.bullet.play();
        var leftGun = this.fromLocal(leftGunOffset);
        var rightGun = this.fromLocal(rightGunOffset);
        Bullet.fire(this, rightGun, this.forward(), Config.SHIP_BULLET_SPRAY);
        Bullet.fire(this, leftGun, this.forward(), Config.SHIP_BULLET_SPRAY);
        this.bulletDelay += 1 / Config.SHIP_FIRING_RATE;
      }
    }
  }

  handleKeyDown(event) {
    switch (event.keyCode) {
      case Keys.W: this.thrust = 1; this.engineSound.play(); break;
      case Keys.A: this.turn = -1; break;
      case Keys.D: this.turn = 1; break;
    }
  }

  handleKeyUp(event) {
    switch (event.keyCode) {
      case Keys.W: this.thrust = 0; this.engineSound.pause(); break;
      case Keys.A: this.turn = 0; break;
      case Keys.D: this.turn = 0; break;
    }
  }

  updateMouseState(event) {
    this.firing = (event.buttons & MouseButtons.LEFT);
  }
}
