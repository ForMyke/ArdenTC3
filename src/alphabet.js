import { Formatter } from "./formatter.js";

export const a = new Set();

export function AlphabetA(line) {
  let tokens = Formatter(line);
  tokens.forEach((token) => a.add(token));
}
