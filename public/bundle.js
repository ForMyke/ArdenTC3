(function () {
  'use strict';

  function Formatter(line) {
    return line.trim().split(/\s+/);
  }

  const a = new Set();

  function AlphabetA(line) {
    let tokens = Formatter(line);
    tokens.forEach((token) => a.add(token));
  }

  const states = new Set();
  let k = 0;

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

  const valid = new Set();

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

  const DFA = [];

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

  function Mapping(node, id, outputElement) {
    outputElement.innerHTML += `X${id}:<br>`;
    for (let [key, value] of node.entries()) {
      outputElement.innerHTML += `${key} => ${value}<br>`;
    }
  }

  const solved = new Set();
  const path = new Set();

  function Arden(id, outputElement) {
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
    Mapping(DFA[id], id, outputElement);
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

  function All(node, start, outputElement) {
    path.add(start);
    for (let key of Array.from(node.keys())) {
      if (!IfSolved(key) && !IfPath(key)) {
        All(DFA[key], key, outputElement);
        MixMaps(start, key);
      }
    }
    if (node.has(start)) {
      Arden(start, outputElement);
    }
    path.delete(start);
    return node;
  }

  function DataFiles(fileContent, outputElement) {
    const lines = fileContent.split("\n").map((line) => line.trim());
    let l = 1;

    lines.forEach((cline) => {
      if (l === 1) {
        AlphabetA(cline);
        outputElement.innerHTML +=
          "Alfabeto: " + Array.from(a).join(" ") + "<br>";
      } else if (l === 2) {
        StatesS(cline);
        outputElement.innerHTML +=
          "Estados: " + Array.from(states).join(" ") + "<br>";
      } else if (l === 3) {
        ValidValid(cline);
        outputElement.innerHTML +=
          "Estados válidos: " + Array.from(valid).join(" ") + "<br>";
      } else {
        let clean = Cleaner(cline);
        let current = MakeNet(clean);
        if (valid.has(l - 4)) {
          current.set(k, "λ"); // Representar el símbolo λ
        }
        DFA.push(current);
        outputElement.innerHTML += `Ecuación para X${l - 4}:<br>`;
        outputElement.innerHTML +=
          Array.from(current.entries())
            .map(([key, value]) => (key !== k ? `${value}X${key}` : value))
            .join(" + ") + "<br><br>";
      }
      l++;
    });

    solved.add(k);
    All(DFA[0], 0, outputElement);
    outputElement.innerHTML += "Expresión Regular:<br>";
    Mapping(DFA[0], 0, outputElement);
  }

  document.getElementById("fileInput").addEventListener("change", (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target.result;
        const outputElement = document.getElementById("output");
        outputElement.innerHTML = ""; // Clear previous output
        DataFiles(fileContent, outputElement);
      };
      reader.readAsText(file);
    }
  });

})();
