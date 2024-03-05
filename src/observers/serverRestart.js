import { sendMessage } from "../services/discord.js";

class ServerRestartObserver {
  onData(text) {
    if (!text) {
      return;
    }
    // [10:04:14] Server restart in 00:00:04 (3:04:14 PM UTC)!
    const result = text.match(
      /\[((?<hours>\d{2}):(?<minutes>\d{2}):(?<seconds>\d{2}))\].(?<msg>Server restart in \d{2}:\d{2}:\d{2}.*)/,
    );
    if (!result || !result.groups || !result.group.msg) {
      return;
    }
    sendMessage(`🔁 ${result.group.msg}`);
  }
}
const serverRestartObserver = new ServerRestartObserver();

export function getObserver() {
  return serverRestartObserver;
}
