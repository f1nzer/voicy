import {
  AnimatedSprite,
  Assets,
  Container,
  DestroyOptions,
  Texture,
  Ticker,
} from "pixi.js";
import { Scene, GamepadButton } from "../models";
import { MazePlayer } from "./MazePlayer";
import { FloatingText } from "./FloatingText";
import { setupSpeechRecognition } from "../speech-recognition";
import { getAssetPath } from "../utils";
import { Grid } from "./Grid";
import { sound } from "@pixi/sound";
import { GridCell } from "./GridCell";
import { CommandController } from "../CommandController";

export class MazeScene extends Container implements Scene {
  private grid: Grid;
  private player: MazePlayer;
  private floatingText: FloatingText;
  private recognition: SpeechRecognition;
  private explosionTextures: Texture[] = [];

  constructor() {
    super();

    this.grid = new Grid(5, 5);
    this.addChild(this.grid);

    this.player = new MazePlayer(this.grid, 0, 0);
    this.addChild(this.player);

    this.floatingText = new FloatingText();
    this.floatingText.displayText("Hello, world!", true);
    this.addChild(this.floatingText);

    const controller = new CommandController();
    controller.assignCommand("ВВЕРХ", this.player, GamepadButton.Up);
    controller.assignCommand("ВНИЗ", this.player, GamepadButton.Down);
    controller.assignCommand("НАЛЕВО", this.player, GamepadButton.Left);
    controller.assignCommand("НАПРАВО", this.player, GamepadButton.Right);

    this.recognition = setupSpeechRecognition((command) => {
      console.log("Received command:", command);
      const isHandled = controller.handleCommand(command);
      this.floatingText.displayText(command, isHandled);
    });

    const cells = this.grid.getGrid().flatMap((row) => row);
    const interval = setInterval(() => {
      const cell = cells[Math.floor(Math.random() * cells.length)];
      cells.splice(cells.indexOf(cell), 1);
      if (cells.length === 0) {
        clearInterval(interval);
      }

      const timeBeforeExplosion = Math.random() * 2_000 + 1_000;
      cell.markForExplode(timeBeforeExplosion);
      setTimeout(() => {
        this.boom(cell);
      }, timeBeforeExplosion);
    }, 4_000);
  }

  private boom(cell: GridCell) {
    const explosion = new AnimatedSprite(this.explosionTextures);
    explosion.x = cell.x + cell.width / 2;
    explosion.y = cell.y + cell.height / 2;

    const extraSize = Math.max(cell.width, cell.height) * Math.random();
    explosion.width = cell.width * 1.5 + extraSize;
    explosion.height = cell.height * 1.5 + extraSize;
    explosion.anchor.set(0.5);
    explosion.rotation = Math.random() * Math.PI;
    // explosion.scale.set(0.75 + Math.random() * 0.5);
    explosion.gotoAndPlay((Math.random() * 3) | 0);

    explosion.loop = false;
    explosion.onComplete = () => {
      this.removeChild(explosion);
    };

    this.addChild(explosion);
    sound.play("explosion", { start: 0.2 });
  }

  async init() {
    sound.add("explosion", getAssetPath("explosion.mp3"));
    await Assets.load(getAssetPath("explosion.json"));
    this.explosionTextures = [];
    for (let i = 0; i < 26; i++) {
      const texture = Texture.from(`Explosion_Sequence_A ${i + 1}.png`);
      this.explosionTextures.push(texture);
    }
  }

  destroy(options?: DestroyOptions): void {
    super.destroy(options);
    this.recognition.stop();
  }

  resize(width: number, height: number) {
    // Resize logic for the maze scene
    this.grid.resize(width, height);
    this.player.render();
    this.floatingText.resize(width, height);
  }

  update(ticker: Ticker) {
    this.floatingText.update(ticker);
    this.grid.update(ticker);
  }
}
