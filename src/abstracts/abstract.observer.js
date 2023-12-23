const defaultConstParam = {
  debug: false,
  validator: null,
  name: "",
};

var AbstractObserver = class AbstractObserver {
  constructor({
    debug: debug,
    validator: validator,
    name: name,
  } = defaultConstParam) {
    this.debug = debug;
    this.validator = validator;
    this.name = name;
    this.afterConstructor();
  }
  afterConstructor() {}
  test(txt) {
    return this.validator.test(txt);
  }
  getTimeData(explodedData) {
    // Time
    const timeData = explodedData[0].replace(/\]|\[/g, "").split(":");
    let time = new Date();
    time.setHours(parseInt(timeData[0], 10));
    time.setMinutes(parseInt(timeData[1], 10));
    time.setSeconds(parseInt(timeData[2], 10));
    return time;
  }
  getExplodedData(data) {
    return data.split(" ");
  }
  getFullData(data) {
    let explodedData = this.getExplodedData(data);
    return {
      name: this.name,
      time: this.getTimeData(explodedData),
      data: this.getData(explodedData, data),
    };
  }
  getData(explodedData, data) {
    return {};
  }
};

export default AbstractObserver;
