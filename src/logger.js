import chalk from "chalk";

let debug = false;

export function setDebug(newDebugValue = false) {
  debug = newDebugValue;
}

export function makeDebugger(nameSpace, color = "red") {
  return function debug(msg, ...rest) {
    if (debug) {
      console.log(
        chalk[color](`${nameSpace}: ${msg}`),
        ...rest.map((t) => chalk[color](t)),
      );
    }
  };
}
