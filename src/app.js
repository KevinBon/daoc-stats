import Parser from "./parser.js";
import { connect, appearOffline } from "./services/discord.js";
import { setDebug, makeDebugger } from "./logger.js";
import { getObserver } from "./observers/bg.js";
import * as chatlog from "./observers/chatlog.js";

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
  parser.on("data", (...args) => {
    getObserver().onData(...args);
    chatlog.getObserver().onData(...args);
  });

  return () => {
    appDebugger("Shutting down");
    appearOffline();
    parser.close();
  };
}
