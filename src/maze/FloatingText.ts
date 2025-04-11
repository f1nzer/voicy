import { Container, Text, Ticker } from "pixi.js";

interface TextItem {
  text: Text;
  elapsed: number;
}

const START_Y = 0;

export class FloatingText extends Container {
  private items: Set<TextItem> = new Set<TextItem>();

  constructor() {
    super();
  }

  displayText(text: string, isHandled: boolean) {
    const textEl = new Text({
      text,
      style: {
        fontFamily: "Arial",
        fill: isHandled ? 0x00ff00 : 0xff0000,
        align: "center",
      },
    });

    textEl.anchor.set(0.5);
    textEl.y = START_Y;

    this.addChild(textEl);
    this.items.add({ text: textEl, elapsed: 0 });
  }

  resize(width: number, height: number) {
    this.x = width / 2;
    this.y = height / 2;
  }

  update(ticker: Ticker) {
    for (const item of this.items) {
      item.elapsed += ticker.deltaTime;
      const progress = Math.min(item.elapsed / 150, 1);

      item.text.y = START_Y - Math.pow(progress, 0.7) * 100;
      item.text.alpha = 1 - progress;
      item.text.style.fontSize = 26 * (1 - progress);

      if (progress >= 1) {
        this.removeChild(item.text);
        this.items.delete(item);
      }
    }
  }
}
