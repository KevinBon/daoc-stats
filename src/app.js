const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
const commandLineArgs = require('command-line-args');
const optionDefinitions = [
  { name: 'debug', type: Boolean, defaultValue: false }, // --debug
  { name: 'src', type: String, defaultValue: 'chat.log' }, // --src chat.log
];
const options = commandLineArgs(optionDefinitions);
const Parser = require('./parser.js');
const MiddleWare = require('./middleWare.js');
const ObsExperience = require('./observers/experience');
const StatExperience = require('./stats/experience');

var obsExperience = new ObsExperience();

var parser = new Parser(options.src, {
  debug: options.debug,
});
var middleWare = new MiddleWare({
  debug: options.debug,
  observers: [
    new ObsExperience(),
  ],
  stats: [
    new StatExperience(),
  ]
});

parser.init();
parser.start();
parser.on('data', middleWare.processData.bind(middleWare));

// CTRL + C
rl.on('SIGINT', () => {
  parser.close();
  rl.close();
});
