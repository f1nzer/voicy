import {
  Application,
  Assets,
  Container,
  Sprite,
  Graphics,
  Text,
} from "pixi.js";
import { setupSpeechRecognition } from "./speech-recognition";

function loadAsset(assetPath: string) {
  return Assets.load("/voicy/assets/" + assetPath);
}

(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({ background: "#1099bb", resizeTo: window });

  // Append the application canvas to the document body
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  // Load the bunny texture
  const texture = await loadAsset("bunny.png");

  // Create a bunny Sprite
  const bunny = new Sprite(texture);

  const cellSize = 100;
  const gridSize = 5;
  const grid: Graphics[][] = [];
  for (let row = 0; row < gridSize; row++) {
    grid[row] = [];
    for (let col = 0; col < gridSize; col++) {
      const cell = new Graphics();
      cell.rect(0, 0, cellSize, cellSize);
      cell.fill(0x66ccff);
      cell.stroke({ width: 1, color: 0x000000 });
      cell.x = col * cellSize;
      cell.y = row * cellSize;
      app.stage.addChild(cell);
      grid[row][col] = cell;
    }
  }

  function centerGrid() {
    const gridWidth = gridSize * cellSize;
    const gridHeight = gridSize * cellSize;
    const offsetX = (app.screen.width - gridWidth) / 2;
    const offsetY = (app.screen.height - gridHeight) / 2;

    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const cell = grid[row][col];
        cell.x = col * cellSize + offsetX;
        cell.y = row * cellSize + offsetY;
      }
    }
  }

  centerGrid();

  const players = [
    { color: 0xff0000, position: { x: 0, y: 0 }, sprite: new Graphics() }, // Red player
    { color: 0x0000ff, position: { x: 4, y: 4 }, sprite: new Graphics() }, // Blue player
  ];

  function updatePlayerPosition(
    player: (typeof players)[0],
    grid: Graphics[][]
  ) {
    const cell = grid[player.position.y][player.position.x];
    player.sprite.x = player.position.x + cell.x + cellSize / 2;
    player.sprite.y = player.position.y + cell.y + cellSize / 2;
  }

  players.forEach((player) => {
    player.sprite.circle(0, 0, cellSize / 4);
    player.sprite.fill(player.color);
    app.stage.addChild(player.sprite);
    updatePlayerPosition(player, grid);
  });

  // Create a container for voice command visualizations
  const commandContainer = new Container();
  app.stage.addChild(commandContainer);

  function visualizeCommand(command: string) {
    const text = new Text({
      text: command,
      style: {
        fontFamily: "Arial",
        fontSize: 24,
        fill: 0xffffff,
        align: "center",
      },
    });

    text.x = app.screen.width / 2 - text.width / 2;
    // text.y = 50; // Start above the board

    commandContainer.addChild(text);

    // Animate the text flying to the top and fading out
    const duration = 2000; // 2 seconds
    let elapsed = 0;

    app.ticker.add(ticker => {
      elapsed += ticker.deltaMS;
      const progress = Math.min(elapsed / duration, 1);

      text.y = 100 - progress * 50; // Move up
      text.alpha = 1 - progress; // Fade out

      if (progress >= 1) {
        ticker.destroy(); // Stop the ticker
        commandContainer.removeChild(text); // Remove after animation
      }
    });
  }

  // Example usage: simulate a voice command
  setTimeout(() => visualizeCommand("Hello, world!"), 1000);

  // Center the sprite's anchor point
  bunny.anchor.set(0.5);

  // Move the sprite to the center of the screen
  bunny.position.set(app.screen.width / 2, app.screen.height / 2);

  // Add the bunny to the stage
  app.stage.addChild(bunny);

  // Listen for animate update
  app.ticker.add((time) => {
    // Just for fun, let's rotate mr rabbit a little.
    // * Delta is 1 if running at 100% performance *
    // * Creates frame-independent transformation *
    bunny.rotation += 0.1 * time.deltaTime;
  });

  setupSpeechRecognition((command) => {
    console.log("Received command:", command);
    visualizeCommand(command);
  });
})();
