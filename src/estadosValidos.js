import { Formatter } from "./tokens.js";

export const valid = new Set();

export function ValidValid(line) {
  let tokens = Formatter(line);
  tokens.forEach((token) => {
    try {
      let cID = parseInt(token.slice(1));
      valid.add(cID);
    } catch (e) {
      console.error(`Error al convertir ${token} a entero: ${e}`);
    }
  });
}
