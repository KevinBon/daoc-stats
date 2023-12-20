import AbstractStat from '../abstracts/abstract.stat.js';

var StatExperience = class StatExperience extends AbstractStat {
  afterConstructor() {
    this.data = [];
    this.kill = 0; // Nb of kills
    this.start = 0; // First kill Date
    this.end = 0; // Last kill Date
    this.total = 0; // Total Experiencne
    this.min = 0; // Minimum xp
    this.max = 0; // Maximum xp
    this.xpPerHour = 0; // xp per hour
    this.elapsedSinceStartHour = 0; // elapsedSinceStart Hour
    this.elapsedSinceStartMinutes = 0; // elapsedSinceStart Minutes
    this.elapsedSinceStartSecondes = 0; // elapsedSinceStart Secondes
  }
  getXPPerHour() {
    // Start at the first kill
    if (this.kill === 0) {
      return 0;
    }

    var timeStart = this.start && this.start.getTime() || +new Date();
    var timeEnd = +new Date();
    var hourDiff =  timeEnd - timeStart; //in ms
    var secDiff = hourDiff / 1000; // in s
    var minDiff = hourDiff / 60 / 1000; //in minutes
    var hDiff = hourDiff / 3600 / 1000; //in hours
    var humanReadable = {}
    humanReadable.hours = Math.floor(hDiff);
    humanReadable.minutes = Math.floor(minDiff - 60 * humanReadable.hours);
    this.elapsedSinceStartHour = humanReadable.hours;
    this.elapsedSinceStartMinutes = humanReadable.minutes;
    this.elapsedSinceStartSecondes = Math.floor(secDiff / 1000);

    var alors = humanReadable.hours + ((humanReadable.minutes / 60));
    return Math.floor(Number(this.total / alors));
  }
  updateData(newData = null) {
    if (newData !== null) {
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
    }
    this.xpPerHour = this.getXPPerHour();

    return this;
  }
  _getValue() {
    return {
      kill: this.kill,
      start: this.start,
      end: this.end,
      total: this.total,
      min: this.min,
      max: this.max,
      xpPerHour: this.xpPerHour,
      elapsedSinceStartHour: this.elapsedSinceStartHour,
      elapsedSinceStartMinutes: this.elapsedSinceStartMinutes,
      elapsedSinceStartSecondes: this.elapsedSinceStartSecondes,
    };
  }
}

export default new StatExperience({
  observersTriggerBy: 'experience'
});
