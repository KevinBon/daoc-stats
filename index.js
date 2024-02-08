import "dotenv/config";
import fs from "node:fs";
import { createInterface } from "node:readline";
import commandLineArgs from "command-line-args";
import { start } from "./src/app.js";

const optionDefinitions = [
  { name: "debug", type: Boolean, defaultValue: false }, // --debug
  { name: "test", type: Boolean, defaultValue: false }, // --test
  { name: "src", type: String, defaultValue: "chat.log" }, // --src chat.log
  { name: "autoUpdate", type: Number, defaultValue: 5000 }, // --autoUpdate 5000
  {
    name: "discordToken",
    type: String,
    defaultValue: process.env.DISCORD_TOKEN,
  },
];
const options = commandLineArgs(optionDefinitions);

if (!options.discordToken) {
  throw new Error("discordToken is required");
}

// Delete chat.log content
fs.writeFileSync(options.src, "");

const onClose = await start(options);

// CTRL + C
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
}).on("SIGINT", () => {
  onClose();
  rl.close();
});
