import { createElement } from '../render.js';

const createEventListTempale = () => '<ul class="trip-events__list"></ul>';

export default class EventListView {
  getTempale() {
    return createEventListTempale();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTempale());
    }

    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
