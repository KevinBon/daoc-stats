import AbstractObserver from '../abstracts/abstract.observer.js';

var ObsIteration = class ObsIteration extends AbstractObserver {
}

export default new ObsIteration({
  name: 'iteration',
  validator: /./,
});
