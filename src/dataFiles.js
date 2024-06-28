import { AlphabetA, a } from "./alphabet.js";
import { StatesS, states, k } from "./states.js";
import { ValidValid, valid } from "./valid.js";
import { Cleaner, MakeNet, DFA, Mapping } from "./dfa.js";
import { All, solved } from "./solver.js";

export function DataFiles(fileContent, outputElement) {
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
