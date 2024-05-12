import { createElement } from '../render.js';
import {FILTER_TYPES} from '../const.js';

const createFilterItemTemplate = (type, isActive) => `
    <div class="trip-filters__filter">
        <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" ${isActive ? 'checked' : ''}>
        <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
    </div>`;

const createFiltersTempale = () => `
    <form class="trip-filters" action="#" method="get">
       ${FILTER_TYPES.map((type, index) => createFilterItemTemplate(type.toLowerCase(), index === 0)).join('')}

       <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`;

export default class FiltersView {
  getTempale() {
    return createFiltersTempale();
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
