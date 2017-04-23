var RepairState = {
  HEALTHY: 0,
  DAMAGE_COOLDOWN: 1,
  REPAIRING: 2,
};

class Earth extends PhysicsObject {
  constructor(position) {
    super(images.earth, position, Config.EARTH_RADIUS, Config.EARTH_MASS);
    this.name = "Planet Earth";
    this.angularVelocity = 0.05;
    this.destructable = true;
    this.health = Config.EARTH_HEALTH;
    this.repairState = RepairState.HEALTHY;
    this.rechargeDelay = 0;
  }

  update(dt) {
    super.update(dt);

    this.repairDelay -= dt;
    if (this.health < Config.EARTH_HEALTH && this.repairDelay <= 0) {
      this.health += Config.EARTH_REPAIR_STEP;
      this.repairDelay = Config.EARTH_REPAIR_DELAY;
      if (this.health >= Config.EARTH_HEALTH) {
        this.health = Config.EARTH_HEALTH;
        this.repairState = RepairState.HEALTHY;
      } else {
        this.repairState = RepairState.REPAIRING;
      }
    }
  }

  showInfo(ctx, font) {
    ctx.save();
      font.color = "#ffffff";
      ctx.translate(font.drawAndMeasure(ctx, this.name + ": "), 0);
      var message = Math.ceil(this.health) + " HP";
      if (this.health <= 0) {
        font.color = "#ff0000";
        message = "DESTROYED";
      } else {
        switch (this.repairState) {
          case RepairState.HEALTHY: font.color = "#ffffff"; break;
          case RepairState.DAMAGE_COOLDOWN: font.color = "#ff0000"; break;
          case RepairState.REPAIRING: font.color = "#00ff00"; break;
        }
      }
      font.draw(ctx, message);
    ctx.restore();
  }

  damage(x) {
    super.damage(x);
    this.repairState = RepairState.DAMAGE_COOLDOWN;
    this.repairDelay = Config.EARTH_REPAIR_COOLDOWN;
  }
}
