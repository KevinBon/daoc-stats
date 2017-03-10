const chalk = require('chalk');
const AbstractObserver = require('../abstracts/abstract.observer.js');

var ObsExperience = class ObsExperience extends AbstractObserver {
  getData(explodedData, data) {
    return {
      xp: parseInt(explodedData[3].replace(/,/g, ''), 10)
    };
  }
}

module.exports = new ObsExperience({
  name: 'experience',
  validator: /experience points/,
});
