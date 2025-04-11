import { Container, Graphics } from "pixi.js";
import { GamepadButton, Player } from "../models";
import { Grid } from "./Grid";

export class MazePlayer extends Container implements Player {
  private graphics: Graphics;

  constructor(private grid: Grid, private posX: number, private posY: number) {
    super();

    this.graphics = new Graphics();
    this.addChild(this.graphics);

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
    const newX = this.posX + x;
    const newY = this.posY + y;

    if (this.isValidMove(newX, newY)) {
      this.posX = newX;
      this.posY = newY;
      this.render();
    }
  }

  isValidMove(newX: number, newY: number): boolean {
    const cell = this.grid.getCell(newX, newY);
    if (!cell || cell.isBlocked()) {
      return false;
    }

    return true;
  }

  render() {
    const cellSize = this.grid.getCellSize();

    this.graphics.clear();
    this.graphics.circle(0, 0, cellSize / 4);
    this.graphics.fill(0xff0000);

    const cell = this.grid.getCell(this.posX, this.posY)!;
    this.x = cell.x + cellSize / 2;
    this.y = cell.y + cellSize / 2;
  }
}
