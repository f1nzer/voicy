import { Application, Ticker } from "pixi.js";
import { Scene } from "./models";

export class SceneManager {
  private constructor() {}

  private static app: Application;
  private static currentScene: Scene;

  static async init() {
    const app = new Application();
    await app.init({ background: "#1099bb", resizeTo: window });
    SceneManager.app = app;

    document.getElementById("pixi-container")!.appendChild(app.canvas);

    app.ticker.add(SceneManager.update);
    window.addEventListener("resize", SceneManager.resize);

    app.start();
  }

  static update(ticker: Ticker) {
    SceneManager.currentScene?.update(ticker);
  }

  static resize() {
    SceneManager.currentScene?.resize(
      SceneManager.app.renderer.width,
      SceneManager.app.renderer.height
    );
  }

  static setScene(scene: Scene) {
    if (SceneManager.currentScene) {
      SceneManager.currentScene.destroy();
      SceneManager.app.stage.removeChild(SceneManager.currentScene);
    }

    SceneManager.currentScene = scene;
    SceneManager.app.stage.addChild(scene);
    SceneManager.resize();
  }
}
