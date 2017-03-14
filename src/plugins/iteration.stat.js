const AbstractStat = require('../abstracts/abstract.stat.js');

var StatIteration = class StatIteration extends AbstractStat {
  afterConstructor() {
    this.count = 0;
  }
  updateData() {
    ++this.count;

    return this;
  }
  _getValue() {
    return {
      lines: this.count,
    };
  }
}

module.exports = new StatIteration({
  label: 'iteration',
  observersTriggerBy: 'iteration'
});
