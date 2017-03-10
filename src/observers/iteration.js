const AbstractObserver = require('./abstract.observer.js');

var ObsIteration = class ObsExperience extends AbstractObserver {
  constructor(arg = {}) {
    arg.name = 'iteration';
    arg.validator = /./;
    this._count = 0;
    super(arg);
  }
  getData(explodedData, data) {
    return {
      lines: ++this._count,
    };
  }
}

module.exports = ObsExperience;
