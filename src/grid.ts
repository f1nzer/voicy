import { Application, Graphics } from "pixi.js";

export class Grid {
  private app: Application;
  private grid: Graphics[][] = [];
  private cellSize: number;
  private rows: number;
  private cols: number;

  constructor(app: Application, cellSize: number, rows: number, cols: number) {
    this.cellSize = cellSize;
    this.rows = rows;
    this.cols = cols;
    this.app = app;

    for (let i = 0; i < rows; i++) {
      const row: Graphics[] = [];
      for (let j = 0; j < cols; j++) {
        const cell = new Graphics();
        cell.rect(0, 0, cellSize, cellSize);
        cell.fill(0x66ccff);
        cell.stroke({ width: 1, color: 0x000000 });
        row.push(cell);
        app.stage.addChild(cell);
      }
      this.grid.push(row);
    }
  }

  getGrid() {
    return this.grid;
  }

  getCellSize() {
    return this.cellSize;
  }

  getDimensions() {
    return {
      rows: this.rows,
      cols: this.cols,
    };
  }

  centerGrid() {
    const gridWidth = this.cols * this.cellSize;
    const gridHeight = this.rows * this.cellSize;
    const offsetX = (this.app.screen.width - gridWidth) / 2;
    const offsetY = (this.app.screen.height - gridHeight) / 2;

    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        const cell = this.getCell(row, col);
        cell.x += row * this.cellSize + offsetX;
        cell.y += col * this.cellSize + offsetY;
      }
    }
  }

  getCell(x: number, y: number) {
    return this.grid[x][y];
  }
}
