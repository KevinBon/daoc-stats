import { ActivityType, Client, Events, GatewayIntentBits } from "discord.js";

let client;

const channelIds = [
  "1187850003096547491", // Clowst server
  "1187928491237310505", // Vallhala
];

export function sendMessage(txt) {
  for (const channelId of channelIds) {
    client.channels.cache.get(channelId).send(txt);
  }
}

export function getClient() {
  return client;
}

export function connect(token) {
  client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  });
  client.login(token);

  return new Promise((resolve) => {
    client.once(Events.ClientReady, (readyClient) => {
      console.log(`Ready! Logged in as ${readyClient.user.tag}`);
      client.user.setPresence({
        activities: [{ name: "DAOC", type: ActivityType.Watching }],
        status: "online",
      });
      resolve();
    });
  });
}
