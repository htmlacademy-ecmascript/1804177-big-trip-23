import {render, RenderPosition} from './framework/render.js';
import MainPresenter from './presenter/main-presenter.js';
import InfoView from './view/info-view.js';
import FiltersView from './view/filters-view.js';
import PointModel from './model/point-model.js';
import FilterModel from './model/filter-model.js';
import {Filters} from './const.js';

const tripMainElement = document.querySelector('.trip-main');
const tripControlsElement = tripMainElement.querySelector('.trip-controls');
const tripEventsElement = document.querySelector('.trip-events');

const filterModel = new FilterModel();
const pointModel = new PointModel();
pointModel.init();

const filtersView = new FiltersView({
  filters: Object.values(Filters),
  currentFilter: filterModel.filter,
  onFilterChange: (filter) => {
    filterModel.setFilter(filter);
  },
  isDisabled: !pointModel.getPoints().length > 0
});

render(new InfoView(), tripMainElement, RenderPosition.AFTERBEGIN);
render(filtersView, tripControlsElement);

const presenter = new MainPresenter({container: tripEventsElement, pointModel, filterModel});

presenter.init();
