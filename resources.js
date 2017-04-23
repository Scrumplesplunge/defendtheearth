function image(src) {
  var out = new Image();
  out.src = src;
  return out;
}

class Sound {
  constructor(file) {
    this.file = file;
    this.instances = [];
    this.inactiveInstances = [];
  }

  play() {
    if (this.inactiveInstances.length > 0) {
      this.inactiveInstances.pop().play();
    } else if (this.instances.length < Config.MAX_INSTANCES_PER_SOUND) {
      var a = new Audio(this.file);
      this.instances.push(a);
      a.addEventListener("ended", () => this.inactiveInstances.push(a));
      a.play();
    } else {
      console.log("Too many instances of " + this.file);
    }
  }

  repeat() {
    var a = new Audio(this.file);
    a.loop = true;
    a.play();
    return a;
  }

  create() { return new Audio(this.file) }
}

function sound(src) { return new Sound(src); }

var images = {
  arrow: image("arrow.png"),
  bullet: image("bullet.png"),
  earth: image("earth.png"),
  enemy: image("enemy.png"),
  flame: image("flame.png"),
  ship: image("ship.png"),
  text: image("text.png"),
  wreckage: [
    image("wreckage1.png"),
    image("wreckage2.png"),
    image("wreckage3.png"),
    image("wreckage4.png"),
    image("wreckage5.png"),
  ],
};

var sounds = {
  background: sound("background.ogg"),
  bullet: sound("bullet.mp3"),
  enemyActivate: sound("enemy_activate.mp3"),
  enemyDeactivate: sound("enemy_deactivate.mp3"),
  enemyBullet: sound("enemy_bullet.mp3"),
  explode: sound("explode.mp3"),
  gameOver: sound("game_over.mp3"),
  poof: sound("poof.mp3"),
  rocketLoop: sound("rocket_loop.mp3"),
};
