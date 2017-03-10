const chalk = require('chalk');
const _ = require('lodash');

var AbstractStat = class AbstractStat {
  constructor({ debug: debug, label: label, value: value, observersTriggerBy: observersTriggerBy } = { debug: false, label: '', value: 0, observersTriggerBy: [] }) {
    this.debug = debug;
    this.label = label;
    this.value = value;
    this.observersTriggerBy = observersTriggerBy;
  }
  isTriggered(observer) {
    console.log('isTriggered', this.observersTriggerBy, observer.name);
    return _.includes(this.observersTriggerBy, observer.name);
  }
  // abstract
  updateData(newData) {
    ('updateData must be declared');
  }
  getLabel() {
    return this.label;
  }
  getValue() {
    return this.value;
  }
}

module.exports = AbstractStat;
