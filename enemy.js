class EnemyOptions {
  constructor() {
    this.size = 20;
    this.speed = 100;
    this.health = 100;
    this.firingRate = 20;
    this.attackRange = 500;
    this.targets = [ship, earth];
  }

  setSize(x) { this.size = x; return this; }
  setSpeed(x) { this.speed = x; return this; }
  setHealth(x) { this.health = x; return this; }
  setFiringRate(x) { this.firingRate = x; return this; }
  setAttackRange(x) { this.attackRange = x; return this; }
  setTargets(targets) { this.targets = x; return this; }
}

class Wreckage extends PhysicsObject {
  constructor(position, radius) {
    var mass = 40 * radius * radius;
    super(images.wreckage.randomEntry(), position, radius, mass);
    this.destructable = true;
    this.health = 20;
  }
}

class Enemy extends PhysicsObject {
  constructor(position, options) {
    var radius = options.size, mass = 40 * options.size * options.size;
    super(images.enemy, position, radius, mass);
    this.speed = options.speed;
    this.health = options.health;
    this.targets = options.targets;
    this.firing = false;
    this.firingRate = options.firingRate;
    this.firingAngle = -Math.PI / 2;
    this.attackRange = options.attackRange;
    this.destructable = true;

    this.on("destroyed", event => this.handleDestroyed(event));
  }

  update(dt) {
    var target = null;
    var targetOffset = new Vector(1, 0);
    for (var i = 0, n = this.targets.length; i < n; i++) {
      targetOffset = this.targets[i].position.sub(this.position);
      if (targetOffset.len() > this.attackRange) continue;
      var result = this.universe.cast(this.position, targetOffset,
                                      object => object.hittable);
      if (result.object == this.targets[i]) {
        target = this.targets[i];
        break;
      }
    }
    this.firing = (target != null);
    this.firingAngle = targetOffset.toAngle();

    // Update the angular velocity.
    var targetAngularVelocity;
    if (this.firing) {
      targetAngularVelocity =
          this.firingRate * 2 * Math.PI / Config.ENEMY_LASERS;
    } else {
      targetAngularVelocity = Config.ENEMY_IDLE_SPIN_RATE;
    }
    var angularVelocityOffset = targetAngularVelocity - this.angularVelocity;
    var angularAccel = clamp(angularVelocityOffset * dt,
                             -Config.ENEMY_SPIN_DOWN_RATE * dt,
                             Config.ENEMY_SPIN_UP_RATE * dt);
    this.angularVelocity += angularAccel;

    // Fire bullets if necessary.
    var phase = () => Math.floor(Config.ENEMY_LASERS *
                                 angnorm(this.angle - this.firingAngle) /
                                 TWO_PI);
    var before = phase();
    super.update(dt)
    var after = phase();
    
    if (before != after && this.firing) {
      var direction = Vector.fromAngle(this.firingAngle);
      Bullet.fire(this, this.position.add(direction.mul(this.radius)),
                  direction, Config.ENEMY_BULLET_SPRAY);
    }
  }

  handleDestroyed(event) {
    sounds.explode.play();

    for (var i = 0; i < 5; i++) {
      var angle = 2 * Math.PI * i / 5;
      var offset = Vector.fromAngle(angle).mul(this.radius * 0.5);
      var wreckage = new Wreckage(this.position.add(offset), this.radius * 0.5);
      var relativeVelocity = offset.mul(random(0, Config.MAX_EXPLOSION_SPEED));
      wreckage.velocity = this.velocity.add(relativeVelocity);
      wreckage.angularVelocity =
          random(-Config.MAX_EXPLOSION_SPEED, Config.MAX_EXPLOSION_SPEED);
      this.universe.add(wreckage);
    }
  }
}
