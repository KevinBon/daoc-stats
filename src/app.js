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

var parser = new Parser(options.src, {
  debug: options.debug,
  autoUpdate: options.autoUpdate,
});
var middleWare = new MiddleWare({
  debug: options.debug,
  observers: [
    obsExperience,
  ],
  stats: [
    statExperience,
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
