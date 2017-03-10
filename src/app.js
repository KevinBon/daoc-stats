const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const commandLineArgs = require('command-line-args');
const optionDefinitions = [
  { name: 'debug', type: Boolean, defaultValue: false }, // --debug
  { name: 'src', type: String, defaultValue: 'chat.log' }, // --src chat.log
  { name: 'autoUpdate', type: Number, defaultValue: 5000 }, // --autoUpdate 5000
];
const options = commandLineArgs(optionDefinitions);
const Parser = require('./parser.js');
const MiddleWare = require('./middleWare.js');
const obsExperience = require('./plugins/experience.observer.js');
const statExperience = require('./plugins/experience.stat.js');
const obsIteration = require('./plugins/iteration.observer.js');
const statIteration = require('./plugins/iteration.stat.js');

var parser = new Parser(options.src, {
  debug: options.debug,
  autoUpdate: options.autoUpdate,
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
parser.on('data', middleWare.processData.bind(middleWare));
parser.on('update', middleWare.updateStats.bind(middleWare));

// CTRL + C
rl.on('SIGINT', () => {
  parser.close();
  rl.close();
});
