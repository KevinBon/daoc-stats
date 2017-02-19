const chalk = require('chalk');
const _ = require('lodash');
const clear = require('clear');

var MiddleWare = class MiddleWare {
  constructor({ debug: debug, observers: observers, stats: stats } = { debug: false, observers: [], stats: [] }) {
    this.debug = debug;
    this.observers = observers;
    this.stats = stats;
  }
  _debug(msg, type = 'log') {
    if (this.debug) {
      console[type](chalk.blue(`MiddleWare: ${msg}`));
    }
    return this;
  }
  _isDataValid(data) {
    if (!data || !data.length) {
      this._debug(`skipped: ${data}`);
      return false;
    }
    return true;
  }
  updateStats(observersData) {
    observersData.forEach((observerData) => {
      this.stats.forEach((stat) => {
        if (stat.isTriggered(observerData)) {
          stat.updateData(observerData);
        } else {
          console.log('nop', observerData);
        }
      });
    });
    if (!this.debug) {
      clear();
    }
    this.stats.forEach((stat) => {
      return _.each(stat.getValue(), (val, key) => {
        console.log(`${key}: ${val}`);
      });
    });
    return this;
  }
  addRuler(observer) {
    this.observers.push(observer);
    return this;
  }
  addobservers(observers = []) {
    this.observers = observers;
    return this;
  }
  checkObservers(data) {
    var found = [];
    this.observers.forEach((observer) => {
      if (!observer.test(data)) {
        this._debug(`${observer.name}: nop`);
        return;
      }
      found.push(observer.getFullData(data));
    });
    return found;
  }
  processData(data) {
    console.log(data);
    if (!this._isDataValid(data)) {
      return this;
    }
    console.log('passed');
    var observersData = this.checkObservers(data);
    if (!observersData.length) {
      return this;
    }
    this.updateStats(observersData);
    return this;
  }
}

module.exports = MiddleWare;
