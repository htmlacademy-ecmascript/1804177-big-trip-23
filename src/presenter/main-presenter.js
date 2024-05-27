import {render, RenderPosition} from '../framework/render.js';

import SortingsView from '../view/sortings-view.js';
import PointListView from '../view/point-list-view.js';
import EmptyMessageView from '../view/empty-message-view.js';

import PointPresenter from './point-presenter.js';

import {Filters, isEmpty} from '../const.js';
import {updateData} from '../utils.js';

export default class MainPresenter {
  #pointListComponent = new PointListView();
  #container = null;
  #pointModel = null;

  #pointsPresenter = new Map();
  #sortComponent = new SortingsView();

  #points = [];

  constructor({container, pointModel}) {
    this.#container = container;
    this.#pointModel = pointModel;
  }

  init() {
    this.#points = [...this.#pointModel.getPoints()];
    this.#renderContent();
  }

  #renderContent() {
    const points = this.#pointModel.getPoints();

    if (isEmpty(points)) {
      this.#renderEmptyMessageView();
      return;
    }

    render(this.#sortComponent, this.#container);
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
    this.#pointsPresenter.get(updatePoint.id).init(updatePoint);
  };
}
