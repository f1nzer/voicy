import { SceneManager } from "./SceneManager";
import { MazeScene } from "./maze/MazeScene";

(async () => {
  await SceneManager.init();

  const scene = new MazeScene();
  await scene.init();
  SceneManager.setScene(scene);

  // const texture = await loadAsset("bunny.png");
  // const bunny = new Sprite(texture);
  // bunny.anchor.set(0.5);
  // bunny.position.set(app.screen.width / 2, app.screen.height / 2);
  // app.stage.addChild(bunny);
  // app.ticker.add((time) => {
  //   bunny.rotation += 0.1 * time.deltaTime;
  // });
})();
