# daoc-stats

> Dark Age of Camelot log parser

## Install

1. Clone the repository.
2. `pnpm install`

Create an `.env` file at the root of the project with as following:

```json
DISCORD_TOKEN=YOUR_REAL_TOKEN
```

## Basic Usage

`node index.js --src "C:\\Users\\BobMoutarde\\Documents\\Electronic Arts\\Dark Age of Camelot\\chat.log"`

## Params

- `--autoUpdate ` (default: `5000`). Interval between file update look up.
- `--debug` (default: `false`). Show detailed log.
- `--src` (default: `undefined`). Chat.log full path.
