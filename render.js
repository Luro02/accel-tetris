import { ColorTheme } from "./themes.js";

const gridWidth = 10;
const gridHeight = 20;

const canvas = document.getElementById("board");
const sideCanvas = document.getElementById("preview");
const ctx = canvas.getContext("2d");
const sctx = sideCanvas.getContext("2d");

const cubeWidth = canvas.width / gridWidth;
const cubeHeight = canvas.height / gridHeight;
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

// This goes through all themes, all pieces and their layouts to find the largest piece size.
//
// This is later used to determine the padding for the preview of the next piece.
const largestElementSize = ColorTheme.all
  .flatMap((theme) => theme.pieces)
  .map((piece) => piece.layout)
  .flatMap((layout) => [layout.length, ...layout.map((row) => row.length)])
  .reduce((a, b) => Math.max(a, b), 1);
const previewPadding = 0.2; // in percent of the cube width/height

const levelChangeThreshold = 1000;

class Board {
  constructor(theme = ColorTheme.Default) {
    this.applyTheme(theme);
    this.reset();

    this.level = 0;
  }

  applyTheme(theme) {
    this.theme = theme;

    document.body.style.background = theme.pageBackground;
    document.body.style.color = theme.textColor;
    canvas.style.background = theme.boardBackground;
    sideCanvas.style.background = theme.sidebarBackground;
    document.getElementById("side-bar").style.background =
      this.theme.sidebarBackground;
  }

  switchTheme() {
    // Choose a random theme different from the current one
    let theme = this.theme;
    while (theme === this.theme && ColorTheme.all.length > 1) {
      theme = ColorTheme.all[Math.floor(Math.random() * ColorTheme.all.length)];
    }

    this.applyTheme(theme);
    let score = this.score;
    let level = this.level;
    // Randomly reset the board, should reduce frustration
    if (Math.random() < 0.45) {
      this.reset();
    }
    this.level = level + 1;
    this.score = score;
  }

  reset() {
    this.grid = Array.from({ length: gridHeight }, () =>
      Array(gridWidth).fill(null),
    );

    this.element = null;
    this._nextElement = null;
    this.level = 0;
    this.score = 0;

    // This will initialize the _nextElement
    this.nextElement();
    // and this call will set the first element
    this.nextElement();
  }

  nextElement() {
    // If the current element is not null, this attribute will contain the next element
    if (this.element != null) {
      return this._nextElement;
    }

    // If it is null, we need to generate a new piece and set the next piece
    // to be the current piece.

    let result = this._nextElement;
    // Choose a random piece
    let piece =
      this.theme.pieces[Math.floor(Math.random() * this.theme.pieces.length)];
    this._nextElement = new Element(
      gridWidth / 2 - 1,
      0,
      piece.layout,
      piece.color,
    );

    if (result == null) {
      return null;
    }

    this.element = result;
    return this.element;
  }

  dropDownElement() {
    if (this.element == null) {
      return;
    }

    let dropY = this.elementDropY();

    if (dropY > 0) {
      this.score += dropY * 2;
    }

    this.moveElement(0, dropY);
  }

  /// This function determines how much the element must move in the y direction (= dy)
  /// To land on the lowest possible position which could be the floor or on top of another
  /// piece.
  elementDropY() {
    if (this.element == null) {
      return null;
    }

    // To find the drop Y, we keep increasing dropY until a collision would occur
    let dropY = 0;
    while (!this.collides(0, dropY + 1)) {
      dropY += 1;
    }

    return dropY;
  }

  collides(dx, dy) {
    for (let coordinate of this.element.coordinates().map((coord) => ({
      x: coord.x + dx,
      y: coord.y + dy,
    }))) {
      // Check if any coordinate is out of bounds
      if (
        coordinate.x < 0 ||
        coordinate.x >= gridWidth ||
        coordinate.y < 0 ||
        coordinate.y >= gridHeight
      ) {
        return true;
      }

      // Check if the grid cell is already occupied
      if (this.grid[coordinate.y][coordinate.x] != null) {
        return true;
      }
    }

    return false;
  }

  /// Moves the element by dx and dy.
  moveElement(dx, dy) {
    // If there is nothing to move or no movement requested, there is nothing to do here
    if (this.element == null || (dx === 0 && dy === 0)) {
      return;
    }

    // this.element.x + dx >= 0
    // -> dx >= -this.element.x
    console.log(
      `Attempting to move element from (${this.element.x}, ${this.element.y}) to (${this.element.x + dx}, ${this.element.y + dy})`,
    );

    // Adjust dx to ensure it doesn't go out of bounds.
    //
    // Only dx is adjusted, because if the y reaches the floor or collides,
    // the piece must be locked in place. If it were adjusted to always be within bounds,
    // the piece would "float" and never lock in place.
    dx = Math.min(
      Math.max(dx, -this.element.x),
      gridWidth - this.element.x - this.element.maxWidth,
    );

    console.log(`Adjusted movement to dx=${dx}, dy=${dy}`);

    // It could be that the element will collide with a different piece or the floor.
    //
    // This checks if a collision would occur, locking the piece in place if so.
    if (this.collides(dx, dy)) {
      console.log("Element will collide when moved down, locking in place");
      // Lock the element in place
      for (let coord of this.element.coordinates()) {
        this.grid[coord.y][coord.x] = this.element.color;
      }

      this.score += 10; // update score for successfully placing a piece

      this.element = null;
      this.clearLines();

      // Element has collided or isn't present
      // -> spawn the next element
      this.nextElement();

      // If the new element that is spawned at the top already collides,
      // the game is over, because you can't move the new piece
      if (this.collides(0, 0)) {
        alert("Game Over!");
        this.reset();
      }

      return;
    }

    this.element.move(dx, dy);

    console.log(
      `Moved element to (${this.element.x}, ${this.element.y}), should be at (${this.element.x + dx}, ${this.element.y + dy})`,
    );
  }

  clearLines() {
    let lines = 0;
    // Now check if any rows are complete
    for (let y = 0; y < gridHeight; y++) {
      let isComplete = true;

      for (let x = 0; x < gridWidth; x++) {
        if (this.grid[y][x] == null) {
          isComplete = false;
          break;
        }
      }

      if (isComplete) {
        lines += 1;
        // Remove this row and move everything above it down
        for (let ty = y; ty > 0; ty--) {
          this.grid[ty] = [...this.grid[ty - 1]];
        }

        // Clear the top row
        this.grid[0] = [...Array.apply(0, Array(gridWidth))];
      }
    }

    if (lines > 0) {
      this.score += lines * 100;
    }

    return lines;
  }

  render() {
    if (this.score >= levelChangeThreshold * (this.level + 1)) {
      this.switchTheme();
    }

    this.drawBoard();
    this.renderSideBoard();

    if (this.element == null) {
      return;
    }

    // Draw the element on the board
    ctx.beginPath();
    for (let coord of this.element.coordinates()) {
      this.drawGridBlock(coord.x, coord.y, this.element.color);
    }
    ctx.closePath();

    // In addition to that, render where the element would land
    let dropY = this.elementDropY();

    ctx.beginPath();

    for (let coord of this.element.coordinates()) {
      this.drawGridBlock(
        coord.x,
        coord.y + dropY,
        this.element.color + this.theme.previewTransparency,
      );
    }
    ctx.closePath();
  }

  drawBoard() {
    const width = canvasWidth;
    const height = canvasHeight;

    ctx.fillStyle = this.theme.boardBackground;
    ctx.fillRect(0, 0, width, height);

    // Draw the grid lines
    ctx.strokeStyle = this.theme.boardGrid;
    ctx.lineWidth = 1;

    // Vertical lines
    for (let x = 0; x <= width; x += cubeWidth) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y <= height; y += cubeHeight) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw the existing blocks on the board
    ctx.beginPath();
    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        if (this.grid[y][x] == null) {
          continue;
        }

        this.drawGridBlock(x, y, this.grid[y][x]);
      }
    }
    ctx.closePath();
  }

  drawGridBlock(x, y, color) {
    this.drawBlock(
      ctx,
      x * cubeWidth,
      y * cubeHeight,
      cubeWidth,
      cubeHeight,
      color,
    );
  }

  drawBlock(context, drawX, drawY, cubeWidth, cubeHeight, color) {
    // First draw the main block in the given color
    context.fillStyle = color;
    context.fillRect(drawX, drawY, cubeWidth, cubeHeight);

    // Then the light shade on the top and left
    const shadowOffset = Math.floor(0.15 * cubeWidth);

    context.fillStyle = this.theme.blockShadowTop;
    context.fillRect(drawX, drawY, shadowOffset, cubeHeight);
    context.fillRect(drawX, drawY, shadowOffset, cubeHeight);

    // And a darker shadow on the bottom and right
    context.fillStyle = this.theme.blockShadowBottom;
    context.fillRect(
      drawX,
      drawY + cubeHeight - shadowOffset,
      cubeWidth,
      shadowOffset,
    );
    context.fillRect(
      drawX + cubeWidth - shadowOffset,
      drawY,
      shadowOffset,
      cubeHeight,
    );
  }

  renderSideBoard() {
    const sideCanvasWidth = sideCanvas.getBoundingClientRect().width;
    const sideCanvasHeight = sideCanvas.getBoundingClientRect().height;

    const sctx = sideCanvas.getContext("2d");

    // Do background color
    sctx.fillStyle = this.theme.sidebarBackground;
    sctx.fillRect(0, 0, sideCanvasWidth, sideCanvasHeight);

    document.getElementById("score-value").innerText = this.score;

    this.renderPreview();
  }

  renderPreview() {
    let nextElement = this.nextElement();

    const previewWidth =
      (sideCanvas.width - 2 * previewPadding * cubeWidth) / largestElementSize;
    const previewHeight =
      (sideCanvas.height - 2 * previewPadding * cubeHeight) /
      largestElementSize;
    const startX = (sideCanvas.width - nextElement.maxWidth * previewWidth) / 2;
    const startY =
      (sideCanvas.height - nextElement.maxHeight * previewHeight) / 2;

    // And this will draw the next piece
    for (var coord of nextElement.coordinates()) {
      this.drawBlock(
        sctx,
        startX + (coord.x - nextElement.x) * previewWidth,
        startY + (coord.y - nextElement.y) * previewHeight,
        previewWidth,
        previewHeight,
        nextElement.color,
      );
    }
  }
}

class Element {
  constructor(x, y, piece, color) {
    this.x = x;
    this.y = y;
    this.piece = piece;
    this.maxWidth = piece[0].length;
    this.maxHeight = piece.length;
    this.color = color;
  }

  move(dx, dy) {
    // This should ensure the element stays within bounds
    this.x = Math.max(0, Math.min(gridWidth - this.maxWidth, this.x + dx));
    this.y = Math.max(0, Math.min(gridHeight - this.maxHeight, this.y + dy));
  }

  coordinates() {
    // Returns the coordinates occupied by this element
    let coords = [];

    for (let y = 0; y < this.piece.length; y++) {
      for (let x = 0; x < this.piece[0].length; x++) {
        if (this.piece[y][x]) {
          coords.push({ x: this.x + x, y: this.y + y });
        }
      }
    }

    return coords;
  }
}

let board = new Board(ColorTheme.DarkBlue);

let lastdx = 0;
let lastdy = 0;

let dx = 0;
let dtx = 500;
let dy = 1;
let dty = 500;

/// The main loop that is called to render the game:
function draw(timestamp) {
  // in milliseconds
  const elapsedDx = timestamp - lastdx;
  const elapsedDy = timestamp - lastdy;

  let moveX = 0;
  let moveY = 0;
  if (elapsedDx > dtx) {
    lastdx = timestamp;
    moveX = dx;
  }

  if (elapsedDy > dty) {
    lastdy = timestamp;
    moveY = dy;
  }

  // TODO: uncomment
  //board.moveElement(moveX, moveY);
  board.render();
  requestAnimationFrame(draw);
}

requestAnimationFrame(draw);

var lastUpdate = 0;
if (DeviceOrientationEvent) {
  window.addEventListener(
    "deviceorientation",
    function (event) {
      event.preventDefault();
      if (event.timeStamp - lastUpdate < 250) {
        return;
      }

      // Use gamma to move the piece left or right
      let previousDx = dx;

      if (Math.abs(event.gamma) < 15) {
        dx = 0;
        dtx = 1000;
      } else {
        dx = event.gamma > 0 ? 1 : -1;

        dtx = 1000 / Math.abs((event.gamma || 0) / 12);
      }

      if (dx != 0) {
        dty = 1000; // slow down drop speed while moving
      }

      // only adjust drop speed if device is not moving left or right
      if (event.beta != null && dx == 0) {
        if (event.beta <= 20) {
          dty = 1000;
        } else if (event.beta <= 30) {
          dty = 500;
        } else if (event.beta <= 40) {
          dty = 300;
        } else {
          dty = 100;
        }
      }
    },
    { passive: false },
  );
} else {
  document.getElementById("info").innerText =
    "Device Orientation API not supported.";
}

document.addEventListener("keydown", function (event) {
  // Handle left and right arrow keys which move the piece
  if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
    let direction = event.key === "ArrowLeft" ? -1 : 1;
    console.log(
      `Key press: ${event.key === "ArrowLeft" ? "left" : "right"} arrow, moving piece`,
    );
    board.moveElement(direction, 0);
  }

  // Handle down arrow key
  if (event.key === "ArrowDown") {
    board.dropDownElement();
  }
});
