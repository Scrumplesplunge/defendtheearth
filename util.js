// Return a random value in the range [a, b).
function random(a, b) { return a + Math.random() * (b - a); }

// Draw an image on the canvas which is centered at the given position.
function drawSprite(ctx, image, position, angle, w, h) {
  ctx.save();
    ctx.translate(position.x, position.y);
    ctx.rotate(angle);
    ctx.drawImage(image, -0.5 * w, -0.5 * h, w, h);
  ctx.restore();
}
