import Parser from "./parser.js";
import { connect, appearOffline } from "./services/discord.js";
import { setDebug, makeDebugger } from "./logger.js";
import { getObserver } from "./observers/bg.js";

export async function start(options) {
  const appDebugger = makeDebugger("App", "cyan");
  setDebug(options.debug);

  await connect(options.discordToken);

  var parser = new Parser(options.src, {
    autoUpdate: options.autoUpdate,
    // TODO: remove
    test: options.test,
  });

  parser.init();
  parser.start();
  parser.on("data", getObserver().onData);
  parser.on("update", getObserver().onData);

  return () => {
    appDebugger("Shutting down");
    appearOffline();
    parser.close();
  };
}
