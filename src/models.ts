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

export class ColorManager {
  private _allowColors: string[] = ["0x0000ff", "0xff0000"];

  public static getColor(): string {
    return "#ffffff";
  }
}
