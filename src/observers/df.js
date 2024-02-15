import { sendMessage } from "../services/discord.js";
import { makeDebugger } from "../logger.js";

class DFObserver {
  onData(text) {
    if (!text) {
      return;
    }
    // [08:40:53] Darkness Falls open for Hibernia
    if (text.includes("Darkness Falls open for Midgard")) {
      sendMessage("Darkness Falls | Open");
      return;
    }
    // [08:40:53] Darkness Falls closing in 15 min for Midgard
    if (text.includes("Darkness Falls closing in 15 min for Midgard")) {
      sendMessage("Darkness Falls | Will close in 15min");
      return;
    }
  }
}
const dfObserver = new DFObserver();

export function getObserver() {
  return dfObserver;
}
