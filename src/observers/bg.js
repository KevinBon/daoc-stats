const predicates = [
  /**
   * @example SH RAID ON ME starting @ xx:40
   */
  function ({ hours, minutes, sender, msg }) {
    // TODO: Use date lib and predict the time of the raid?
    const msgEstimatedTime = msg.match(/(xx:(?<estimatedTime>\d{2}))/);
    if (!msgEstimatedTime) {
      return;
    }
    if (!msgEstimatedTime.groups || !msgEstimatedTime.groups.estimatedTime) {
      return;
    }

    // const expectatedHours = msgEstimatedTime.groups.estimatedTime > minutes ? parseInt(hours) + 1 : parseInt(hours)
    // const expectatedMinutes = msgEstimatedTime.groups.estimatedTime
    return `Raid detected | From : ${sender} | ${msg}`;
  },
  function ({ sender, msg }) {
    if (
      msg.includes("bg on") ||
      msg.includes("raid on") ||
      msg.includes("/bg join") ||
      msg.includes("BG join")
    ) {
      return `BG detected | From : ${sender} | ${msg}`;
    }
  },
];

class BGObserver {
  onData(text) {
    if (!text) {
      return;
    }
    //\[((?<hour>\d{2}):(?<minutes>\d{2}):(?<seconds>\d{2}))\].(@@\[(?<channel>.*)\]) (?<sender>.*): (?<msg>.*)/gm
    const result = text.match(
      /\[((?<hours>\d{2}):(?<minutes>\d{2}):(?<seconds>\d{2}))\].(@@\[(?<channel>.*)\]) (?<sender>.*): (?<msg>.*)/,
    );
    if (!result) {
      return;
    }
    if (!result.groups) {
      return;
    }

    for (const predicate of predicates) {
      const sendMsg = predicate(result.groups);
      if (sendMsg) {
        console.log("newMsg", sendMsg);
        // sendMessage(sendMsg);
        break;
      }
    }
  }
}
const bgObserver = new BGObserver();

export function getObserver() {
  return bgObserver;
}
