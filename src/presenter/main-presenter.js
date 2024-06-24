import {remove, render, RenderPosition} from '../framework/render.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

import SortingsView from '../view/sortings-view.js';
import PointListView from '../view/point-list-view.js';
import EmptyMessageView from '../view/empty-message-view.js';

import PointPresenter from './point-presenter.js';
import NewPointPresenter from './new-point-presenter.js';

import {FilterType, isEmpty, SortType, UpdateType, UserAction} from '../const.js';
import {sortByTime, sortByPrice, sortByDay} from '../utils/sort.js';
import {filter} from '../utils/filter.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

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
  #isLoading = true;
  #isLoadingFailed = false;
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

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
      case SortType.DAY:
        return [...filteredPoint].sort(sortByDay);
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

  handleApiError() {
    this.#isLoading = false;
    this.#isLoadingFailed = true;

    this.#clearPoint();
    this.#renderContent(this.#isLoadingFailed);
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
  }

  #renderContent() {
    if (isEmpty(this.points)) {
      this.#renderEmptyMessageView(this.#isLoadingFailed);
      return;
    }

    render(this.#sortComponent, this.#container);
    render(this.#pointListComponent, this.#sortComponent.element, RenderPosition.AFTEREND);

    this.points.forEach((point) => {
      this.#renderPoint(point);
    });
  }

  #renderEmptyMessageView(isLoadFailed) {

    this.#emptyMessageComponent = new EmptyMessageView({
      filter: this.#filterModel.filter,
      isLoading: this.#isLoading,
      isFailed: isLoadFailed,
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

  #handleViewAction = async (actyonType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actyonType) {
      case UserAction.UPDATE_POINT:
        this.#pointsPresenters.get(update.id).setSaving();
        try {
          await this.#pointModel.updatePoint(updateType, update);
        } catch (err) {
          this.#pointsPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        try {
          await this.#pointModel.addPoint(updateType, update);
        } catch (err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointsPresenters.get(update.id).setDeleting();
        try {
          await this.#pointModel.deletePoint(updateType, update);
        } catch (err) {
          this.#pointsPresenters.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
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
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#emptyMessageComponent);
        this.#clearPoint();
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
