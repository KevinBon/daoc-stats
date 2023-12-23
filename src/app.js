import "dotenv/config";
import { createInterface } from "node:readline";
import commandLineArgs from "command-line-args";
import Parser from "./parser.js";
import MiddleWare from "./middleWare.js";
import obsExperience from "./plugins/experience.observer.js";
import statExperience from "./plugins/experience.stat.js";
import obsIteration from "./plugins/iteration.observer.js";
import statIteration from "./plugins/iteration.stat.js";
import { connect, getClient, sendMessage } from "./services/discord.js";
import { log } from "node:console";
if (!process.env.DISCORD_TOKEN) {
  throw new Error("DISCORD_TOKEN is required");
}

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

connect(process.env.DISCORD_TOKEN).then(() => {
  const optionDefinitions = [
    { name: "debug", type: Boolean, defaultValue: false }, // --debug
    { name: "test", type: Boolean, defaultValue: false }, // --test
    { name: "src", type: String, defaultValue: "chat.log" }, // --src chat.log
    { name: "autoUpdate", type: Number, defaultValue: 5000 }, // --autoUpdate 5000
  ];
  const options = commandLineArgs(optionDefinitions);

  var parser = new Parser(options.src, {
    debug: options.debug,
    autoUpdate: options.autoUpdate,
    // TODO: remove
    test: options.test,
  });
  var middleWare = new MiddleWare({
    debug: options.debug,
    observers: [obsExperience, obsIteration],
    stats: [statExperience, statIteration],
  });

  const predicates = [
    /**
     * @example SH RAID ON ME starting @ xx:40
     */
    function ({ hours, minutes, sender, msg }) {
      // TODO: Use date lib and predicate
      const msgEstimatedTime = msg.match(/(xx:(?<estimatedTime>\d{2}))/);
      if (!msgEstimatedTime) {
        return;
      }
      if (!msgEstimatedTime.groups || !msgEstimatedTime.groups.estimatedTime) {
        return;
      }

      // const expectatedHours = msgEstimatedTime.groups.estimatedTime > minutes ? parseInt(hours) + 1 : parseInt(hours)
      // const expectatedMinutes = msgEstimatedTime.groups.estimatedTime
      return `Raid detected | From : ${sender} | ${msg}`;
    },
    function ({ sender, msg }) {
      if (
        msg.includes("bg on") ||
        msg.includes("raid on") ||
        msg.includes("/bg join") ||
        msg.includes("BG join")
      ) {
        return `BG detected | From : ${sender} | ${msg}`;
      }
    },
  ];

  class BGObserver {
    onData(text) {
      if (!text) {
        return;
      }
      //\[((?<hour>\d{2}):(?<minutes>\d{2}):(?<seconds>\d{2}))\].(@@\[(?<channel>.*)\]) (?<sender>.*): (?<msg>.*)/gm
      const result = text.match(
        /\[((?<hours>\d{2}):(?<minutes>\d{2}):(?<seconds>\d{2}))\].(@@\[(?<channel>.*)\]) (?<sender>.*): (?<msg>.*)/,
      );
      if (!result) {
        return;
      }
      if (!result.groups) {
        return;
      }

      for (const predicate of predicates) {
        const sendMsg = predicate(result.groups);
        if (sendMsg) {
          console.log("newMsg", sendMsg);
          sendMessage(sendMsg);
          break;
        }
      }
    }
  }
  const bgObserver = new BGObserver();

  parser.init();
  parser.start();
  // parser.on('data', (text) => {
  //   console.log(text)
  // });
  parser.on("data", bgObserver.onData);
  parser.on("update", bgObserver.onData);
});

// CTRL + C
rl.on("SIGINT", () => {
  getClient().user.setStatus("idle");
  parser.close();
  rl.close();
});
