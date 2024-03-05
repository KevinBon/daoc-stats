import Parser from "./parser.js";
import { connect, appearOffline, reportError } from "./services/discord.js";
import { setDebug, makeDebugger } from "./logger.js";
import * as bg from "./observers/bg.js";
import * as chatlog from "./observers/chatlog.js";
import * as df from "./observers/df.js";
import * as timeout from "./observers/timeout.js";
import * as serverRestart from "./observers/serverRestart.js";

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
    try {
      timeout.getObserver().onData(...args);
      bg.getObserver().onData(...args);
      chatlog.getObserver().onData(...args);
      df.getObserver().onData(...args);
      serverRestart.getObserver().onData(...args);
    } catch (err) {
      reportError(err);
    }
  });

  return () => {
    appDebugger("Shutting down");
    appearOffline();
    parser.close();
  };
}
