import { Application, Assets, Sprite } from "pixi.js";
import { setupSpeechRecognition } from "./speech-recognition";
import { addFloatingTextPlugin } from "./floating-text";
import { Grid } from "./grid";
import { MazePlayer } from "./player";
import { Controller } from "./controller";
import { GamepadButton } from "./models";

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
  const grid = new Grid(app, cellSize, 5, 5);
  grid.centerGrid();

  const player = new MazePlayer(app, grid, 0, 0);

  const controller = new Controller();
  controller.assignCommand("НАВЕРХ", player, GamepadButton.Up);
  controller.assignCommand("ВНИЗ", player, GamepadButton.Down);
  controller.assignCommand("ЛЕВО", player, GamepadButton.Left);
  controller.assignCommand("ПРАВО", player, GamepadButton.Right);

  // const players = [
  //   { color: 0xff0000, position: { x: 0, y: 0 }, sprite: new Graphics() },
  // ];

  // function updatePlayerPosition(player: (typeof players)[0], grid: Grid) {
  //   const cell = grid.getCell(player.position.y, player.position.x);
  //   player.sprite.x = cell.x + cellSize / 2;
  //   player.sprite.y = cell.y + cellSize / 2;
  // }

  // players.forEach((player) => {
  //   player.sprite.circle(0, 0, cellSize / 4);
  //   player.sprite.fill(player.color);
  //   app.stage.addChild(player.sprite);
  //   updatePlayerPosition(player, grid);
  // });

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

  const { displayText } = addFloatingTextPlugin(app);

  // const player = createPlayer();
  // player.moveBy(1, 0);

  // const players = [player];

  // const controller = createController(app, players);

  setupSpeechRecognition((command) => {
    console.log("Received command:", command);
    // controller.handleCommand(command);
    displayText(command);
  });
})();
