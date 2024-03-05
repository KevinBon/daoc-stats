import { ActivityType, Client, Events, GatewayIntentBits } from "discord.js";
import { makeDebugger } from "../logger.js";

let client;

const debug = makeDebugger("Discord", "green");

const channelIds = [
  // "1187850003096547491", // Clowst server
  "1187928491237310505", // Vallhala
];

const devChannelIds = [
  "1187850003096547491", // Clowst server
];

export function sendMessage(txt, dev = false) {
  debug("Sending msg", txt);
  for (const channelId of dev ? devChannelIds : channelIds) {
    client.channels.cache.get(channelId).send(txt);
  }
}

export function reportError(error) {
  const errorAsString = JSON.stringify(error);
  debug("Report error", error, errorAsString);
  for (const channelId of devChannelIds) {
    client.channels.cache.get(channelId).send(`Error found: ${errorAsString}`);
  }
}

export function getClient() {
  return client;
}

let _isOnline = false;

export function isOnline() {
  return _isOnline;
}

export function appearOnline() {
  debug("Online");
  _isOnline = true;
  return client.user.setPresence({
    activities: [{ name: "DAOC", type: ActivityType.Watching }],
    status: "online",
  });
}

export function appearOffline() {
  debug("Offline");
  _isOnline = false;
  return client.user.setPresence({
    afk: true,
    status: "idle",
  });
}

export function connect(token) {
  debug("Connecting...");
  client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  });
  client.login(token);

  return new Promise((resolve) => {
    client.once(Events.ClientReady, (readyClient) => {
      debug(`Ready! Logged in as ${readyClient.user.tag}`);
      appearOnline();
      resolve();
    });
  });
}
