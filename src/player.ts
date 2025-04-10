import { Application, Graphics } from "pixi.js";
import { GamepadButton, Player } from "./models";
import { Grid } from "./grid";

export class MazePlayer implements Player {
  private graphics: Graphics;

  constructor(
    private app: Application,
    private grid: Grid,
    private x: number,
    private y: number
  ) {
    this.graphics = new Graphics();
    this.graphics.circle(0, 0, this.grid.getCellSize() / 4);
    this.graphics.fill(0xff0000);
    this.updatePosition();
    this.app.stage.addChild(this.graphics);

    // for debug purposes
    window.addEventListener("keydown", (event) => {
      switch (event.key.toUpperCase()) {
        case "W":
          this.handle(GamepadButton.Up);
          break;
        case "S":
          this.handle(GamepadButton.Down);
          break;
        case "A":
          this.handle(GamepadButton.Left);
          break;
        case "D":
          this.handle(GamepadButton.Right);
          break;
      }
    });
  }

  handle(button: GamepadButton) {
    switch (button) {
      case GamepadButton.Up:
        this.moveBy(0, -1);
        break;
      case GamepadButton.Down:
        this.moveBy(0, 1);
        break;
      case GamepadButton.Left:
        this.moveBy(-1, 0);
        break;
      case GamepadButton.Right:
        this.moveBy(1, 0);
        break;
    }
  }

  moveBy(x: number, y: number) {
    const newX = this.x + x;
    const newY = this.y + y;

    if (this.isValidMove(newX, newY)) {
      this.x = newX;
      this.y = newY;
      this.updatePosition();
    }
  }

  isValidMove(newX: number, newY: number): boolean {
    const { rows, cols } = this.grid.getDimensions();
    return newX >= 0 && newY >= 0 && newX < cols && newY < rows;
  }

  updatePosition() {
    const cellSize = this.grid.getCellSize();
    const cell = this.grid.getCell(this.x, this.y);
    this.graphics.x = cell.x + cellSize / 2;
    this.graphics.y = cell.y + cellSize / 2;
  }
}
