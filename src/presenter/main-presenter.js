import {render, RenderPosition} from '../framework/render.js';

import SortingsView from '../view/sortings-view.js';
import PointListView from '../view/point-list-view.js';
import EmptyMessageView from '../view/empty-message-view.js';

import PointPresenter from './point-presenter.js';

import {Filters, isEmpty, SortType} from '../const.js';
import {updateData} from '../utils/common.js';
import {sortByTime, sortByPrice} from '../utils/sort.js';

export default class MainPresenter {
  #pointListComponent = new PointListView();
  #sortComponent = null;

  #container = null;
  #pointModel = null;

  #pointsPresenter = new Map();
  #currentSortType = SortType.DAY;
  #soursedPoits = [];
  #points = [];

  constructor({container, pointModel}) {
    this.#container = container;
    this.#pointModel = pointModel;
  }

  init() {
    this.#points = [...this.#pointModel.getPoints()];
    this.#soursedPoits = [...this.#pointModel.getPoints()];
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
        this.#points = [...this.#soursedPoits];
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
    const points = this.#pointModel.getPoints();

    if (isEmpty(points)) {
      this.#renderEmptyMessageView();
      return;
    }

    render(this.#pointListComponent, this.#sortComponent.element, RenderPosition.AFTEREND);

    this.#points.forEach((point) => {
      this.#renderPoint(point);
    });
  }

  #renderEmptyMessageView() {
    render(new EmptyMessageView({filter: Filters}), this.#container);
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
    this.#pointsPresenter.set(point.id, pointPresenter);
  }

  #handleModeChange = () => {
    this.#pointsPresenter.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatePoint) => {
    this.#points = updateData(this.#points, updatePoint);
    this.#soursedPoits = updateData(this.#soursedPoits, updatePoint);
    this.#pointsPresenter.get(updatePoint.id).init(updatePoint);
  };

  #clearPointList() {
    this.#pointsPresenter.forEach((presenter) => presenter.destroy());
    this.#pointsPresenter.clear();
  }
}
