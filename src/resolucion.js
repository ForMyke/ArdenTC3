import { k } from "./estados.js";
import { valid } from "./estadosValidos.js";
import { DFA, Mapping, PlusExpression } from "./dfa.js";

export const solved = new Set();
export const path = new Set();

export function Arden(id, outputElement) {
  let node = DFA[id];
  if (!node.has(id) || node.get(id) === "") return;
  let obj = `(${node.get(id)})*`;
  node.delete(id);
  if (node.size === 0) {
    node.set(k, obj);
  } else {
    for (let key of node.keys()) {
      node.set(key, obj + node.get(key));
    }
  }
  DFA[id] = node;
  outputElement.innerHTML += `Ecuación para X${id} después de aplicar Arden:<br>`;
  Mapping(DFA[id], id, outputElement);
}

export function IfSolved(node) {
  return solved.has(node);
}

export function IfPath(node) {
  return path.has(node);
}

export function MixMaps(target, source, outputElement) {
  let aux = DFA[target];
  let src = DFA[source];
  let obj = aux.get(source);
  aux.delete(source);
  for (let [key, value] of src.entries()) {
    if (aux.has(key)) {
      aux.set(key, PlusExpression(obj + value, aux.get(key)));
    } else {
      aux.set(key, obj + value);
    }
  }
  if (valid.has(target)) {
    if (aux.size === 2 && aux.has(target)) {
      aux.set(k, aux.get(target) + "*");
      aux.delete(target);
    }
  } else {
    if (aux.size === 1 && aux.has(target)) {
      aux.set(k, aux.get(target) + "*");
      aux.delete(target);
    }
  }
  DFA[target] = aux;
  outputElement.innerHTML += `Ecuación para X${target} despues de añadir  X${source}:<br>`;
  Mapping(DFA[target], target, outputElement);
}

export function All(node, start, outputElement) {
  path.add(start);
  for (let key of Array.from(node.keys())) {
    if (!IfSolved(key) && !IfPath(key)) {
      All(DFA[key], key, outputElement);
      MixMaps(start, key, outputElement);
    }
  }
  if (node.has(start)) {
    Arden(start, outputElement);
  }
  path.delete(start);
  return node;
}
