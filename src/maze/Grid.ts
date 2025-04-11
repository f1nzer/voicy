import { Container, Ticker } from "pixi.js";
import { GridCell } from "./GridCell";

export class Grid extends Container {
  private grid: GridCell[][] = [];
  private cellSize: number = 0;

  constructor(private rows: number, private cols: number) {
    super();

    for (let i = 0; i < rows; i++) {
      const row: GridCell[] = [];
      for (let j = 0; j < cols; j++) {
        const cell = new GridCell();
        row.push(cell);
        this.addChild(cell);
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

  resize(width: number, height: number) {
    this.cellSize = Math.min(width / this.cols, height / this.rows) * 0.7;

    const offsetX = (width - this.cellSize * this.cols) / 2;
    const offsetY = (height - this.cellSize * this.rows) / 2;

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        const cell = this.getCell(i, j)!;
        cell.setCellSize(this.cellSize);
        cell.x = i * this.cellSize + offsetX;
        cell.y = j * this.cellSize + offsetY;
      }
    }
  }

  getCell(x: number, y: number) {
    if (x < 0 || y < 0 || x >= this.rows || y >= this.cols) {
      return;
    }

    return this.grid[x][y];
  }

  update(ticker: Ticker) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        const cell = this.getCell(i, j)!;
        cell.update(ticker);
      }
    }
  }
}
