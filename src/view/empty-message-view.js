import AbstractView from '../framework/view/abstract-view.js';
import {TripEmptyMessage} from '../const.js';

const LoadMessages = {
  LOADING: 'Loading...',
  FAILED: 'Failed to load latest route information'
};

const createEmptyMessageTempale = (filter) => `<p class="trip-events__msg">${filter}</p>`;

export default class EmptyMessageView extends AbstractView {
  #emptyMessage = null;

  constructor({filter, isLoading, isFailed}) {
    super();
    if (isLoading) {
      this.#emptyMessage = LoadMessages.LOADING;
      return;
    }
    if (isFailed) {
      this.#emptyMessage = LoadMessages.FAILED;
      return;
    }
    this.#emptyMessage = TripEmptyMessage[filter];
  }

  get template() {
    return createEmptyMessageTempale(this.#emptyMessage);
  }
}
