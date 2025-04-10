import { GamepadButton, Player } from "./models";

type PlayerButton = {
  player: Player;
  button: GamepadButton;
};

export class Controller {
  private playersByCommand: Map<string, PlayerButton> = new Map();

  assignCommand(command: string, player: Player, button: GamepadButton) {
    this.playersByCommand.set(command, { player, button });
  }

  reset() {
    this.playersByCommand.clear();
  }

  handleCommand(command: string) {
    const playerButton = this.playersByCommand.get(command);
    if (!playerButton) {
      return;
    }

    const { player, button } = playerButton;
    player.handle(button);
  }
}
