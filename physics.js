class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  static fromAngle(theta) {
    return new Vector(Math.cos(theta), Math.sin(theta));
  }

  toAngle() { return Math.atan2(this.y, this.x); }

  neg() { return new Vector(-this.x, -this.y); }
  add(v) { return new Vector(this.x + v.x, this.y + v.y); }
  sub(v) { return new Vector(this.x - v.x, this.y - v.y); }
  mul(s) { return new Vector(this.x * s, this.y * s); }
  div(s) { return new Vector(this.x / s, this.y / s); }
  dot(v) { return this.x * v.x + this.y * v.y; }
  len() { return Math.sqrt(this.dot(this)); }
  norm() { return this.div(this.len()); }

  rotate(theta) {
    var c = Math.cos(theta), s = Math.sin(theta);
    return new Vector(c * this.x - s * this.y, s * this.x + c * this.y);
  }
}

class PhysicsObject extends EventManager {
  constructor(image, position, radius, mass) {
    super();
    this.image = image;
    this.position = position;
    this.angle = 0;
    this.velocity = new Vector(0, 0);
    this.angularVelocity = 0;
    this.radius = radius;
    this.mass = mass;
    this.inertia = 0.5 * Math.PI * Math.pow(this.radius, 4);
    this.hittable = true;

    // This is set to null when the object has logically been removed from the
    // universe. This may happen before the object has physically been removed
    // from the list of objects in the Universe instance, but the universe will
    // pretend that it is not there until it is truly removed. Doing this allows
    // us to remove objects efficiently.
    this.universe = null;
  }

  draw(ctx) {
    var size = 2 * this.radius;
    drawSprite(ctx, this.image, this.position, this.angle, size, size);
  }

  update(dt) {
    this.position = this.position.add(this.velocity.mul(dt));
    this.angle = (this.angle + this.angularVelocity * dt) % (2 * Math.PI);
  }

  remove() { if (this.universe != null) this.universe.remove(this); }

  applyForce(v) { this.velocity = this.velocity.add(v.div(this.mass)); }
  applyTorque(t) { this.angularVelocity += t / this.inertia; }

  forward() { return Vector.fromAngle(this.angle - Math.PI / 2); }

  toLocal(v) { return v.sub(this.position).rotate(-this.angle); }
  fromLocal(v) { return v.rotate(this.angle).add(this.position); }
}

class Sprite extends PhysicsObject {
  constructor(image, position, velocity, radius, lifetime) {
    super(image, position, radius, 0.01);
    this.remainingLife = lifetime;
  }

  update(dt) {
    this.remainingLife -= dt;
    if (this.remainingLife > 0) {
      super.update(dt);
    } else {
      this.universe.remove(this);
    }
  }
}

class Universe {
  constructor() {
    this.objects = [];
  }

  add(object) { object.universe = this; this.objects.push(object); }
  remove(object) { object.universe = null; }

  draw(ctx) { this.objects.forEach(object => object.draw(ctx)); }

  update(dt) {
    // Update all objects, removing any which are no longer part of the
    // universe.
    var n = this.objects.length;
    var j = 0;
    for (var i = 0; i < n; i++) {
      var object = this.objects[i];
      if (object.universe != this) continue;  // Object has been removed.
      object.update(dt);
      this.objects[j++] = object;
    }
    this.objects.splice(j, n - j);
    n = j;

    // Resolve collisions.
    for (var i = 0; i < n; i++) {
      var a = this.objects[i];
      for (var j = i + 1; j < n; j++) {
        var b = this.objects[j];

        // Apply gravity.
        var offset = b.position.sub(a.position);
        var gravity = Config.GRAVITY * a.mass * b.mass / offset.dot(offset);
        var force = offset.norm().mul(gravity);
        a.applyForce(force);
        b.applyForce(force.neg());

        // Check for collisions.
        var centerDistance = offset.len();
        var contactDistance = a.radius + b.radius;
        if (centerDistance < contactDistance) {
          // Objects have collided.
          a.trigger({type: "collision", object: b});
          b.trigger({type: "collision", object: a});
          
          // Move the objects apart, using the mass to determine the amount
          // which each object moves. A heavy object will not move as much as
          // a light object. I'm not trying anything super-fancy for the
          // collision resolution, it just tries to avoid intersections.
          var movement = offset.mul(contactDistance / centerDistance - 1);
          var aMove = b.mass / (a.mass + b.mass);
          var bMove = a.mass / (a.mass + b.mass);
          a.position = a.position.sub(movement.mul(aMove));
          b.position = b.position.add(movement.mul(bMove));

          // Next, we want to remove all relative velocity in the direction of
          // the collision and try to conserve momentum. On the offchance that
          // we have negative relative velocity (because I did something stupid)
          // we will just pretend that the relative velocity is 0.
          var normal = offset.norm();
          var relativeVelocity =
              Math.max(0, a.velocity.dot(normal) - b.velocity.dot(normal));
          a.velocity = a.velocity.sub(normal.mul(relativeVelocity * aMove));
          b.velocity = b.velocity.add(normal.mul(relativeVelocity * bMove));
        }
      }
    }
  }
}
