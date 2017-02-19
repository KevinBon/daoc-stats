const chalk = require('chalk');
const AbstractObserver = require('./abstract.observer.js');

var ObsExperience = class ObsExperience extends AbstractObserver {
  constructor(arg = {}) {
    arg.name = 'experience';
    arg.validator = /experience points/;
    super(arg);
  }
  getData(explodedData, data) {
    return {
      xp: parseInt(explodedData[3].replace(/,/g, ''), 10)
    };
  }
}

module.exports = ObsExperience;
