import {render, RenderPosition} from '../framework/render.js';

import SortingsView from '../view/sortings-view.js';
import PointListView from '../view/point-list-view.js';
import EmptyMessageView from '../view/empty-message-view.js';

import PointPresenter from './point-presenter.js';

import {isEmpty, SortType, UpdateType, UserAction} from '../const.js';
import {sortByTime, sortByPrice} from '../utils/sort.js';

export default class MainPresenter {
  #pointListComponent = new PointListView();
  #sortComponent = null;

  #container = null;
  #pointModel = null;
  #filterModel = null;

  #pointsPresenters = new Map();
  #currentSortType = SortType.DAY;

  constructor({container, pointModel, filterModel}) {
    this.#container = container;
    this.#pointModel = pointModel;
    this.#filterModel = filterModel;

    this.#pointModel.addObserver(this.#handleModelPoint);
  }

  get points() {
    switch (this.#currentSortType) {
      case SortType.TIME:
        return [...this.#pointModel.points].sort(sortByTime);
      case SortType.PRICE:
        return [...this.#pointModel.points].sort(sortByPrice);
    }

    return this.#pointModel.points;
  }

  init() {
    this.#renderSort();
    this.#renderContent();
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#clearPointList();
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
    render(new EmptyMessageView({filter: this.#filterModel.filter}), this.#container);
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
      case UpdateType.PATCH:
        this.#pointsPresenters.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this.#clearPoint();
        this.#renderContent();
        break;
      case UpdateType.MAJOR:
        this.#clearPoint({resetSortType: true});
        this.#renderContent();
        break;
    }
  };

  #clearPointList() {
    this.#pointsPresenters.forEach((presenter) => presenter.destroy());
    this.#pointsPresenters.clear();
  }

  #clearPoint({resetSortType = false} = {}) {
    this.#pointsPresenters.forEach((presenter) => presenter.destroy());
    this.#pointsPresenters.clear();

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }
}
