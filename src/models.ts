import { Container, Ticker } from "pixi.js";

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

export interface Scene extends Container {
  resize(width: number, height: number): void;
  update(ticker: Ticker): void;
}
