function image(src) {
  var out = new Image();
  out.src = src;
  return out;
}

var images = {
  bullet: image("bullet.png"),
  earth: image("earth.png"),
  enemy: image("enemy.png"),
  flame: image("flame.png"),
  ship: image("ship.png"),
};
