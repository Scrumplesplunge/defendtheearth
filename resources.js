function image(src) {
  var out = new Image();
  out.src = src;
  return out;
}

var images = {
  earth : image("earth.png"),
};
