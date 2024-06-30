// rollup.config.js
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";

export default {
  input: "src/main.js",
  output: {
    file: "public/bundle.js",
    format: "iife",
    name: "bundle",
  },
  plugins: [nodeResolve(), commonjs()],
};
