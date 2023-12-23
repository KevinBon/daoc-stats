const defaultConstParam = {
  debug: false,
  label: "",
  value: 0,
  observersTriggerBy: [],
  autoUpdatable: true,
  pick: [],
};

var AbstractStat = class AbstractStat {
  constructor({
    debug: debug,
    label: label,
    value: value,
    observersTriggerBy: observersTriggerBy,
    autoUpdatable: autoUpdatable,
    pick: pick,
  } = defaultConstParam) {
    this.debug = debug;
    this.label = label;
    this.value = value;
    this.observersTriggerBy = observersTriggerBy;
    this.autoUpdatable = autoUpdatable;
    this.pick = pick;
    this.afterConstructor();
  }
  afterConstructor() {}
  isTriggered(observer) {
    return this.observersTriggerBy.includes(observer.name);
  } // Handle data update without data
  isAutoUpdatable() {
    return this.autoUpdatable;
  }
  // abstract
  updateData(newData) {
    ("updateData must be declared");
  }
  getLabel() {
    return this.label;
  }
  // abstract
  _getValue() {
    return this.value;
  }
  getValue() {
    var val = this._getValue();
    // if (this.pick && this.pick.length) {
    //   val = _pick(val, this.pick);
    // }
    return val;
  }
};

export default AbstractStat;
