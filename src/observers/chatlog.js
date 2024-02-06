import {
  sendMessage,
  appearOnline,
  appearOffline,
} from "../services/discord.js";
import { makeDebugger } from "../logger.js";
const debug = makeDebugger("ChatLog", "magenta");

class ChatLogObserver {
  onData(text) {
    if (!text) {
      return;
    }

    // *** Chat Log Opened: Mon Feb 05 08:41:25 2024
    if (text.includes("*** Chat Log Opened:")) {
      debug("Chat log opened", text);
      sendMessage("👀 Started watching...");
      appearOnline();
      return;
    }

    // *** Chat Log Closed: Mon Feb 05 12:38:51 2024
    if (text.includes("*** Chat Log Closed:")) {
      debug("Chat log closed", text);
      sendMessage("Not watching anymore");
      appearOffline();
      return;
    }
  }
}
const chatLogObserver = new ChatLogObserver();

export function getObserver() {
  return chatLogObserver;
}
