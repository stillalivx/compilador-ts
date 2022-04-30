import { TOKENS } from "./tokens";

export type TokenValue = {
  token: TOKENS,
  valor: any
};

export type Node = {
  token: TOKENS;
  valor: any;
  left: Node | null;
  right: Node | null;
}