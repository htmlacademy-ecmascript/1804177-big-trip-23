import AbstractView from '../framework/view/abstract-view.js';
import {SortType} from '../const.js';

const createSortsItemTemplate = (type, isActive, isDisabled) => `
    <div class="trip-sort__item  trip-sort__item--${type}">
        <input id="sort-${type}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" data-sort-type="${type}" value="sort-${type}" ${isActive ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
        <label class="trip-sort__btn" for="sort-${type}">${type}</label>
    </div>`;

const createSortsTempale = () => `
    <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
        ${Object.values(SortType).map((type, index) => createSortsItemTemplate(type.toLowerCase(), index === 0, type === 'event' || type === 'offers')).join('')}
    </form>`;

export default class SortingsView extends AbstractView {
  #handleSortTypeChange = null;

  constructor({onSortTypeChange}) {
    super();
    this.#handleSortTypeChange = onSortTypeChange;

    this.element.addEventListener('change', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortsTempale();
  }

  #sortTypeChangeHandler = (evt) => this.#handleSortTypeChange(evt.target.dataset.sortType);
}
