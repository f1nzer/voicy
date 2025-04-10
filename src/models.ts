export enum GamepadButton {
  Up = "up",
  Down = "down",
  Left = "left",
  Right = "right",
  ActionA = "actionA",
  ActionB = "actionB",
}

export interface Player {
  handle(button: GamepadButton): void;
}

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

export class ColorManager {
  private _allowColors: string[] = ["0x0000ff", "0xff0000"];

  public static getColor(): string {
    return "#ffffff";
  }
}
