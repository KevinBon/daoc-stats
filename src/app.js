import { createInterface } from 'node:readline';
const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});
import commandLineArgs from 'command-line-args';
const optionDefinitions = [
  { name: 'debug', type: Boolean, defaultValue: false }, // --debug
  { name: 'test', type: Boolean, defaultValue: false }, // --test
  { name: 'src', type: String, defaultValue: 'chat.log' }, // --src chat.log
  { name: 'autoUpdate', type: Number, defaultValue: 5000 }, // --autoUpdate 5000
];
const options = commandLineArgs(optionDefinitions);
import Parser from './parser.js';
import MiddleWare from './middleWare.js';
import obsExperience from './plugins/experience.observer.js';
import statExperience from './plugins/experience.stat.js';
import obsIteration from './plugins/iteration.observer.js';
import statIteration from './plugins/iteration.stat.js';

var parser = new Parser(options.src, {
  debug: options.debug,
  autoUpdate: options.autoUpdate,
  // TODO: remove
  test: options.test
});
var middleWare = new MiddleWare({
  debug: options.debug,
  observers: [
    obsExperience,
    obsIteration,
  ],
  stats: [
    statExperience,
    statIteration,
  ]
});

class BGObserver {
  onData(text) {
    if (!text) {
      return;
    }
    //\[((?<hour>\d{2}):(?<minutes>\d{2}):(?<seconds>\d{2}))\].(@@\[(?<channel>.*)\]) (?<sender>.*): (?<msg>.*)/gm
    const result = text.match(/\[((?<hours>\d{2}):(?<minutes>\d{2}):(?<seconds>\d{2}))\].(@@\[(?<channel>.*)\]) (?<sender>.*): (?<msg>.*)/)
    if (!result) {
      return;
    }
    const { hours, minutes, seconds, channel, sender, msg } = result.groups;
    if (!msg) {
      return;
    }
    // SH RAID ON ME starting @ xx:40
    const msgEstimatedTime = msg.match(/(xx:(?<estimatedTime>\d{2}))/)
    if (!msgEstimatedTime) {
      return;
    }
    if (!msgEstimatedTime.groups || !msgEstimatedTime.groups.estimatedTime) {
      return;
    }
    // TODO: Use date lib and fix bug
    const expectatedHours = msgEstimatedTime.groups.estimatedTime > minutes ? parseInt(hours) + 1 : parseInt(hours)
    const expectatedMinutes = msgEstimatedTime.groups.estimatedTime
    console.log('Raid detected:', msg, `at`,expectatedHours, expectatedMinutes, result.groups)
  }
}
const bgObserver = new BGObserver()

parser.init();
parser.start();
// parser.on('data', (text) => {
//   console.log(text)
// });
parser.on('data', bgObserver.onData);
parser.on('update', bgObserver.onData);

// CTRL + C
rl.on('SIGINT', () => {
  parser.close();
  rl.close();
});
