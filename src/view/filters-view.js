import {FILTER_TYPES} from '../const.js';
import AbstractView from '../framework/view/abstract-view.js';

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

export default class FiltersView extends AbstractView{
  get template() {
    return createFiltersTempale();
  }
}
