import {Filters, UpdateType} from '../const.js';
import FiltersView from '../view/filters-view.js';
import {remove, replace} from '../framework/render.js';
import {render} from '../render.js';

export default class FilterPresenter {
  #filterContainre = null;
  #filterModel = null;
  #pointModel = null;

  #filterComponent = null;

  constructor({filterContainre, filterModel, pointModel}) {
    this.#filterContainre = filterContainre;
    this.#filterModel = filterModel;
    this.#pointModel = pointModel;

    this.#filterModel.addObserver(this.#handleModelPoint);
    this.#pointModel.addObserver(this.#handleModelPoint);
  }

  get filters() {
    return Object.values(Filters).map((type) => ({type}));
  }

  init() {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new FiltersView({
      filters,
      currentFilter: this.#filterModel.filter,
      onFilterTypeChange: this.#handleFilterTypeChange
    });

    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filterContainre);
      return;
    }

    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #handleModelPoint = () => {
    this.init();
  };

  #handleFilterTypeChange = (filterType) => {
    if (this.#pointModel.filter === filterType) {
      return;
    }

    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}
