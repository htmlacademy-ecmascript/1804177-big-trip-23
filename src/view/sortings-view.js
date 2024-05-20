import {SORT_TYPES} from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

const createSortsItemTemplate = (type, isActive) => `
    <div class="trip-sort__item  trip-sort__item--${type}">
        <input id="sort-${type}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${type}" ${isActive ? 'checked' : ''}>
        <label class="trip-sort__btn" for="sort-${type}">${type}</label>
    </div>`;

const createSortsTempale = () => `
    <form class="trip-events__trip-sort  trip-sort" action="#" method="get">
        ${SORT_TYPES.map((type, index) => createSortsItemTemplate(type.toLowerCase(), index === 0)).join('')}
    </form>`;

export default class SortingsView extends AbstractView{
  get template() {
    return createSortsTempale();
  }
}
