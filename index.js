const fs = require("fs");
const readline = require("readline");

let a = new Set();
let states = new Set();
let valid = new Set();
let solved = new Set();
let path = new Set();
let DFA = [];
let k = 0;

function Formatter(line) {
  return line.trim().split(/\s+/);
}

function AlphabetA(line) {
  let tokens = Formatter(line);
  tokens.forEach((token) => a.add(token));
}

function StatesS(line) {
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

function ValidValid(line) {
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

function Cleaner(line) {
  let tokens = Formatter(line);
  return tokens.slice(2).filter((token) => token !== "+" && token !== "/");
}

function PlusExpression(expr1, expr2) {
  return `( ${expr1} + ${expr2} )`;
}

function MakeNet(connect) {
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

function Mapping(node, id) {
  console.log(`X${id}:`);
  for (let [key, value] of node.entries()) {
    console.log(`${key} => ${value}`);
  }
}

function Arden(id) {
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
  Mapping(DFA[id], id);
}

function IfSolved(node) {
  return solved.has(node);
}

function IfPath(node) {
  return path.has(node);
}

function MixMaps(target, source) {
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
}

function All(node, start) {
  path.add(start);
  for (let key of Array.from(node.keys())) {
    if (!IfSolved(key) && !IfPath(key)) {
      All(DFA[key], key);
      MixMaps(start, key);
    }
  }
  if (node.has(start)) {
    Arden(start);
  }
  path.delete(start);
  return node;
}

function DataFiles(filename) {
  if (!filename) {
    console.error("No filename provided");
    return;
  }

  let l = 1;
  const rl = readline.createInterface({
    input: fs.createReadStream(filename),
    output: process.stdout,
    terminal: false,
  });

  rl.on("line", (cline) => {
    cline = cline.trim();
    if (l === 1) {
      AlphabetA(cline);
      console.log("Alfabeto:", Array.from(a).join(" "));
    } else if (l === 2) {
      StatesS(cline);
      console.log("Estados:", Array.from(states).join(" "));
    } else if (l === 3) {
      ValidValid(cline);
      console.log("Estados válidos:", Array.from(valid).join(" "));
    } else {
      let clean = Cleaner(cline);
      let current = MakeNet(clean);
      if (valid.has(l - 4)) {
        current.set(k, "λ"); // Representar el símbolo λ
      }
      DFA.push(current);
      console.log(`Ecuación para X${l - 4}:`);
      console.log(
        Array.from(current.entries())
          .map(([key, value]) => (key !== k ? `${value}X${key}` : value))
          .join(" + ") + "\n"
      );
    }
    l++;
  });

  rl.on("close", () => {
    solved.add(k);
    All(DFA[0], 0);
    console.log("Expresión Regular:");
    Mapping(DFA[0], 0);
  });
}

// Llamar a DataFiles con el nombre del archivo proporcionado por el usuario
const filename = process.argv[2];
DataFiles(filename);
