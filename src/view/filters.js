import { createElement } from '../render.js';

const FILTER_TYPES = ['Everything', 'Future', 'Present', 'Past'];
const createFilertItemTemplate = (type) => `
    <div class="trip-filters__filter">
        <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" checked>
        <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
    </div>`;

const createFiltersTempale = () => `
    <form class="trip-filters" action="#" method="get">
       ${FILTER_TYPES.map((type) => createFilertItemTemplate(type.toLowerCase())).join('')}

       <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`;

export default class Filters {
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
