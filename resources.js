function image(src) {
  var out = new Image();
  out.src = src;
  return out;
}

var images = {
  bullet: image("bullet.png"),
  earth: image("earth.png"),
  ship: image("ship.png"),
};
