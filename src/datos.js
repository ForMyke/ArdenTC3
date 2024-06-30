import { AlphabetA, a } from "./alfabeto.js";
import { StatesS, states, k } from "./estados.js";
import { ValidValid, valid } from "./estadosValidos.js";
import { Cleaner, MakeNet, DFA, Mapping } from "./dfa.js";
import { All, solved } from "./resolucion.js";
import { replaceRepeatedPatterns } from "./remplazar.js";

export function DataFiles(fileContent, outputElement) {
  const lines = fileContent.split("\n").map((line) => line.trim());
  let l = 1;

  lines.forEach((cline) => {
    if (l === 1) {
      AlphabetA(cline);
      outputElement.innerHTML +=
        "Alfabeto: " + Array.from(a).join(" ") + "<br>";
      console.log("Alfabeto:", Array.from(a).join(" "));
    } else if (l === 2) {
      StatesS(cline);
      outputElement.innerHTML +=
        "Estados: " + Array.from(states).join(" ") + "<br>";
      console.log("Estados:", Array.from(states).join(" "));
    } else if (l === 3) {
      ValidValid(cline);
      outputElement.innerHTML +=
        "Estados válidos: " + Array.from(valid).join(" ") + "<br><br><br>";
      console.log("Estados de aceptacion:", Array.from(valid).join(" "));
    } else {
      let clean = Cleaner(cline);
      let current = MakeNet(clean);
      if (valid.has(l - 4)) {
        current.set(k, "λ");
      }
      DFA.push(current);
      outputElement.innerHTML += `Ecuacion para X${l - 4}:<br>`;
      outputElement.innerHTML +=
        Array.from(current.entries())
          .map(([key, value]) => (key !== k ? `${value}X${key}` : value))
          .join(" + ") + "<br><br>";
      console.log(
        `Ecuación para X${l - 4}:`,
        Array.from(current.entries())
          .map(([key, value]) => (key !== k ? `${value}X${key}` : value))
          .join(" + ")
      );
    }
    l++;
  });

  solved.add(k);
  All(DFA[0], 0, outputElement);

  outputElement.innerHTML += "<br><br><br><br>Expresion aplicando Arden:<br>";
  let finalExpression = Array.from(DFA[0].entries())
    .map(([key, value]) => (key !== k ? `${value}X${key}` : value))
    .join(" + ");
  finalExpression = replaceRepeatedPatterns(finalExpression);
  outputElement.innerHTML += finalExpression + "<br><br><br><br><br><br><br>";
  console.log("Expresión Regular:", finalExpression);
}
