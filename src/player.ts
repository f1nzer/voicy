import { Graphics } from "pixi.js";
import { GamepadButton, Player } from "./models";
import { Grid } from "./grid";

export class MazePlayer implements Player {
  constructor(private grid: Grid, private x: number, private y: number) {}

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
    return (
      newX >= 0 &&
      newY >= 0 &&
      newX < this.grid.getGrid()[0].length &&
      newY < this.grid.getGrid().length
    );
  }

  updatePosition() {
    const playerGraphics = new Graphics();
    playerGraphics.clear();
    playerGraphics.beginFill(0xff0000);
    playerGraphics.circle(this.x * 100 + 50, this.y * 100 + 50, 20);
    playerGraphics.endFill();
    this.grid.getCell(this.x, this.y).addChild(playerGraphics);
  }
}
