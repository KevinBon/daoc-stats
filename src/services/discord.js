import { ActivityType, Client, Events, GatewayIntentBits } from "discord.js";
import { makeDebugger } from "../logger.js";

let client;

const debug = makeDebugger("Discord", "green");

const channelIds = [
  "1187850003096547491", // Clowst server
  "1187928491237310505", // Vallhala
];

export function sendMessage(txt) {
  debug("Sending msg", txt);
  for (const channelId of channelIds) {
    client.channels.cache.get(channelId).send(txt);
  }
}

export function getClient() {
  return client;
}

function appearOnline() {
  debug("Online");
  return client.user.setPresence({
    activities: [{ name: "DAOC", type: ActivityType.Watching }],
    status: "online",
  });
}

export function appearOffline() {
  debug("Offline");
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
