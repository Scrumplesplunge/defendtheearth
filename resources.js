function image(src) {
  var out = new Image();
  out.src = src;
  return out;
}

class Sound{
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
}

function sound(src) { return new Sound(src); }

var images = {
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
  bullet: sound("bullet.mp3"),
  explode: sound("explode.mp3"),
};
