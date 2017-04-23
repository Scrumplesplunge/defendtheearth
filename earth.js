class Earth extends PhysicsObject {
  constructor(position) {
    super(images.earth, position, Config.EARTH_RADIUS, Config.EARTH_MASS);
    this.angularVelocity = 0.05;
    this.destructable = true;
    this.health = 1000;
  }
}
