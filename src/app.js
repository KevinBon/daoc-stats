import { createInterface } from 'node:readline';
const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});
import commandLineArgs from 'command-line-args';
const optionDefinitions = [
  { name: 'debug', type: Boolean, defaultValue: false }, // --debug
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
  test: true
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

parser.init();
parser.start();
parser.on('data', (text) => {
  console.log(text)
});
// parser.on('data', middleWare.processData.bind(middleWare));
parser.on('update', middleWare.updateStats.bind(middleWare));

// CTRL + C
rl.on('SIGINT', () => {
  parser.close();
  rl.close();
});
