import {render, RenderPosition} from '../framework/render.js';

import SortingsView from '../view/sortings-view.js';
import PointListView from '../view/point-list-view.js';
import EmptyMessageView from '../view/empty-message-view.js';

import PointPresenter from './point-presenter.js';

import {isEmpty, SortType} from '../const.js';
import {updateDataPoint} from '../utils/common.js';
import {sortByTime, sortByPrice} from '../utils/sort.js';

export default class MainPresenter {
  #pointListComponent = new PointListView();
  #sortComponent = null;

  #container = null;
  #pointModel = null;
  #filterModel = null;

  #pointsPresenters = new Map();
  #currentSortType = SortType.DAY;
  #sourcedPoints = [];
  #points = [];

  constructor({container, pointModel, filterModel}) {
    this.#container = container;
    this.#pointModel = pointModel;
    this.#filterModel = filterModel;
  }

  init() {
    this.#points = [...this.#pointModel.getPoints()];
    this.#sourcedPoints = [...this.#pointModel.getPoints()];
    this.#renderSort();
    this.#renderContent();
  }

  #sortPoint(sortType) {
    switch (sortType) {
      case SortType.TIME:
        this.#points.sort(sortByTime);
        break;
      case SortType.PRICE:
        this.#points.sort(sortByPrice);
        break;
      default:
        this.#points = [...this.#sourcedPoints];
    }

    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortPoint(sortType);
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
    if (isEmpty(this.#points)) {
      this.#renderEmptyMessageView();
      return;
    }

    render(this.#pointListComponent, this.#sortComponent.element, RenderPosition.AFTEREND);

    this.#points.forEach((point) => {
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
      destinations: this.#pointModel.getDestinations(),
      offers: this.#pointModel.getOffers(),
      onDataChange: this.#handlePointChange,
      onModeChange: this.#handleModeChange
    });
    pointPresenter.init(point);
    this.#pointsPresenters.set(point.id, pointPresenter);
  }

  #handleModeChange = () => {
    this.#pointsPresenters.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatePoint) => {
    this.#points = updateDataPoint(this.#points, updatePoint);
    this.#sourcedPoints = updateDataPoint(this.#sourcedPoints, updatePoint);
    this.#pointsPresenters.get(updatePoint.id).init(updatePoint);
  };

  #clearPointList() {
    this.#pointsPresenters.forEach((presenter) => presenter.destroy());
    this.#pointsPresenters.clear();
  }
}
