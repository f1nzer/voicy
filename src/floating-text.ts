import { Application, Container, Text } from "pixi.js";

interface TextItem {
  text: Text;
  elapsed: number;
}

const START_Y = 150;
const DURATION = 2_000;

export function addFloatingTextPlugin(app: Application) {
  const items = new Map<string, TextItem>();
  const textContainer = new Container();

  app.stage.addChild(textContainer);

  const displayText = (text: string) => {
    const textItem = new Text({
      text,
      style: {
        fontFamily: "Arial",
        fontSize: 24,
        fill: 0xffffff,
        align: "center",
      },
    });

    textItem.anchor.set(0.5);
    textItem.x = app.screen.width / 2;
    textItem.y = START_Y;

    textContainer.addChild(textItem);
    const key = `${text}-${Date.now()}`;
    items.set(key, { text: textItem, elapsed: 0 });
  };

  app.ticker.add((ticker) => {
    for (const [key, item] of items) {
      item.elapsed += ticker.deltaMS;
      const progress = Math.min(item.elapsed / DURATION, 1);

      item.text.y = START_Y - Math.pow(progress, 0.8) * 100; // Move up
      item.text.alpha = 1 - progress; // Fade out

      if (progress >= 1) {
        textContainer.removeChild(item.text); // Remove after animation
        items.delete(key);
      }
    }
  });

  return {
    displayText,
  };
}
