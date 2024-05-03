import {createElement} from '../render.js';

const SORT_TYPES = ['Day', 'Event', 'Time', 'Price', 'Offers'];
const createSortsItemTemplate = (type, isActive) => `
    <div class="trip-sort__item  trip-sort__item--${type}">
        <input id="sort-${type}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${type}" ${isActive ? 'checked' : ''}>
        <label class="trip-sort__btn" for="sort-${type}">${type}</label>
    </div>`;

const createSortsTempale = () => `
    <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
        ${SORT_TYPES.map((type, index) => createSortsItemTemplate(type.toLowerCase(), index === 0)).join('')}
    </form>`;

export default class SortingsView {
  getTempale() {
    return createSortsTempale();
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
