var textGrid =
    "ABCDEFGH" +
    "IJKLMNOP" +
    "QRSTUVWX" +
    "YZ.,:;!?" +
    "01234567" +
    "89";

class Character {
  constructor(textContext, c) {
    this.image = textContext.canvas;
    this.cell = textGrid.indexOf(c.toUpperCase());
    if (this.cell < 0) throw Error("Character '" + c + "' is unavailable.");
    var gridX = this.cell % 8;
    var gridY = Math.floor(this.cell / 8);
    var cellWidth = this.image.width / 8;
    var cellHeight = this.image.height / 8;
    var cellX = gridX * cellWidth;
    var cellY = gridY * cellHeight;

    // Examine the character and restrict it to the narrowest box that contains
    // it.
    var cell = textContext.getImageData(cellX, cellY, cellWidth, cellHeight);
    var minX = cell.width, maxX = 0;
    for (var y = 0, yLimit = cell.height; y < yLimit; y++) {
      for (var x = 0, xLimit = cell.width; x < xLimit; x++) {
        var alpha = cell.data[4 * (xLimit * y + x) + 3];
        if (alpha == 0) continue;
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
      }
    }

    this.x = cellX + minX;
    this.y = cellY;
    this.width = maxX - minX;
    this.height = cellHeight;
    this.aspect = this.width / this.height;
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height,
                  0, 0, this.aspect, 1);
  }
}

class Font {
  constructor(image) {
    this.image = image;

    this.initialized = false;
    this.characters = {};

    if (this.image.complete) {
      this.initialize();
    } else {
      this.image.onload = () => this.initialize();
    }

    this.characterSpacing = 0.1;
    this.spaceWidth = 0.5;
  }

  initialize() {
    this.initialized = true;
    var canvas = document.createElement("canvas");
    canvas.width = this.image.width;
    canvas.height = this.image.height;
    var context = canvas.getContext("2d");
    context.drawImage(this.image, 0, 0);

    for (var i = 0, n = textGrid.length; i < n; i++) {
      this.characters[textGrid[i]] = new Character(context, textGrid[i]);
    }
  }

  widthOf(character) {
    if (!this.initialized) return 1;
    return c == " " ? this.spaceWidth : this.characters[c].aspect;
  }

  measure(message) {
    if (message.length == 0) return 0;
    var length = this.widthOf(message[0]);
    for (var i = 1, n = message.length; i < n; i++)
      length += this.characterSpacing + this.widthOf(message[i]);
    return length;
  }

  draw(ctx, message) {
    if (!this.initialized) return;
    ctx.save();
      for (var i = 0, n = message.length; i < n; i++) {
        if (message[i] == " ") {
          ctx.translate(this.spaceWidth + this.characterSpacing, 0);
          continue;
        }
        var c = this.characters[message[i]];
        c.draw(ctx);
        ctx.translate(c.aspect + this.characterSpacing, 0);
      }
    ctx.restore();
  }
}
