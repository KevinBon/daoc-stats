import { inspect } from "node:util";
import { sendMessage } from "../services/discord.js";
import { makeDebugger } from "../logger.js";
const debug = makeDebugger("BG", "gray");

const predicates = [
  /**
   * @example SH RAID ON ME starting @ xx:40
   */
  function ({ hours, minutes, sender, msg }) {
    // TODO: Use date lib and predict the time of the raid?
    const msgEstimatedTime = msg.match(/(xx:(?<estimatedTime>\d{2}))/i);
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
      msg.includes("raid") ||
      msg.includes("bg open") ||
      msg.includes("bg on") ||
      msg.includes("/bg join") ||
      msg.includes("BG join")
    ) {
      return `BG detected | From : ${sender} | ${msg}`;
    }
  },
  function ({ sender, msg, channel }) {
    if (msg.includes("ML10") || msg.includes("ML 10")) {
      return `Maybe ML10 raid | From : ${sender} | ${msg}`;
    }
  },
  function ({ sender, msg }) {
    if (msg.includes("mini")) {
      return `Maybe Mini's Dragon raid | From : ${sender} | ${msg}`;
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
      // debug("Not a channel message", text);
      return;
    }
    if (
      !result.groups ||
      !["Broadcast", "LFG"].includes(result.groups.channel)
    ) {
      // debug("NO GROUPS", text, inspect(result.groups, true, 10));
      return;
    }

    for (const predicate of predicates) {
      const sendMsg = predicate(result.groups);
      if (sendMsg) {
        debug("Found a BG", text);
        sendMessage(sendMsg);
        break;
      }
    }
    // debug("Not a BG", text);
  }
}
const bgObserver = new BGObserver();

export function getObserver() {
  return bgObserver;
}
