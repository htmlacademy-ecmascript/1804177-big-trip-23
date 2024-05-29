import {Filters} from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

const createFilterItemTemplate = (type, currentFilter, isDisabled) => `
    <div class="trip-filters__filter">
        <input id="filter-${type}"
        class="trip-filters__filter-input  visually-hidden"
        type="radio" name="trip-filter"
        value="${type}"
        ${type === currentFilter ? 'checked' : ''}
        ${isDisabled ? 'disabled' : ''}>
        <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
    </div>`;

const createFiltersTempale = (filters, currentFilter, isDisabled) => `
    <form class="trip-filters" action="#" method="get">
       ${Object.values(Filters).map((filter) => createFilterItemTemplate(filter, currentFilter, isDisabled)).join('')}

       <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`;

export default class FiltersView extends AbstractView{
  #filters = {};
  #currentFilter = '';
  #handleFilterChamge = null;
  #isDisabled = false;

  constructor({filters, currentFilter, onFilterChange, isDisabled}) {
    super();
    this.#filters = filters;
    this.#currentFilter = currentFilter;
    this.#handleFilterChamge = onFilterChange;
    this.#isDisabled = isDisabled;

    this.element.addEventListener('change', this.#filterChangeHandler);
  }

  get template() {
    return createFiltersTempale(this.#filters, this.#currentFilter, this.#isDisabled);
  }

  #filterChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleFilterChamge(evt.target.value);
  };
}
