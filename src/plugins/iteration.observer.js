const chalk = require('chalk');
const AbstractObserver = require('../abstracts/abstract.observer.js');

var ObsIteration = class ObsIteration extends AbstractObserver {
}

module.exports = new ObsIteration({
  name: 'iteration',
  validator: /./,
});
