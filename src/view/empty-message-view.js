import AbstractView from '../framework/view/abstract-view.js';
import {TripEmptyMessage} from '../const.js';

const createEmptyMessageTempale = (filter) => `<p class="trip-events__msg">${TripEmptyMessage[filter]}</p>`;

export default class EmptyMessageView extends AbstractView {
  #filter = '';

  constructor({filter}) {
    super();
    this.#filter = filter;
  }

  get template() {
    return createEmptyMessageTempale(this.#filter);
  }
}
