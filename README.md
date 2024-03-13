# daoc-stats

> Dark Age of Camelot log parser

## Install

1. Download https://pnpm.io/ (tested on v21.7.1)
2. Clone the repository.
3. `pnpm install`
4. Create an `.env` file at the root of the project with as following:

```json
DISCORD_TOKEN=YOUR_REAL_TOKEN
```

## How to use

1. Clear your `chat.log` file
2. Login to DAOC, and type `/chatlog`
3. Run the program: `pnpm exec node .\index.js --debug --src "C:\Users\yourSession\OneDrive\Documents\Electronic Arts\Dark Age of Camelot\chat.log"`

## Params

- `--autoUpdate ` (default: `5000`). Interval between file update look up.
- `--debug` (default: `false`). Show detailed log.
- `--src` (default: `undefined`). Chat.log full path.
