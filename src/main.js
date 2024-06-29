import { DataFiles } from "./datos.js";

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
