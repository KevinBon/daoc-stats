import AbstractObserver from '../abstracts/abstract.observer.js';

var ObsExperience = class ObsExperience extends AbstractObserver {
  getData(explodedData, data) {
    return {
      xp: parseInt(explodedData[3].replace(/,/g, ''), 10)
    };
  }
}

export default new ObsExperience({
  name: 'experience',
  validator: /experience points/,
});
