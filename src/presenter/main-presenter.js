import {remove, render, RenderPosition} from '../framework/render.js';

import SortingsView from '../view/sortings-view.js';
import PointListView from '../view/point-list-view.js';
import EmptyMessageView from '../view/empty-message-view.js';

import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';

import {FilterType, isEmpty, SortType, UpdateType, UserAction} from '../const.js';
import {sortByTime, sortByPrice} from '../utils/sort.js';
import {filter} from '../utils/filter.js';

export default class MainPresenter {
  #pointListComponent = new PointListView();
  #sortComponent = null;
  #emptyMessageComponent = null;

  #container = null;
  #pointModel = null;
  #filterModel = null;

  #newPointPresenter = null;
  #pointsPresenters = new Map();
  #currentSortType = SortType.DAY;

  constructor({container, pointModel, filterModel, onNewPointDestroy}) {
    this.#container = container;
    this.#pointModel = pointModel;
    this.#filterModel = filterModel;

    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: this.#pointListComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewPointDestroy
    });

    this.#pointModel.addObserver(this.#handleModelPoint);
    this.#filterModel.addObserver(this.#handleModelPoint);
  }

  get points() {
    const filterType = this.#filterModel.filter;
    const points = this.#pointModel.points;
    const filteredPoint = filter[filterType](points);

    switch (this.#currentSortType) {
      case SortType.TIME:
        return [...filteredPoint].sort(sortByTime);
      case SortType.PRICE:
        return [...filteredPoint].sort(sortByPrice);
    }

    return filteredPoint;
  }

  init() {
    this.#renderSort();
    this.#renderContent();
  }

  createPoint() {
    this.#currentSortType = SortType.DAY;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);

    this.#newPointPresenter.init({
      offers: this.#pointModel.offers,
      destinations: this.#pointModel.destinations
    });
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }
    this.#currentSortType = sortType;
    this.#clearPoint();
    this.#renderContent();
  };

  #renderSort() {
    this.#sortComponent = new SortingsView({
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#container);
  }

  #renderContent() {
    if (isEmpty(this.points)) {
      this.#renderEmptyMessageView();
      return;
    }

    render(this.#pointListComponent, this.#sortComponent.element, RenderPosition.AFTEREND);

    this.points.forEach((point) => {
      this.#renderPoint(point);
    });
  }

  #renderEmptyMessageView() {
    this.#emptyMessageComponent = new EmptyMessageView({
      filter: this.#filterModel.filter
    });

    render(this.#emptyMessageComponent, this.#container);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      container: this.#pointListComponent.element,
      point,
      destinations: this.#pointModel.destinations,
      offers: this.#pointModel.offers,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange
    });
    pointPresenter.init(point);
    this.#pointsPresenters.set(point.id, pointPresenter);
  }

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointsPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = (actyonType, updateType, update) => {
    switch (actyonType) {
      case UserAction.UPDATE_POINT:
        this.#pointModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointModel.deletePoint(updateType, update);
        break;
    }
  };

  #handleModelPoint = (updateType, data) => {
    switch (updateType) {
      case UpdateType.MINOR:
        this.#pointsPresenters.get(data.id).init(data);
        break;
      case UpdateType.MAJOR:
        this.#clearPoint({resetSortType: true});
        this.#renderSort();
        this.#renderContent();
        break;
    }
  };

  #clearPoint({resetSortType = false} = {}) {
    this.#newPointPresenter.destroy();
    this.#pointsPresenters.forEach((presenter) => presenter.destroy());
    this.#pointsPresenters.clear();

    if (resetSortType) {
      remove(this.#sortComponent);
      this.#currentSortType = SortType.DAY;
    }

    if (this.#renderEmptyMessageView) {
      remove(this.#emptyMessageComponent);
    }
  }
}
