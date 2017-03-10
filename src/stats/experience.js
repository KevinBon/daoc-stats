const AbstractStat = require('./abstract.stat.js');

var StatExperience = class StatExperience extends AbstractStat {
  constructor(...args) {
    args.observersTriggerBy = 'experience';
    super(args);
    this.data = [];
    this.kill = 0; // Nb of kills
    this.start = 0; // First kill Date
    this.end = 0; // Last kill Date
    this.total = 0; // Total Experiencne
    this.min = 0; // Minimum xp
    this.max = 0; // Maximum xp
    this.xpPerHour = 0; // xp per hour
  }
  getXPPerHour() {
    var timeStart = this.start.getTime();
    var timeEnd = this.end.getTime();
    var hourDiff =  timeEnd - timeStart; //in ms
    var secDiff = hourDiff / 1000; //in s
    var minDiff = hourDiff / 60 / 1000; //in minutes
    var hDiff = hourDiff / 3600 / 1000; //in hours
    var humanReadable = {}
    humanReadable.hours = Math.floor(hDiff);
    humanReadable.minutes = minDiff - 60 * humanReadable.hours;
    var alors = humanReadable.hours + ((humanReadable.minutes / 60));
    return Math.floor(Number(this.total / alors));
  }
  updateData(newData) {
    this.data.push(newData);
    this.kill++;
    if (this.start === 0) {
      this.start = newData.time;
    }
    this.end = newData.time;
    this.total += newData.data.xp;
    if (this.max === 0 || this.max < newData.data.xp) {
      this.max = newData.data.xp;
    }
    if (this.min === 0 || this.min > newData.data.xp) {
      this.min = newData.data.xp;
    }
    this.xpPerHour = this.getXPPerHour();

    return this;
  }
  getValue() {
    return {
      kill: this.kill,
      start: this.start,
      end: this.end,
      total: this.total,
      min: this.min,
      max: this.max,
      xpPerHour: this.xpPerHour,
    };
  }
}

module.exports = StatExperience;
