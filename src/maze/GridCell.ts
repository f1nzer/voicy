import { Graphics, Ticker } from "pixi.js";

export enum GridCellState {
  EMPTY,
  EXPLODED,
  CANDIDATE_FOR_EXPLODE,
}

export class GridCell extends Graphics {
  private cellSize = 0;
  private state: GridCellState = GridCellState.EMPTY;
  private elapsed = 0;
  private timeToAction = 0;

  constructor() {
    super();
  }

  setCellSize(size: number) {
    this.cellSize = size;
  }

  markForExplode(timeToAction: number) {
    this.state = GridCellState.CANDIDATE_FOR_EXPLODE;
    this.elapsed = 0;
    this.timeToAction = timeToAction;
  }

  isBlocked() {
    return this.state === GridCellState.EXPLODED;
  }

  update(ticker: Ticker) {
    this.elapsed += ticker.deltaMS;
    this.clear();
    this.rect(0, 0, this.cellSize, this.cellSize);

    let fill = 0xaaccff;
    if (this.state === GridCellState.CANDIDATE_FOR_EXPLODE) {
      if (this.elapsed <= this.timeToAction) {
        const progress = this.elapsed / this.timeToAction;
        fill = this.interpolateColor(0xaaccff, 0xaa0000, progress);
      } else {
        this.state = GridCellState.EXPLODED;
      }
    }

    if (this.state === GridCellState.EXPLODED) {
      fill = 0xaa0000;
    }

    this.fill(fill);
    this.stroke({ width: 1, color: 0x000000 });
  }

  private interpolateColor(
    startColor: number,
    endColor: number,
    factor: number
  ): number {
    const startR = (startColor >> 16) & 0xff;
    const startG = (startColor >> 8) & 0xff;
    const startB = startColor & 0xff;

    const endR = (endColor >> 16) & 0xff;
    const endG = (endColor >> 8) & 0xff;
    const endB = endColor & 0xff;

    const r = Math.round(startR + factor * (endR - startR));
    const g = Math.round(startG + factor * (endG - startG));
    const b = Math.round(startB + factor * (endB - startB));

    return (r << 16) | (g << 8) | b;
  }
}
