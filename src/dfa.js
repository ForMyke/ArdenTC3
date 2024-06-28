import { Formatter } from "./formatter.js";
import { k } from "./states.js";

export const DFA = [];

export function Cleaner(line) {
  let tokens = Formatter(line);
  return tokens.slice(2).filter((token) => token !== "+" && token !== "/");
}

export function PlusExpression(expr1, expr2) {
  return `( ${expr1} + ${expr2} )`;
}

export function MakeNet(connect) {
  let net = new Map();
  connect.forEach((item) => {
    try {
      let [path, id] = item.split("X");
      path = path !== "/" ? path : "λ"; // Tratar "/" como λ
      id = parseInt(id);
      if (net.has(id)) {
        net.set(id, PlusExpression(net.get(id), path));
      } else {
        net.set(id, path);
      }
    } catch (e) {
      console.error(`Error al procesar ${item}: ${e}`);
    }
  });
  return net;
}

export function Mapping(node, id, outputElement) {
  outputElement.innerHTML += `X${id}:<br>`;
  for (let [key, value] of node.entries()) {
    outputElement.innerHTML += `${key} => ${value}<br>`;
  }
}
