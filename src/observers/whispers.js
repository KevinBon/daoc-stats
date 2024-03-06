import { sendMessage } from "../services/discord.js";

class WhisperObserver {
  onData(text) {
    if (!text) {
      return;
    }
    // [20:05:39] @@Diplos sends, "yo"
    const result = text.match(
      /\[((?<hours>\d{2}):(?<minutes>\d{2}):(?<seconds>\d{2}))\].(@@(?<sender>.*)) sends, \"(?<msg>.*)\"$/,
    );
    if (!result || !result.groups) {
      return;
    }
    sendMessage(
      `🧚 Whisper | From : ${result.groups.sender} | ${result.groups.msg}`,
      true,
    );
  }
}
const whisperObserver = new WhisperObserver();

export function getObserver() {
  return whisperObserver;
}
