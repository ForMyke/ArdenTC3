import { Formatter } from "./formatter.js";

export const states = new Set();
export let k = 0;

export function StatesS(line) {
  let tokens = Formatter(line);
  tokens.forEach((token) => {
    try {
      let cID = parseInt(token.slice(1));
      states.add(cID);
    } catch (e) {
      console.error(`Error al convertir ${token} a entero: ${e}`);
    }
  });
  k = tokens.length;
}
