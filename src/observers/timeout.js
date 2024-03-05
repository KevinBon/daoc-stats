import { isOnline, sendMessage } from "../services/discord.js";

class TimeoutObserver {
  constructor() {
    this.lastDataTimeoutId;
  }
  startTimeout() {
    if (this.lastDataTimeoutId) {
      clearTimeout(this.lastDataTimeoutId);
    }
    this.lastDataTimeoutId = setTimeout(() => {
      if (isOnline()) {
        sendMessage("🔌Not receiving data anymore", true);
      }
    }, 300000); // 5min
  }
  onData(text) {
    if (text) {
      this.startTimeout();
    }
  }
}
const timeoutObserver = new TimeoutObserver();

export function getObserver() {
  return timeoutObserver;
}
