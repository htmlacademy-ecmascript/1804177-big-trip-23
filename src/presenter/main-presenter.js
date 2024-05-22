import {render, RenderPosition, replace} from '../framework/render.js';
import SortingsView from '../view/sortings-view.js';
import EditFormView from '../view/edit-form-view.js';
import PointView from '../view/point-view.js';
import PointListView from '../view/point-list-view.js';
import EmptyMessageView from '../view/empty-message-view.js';
import {Filters} from '../const.js';

export default class MainPresenter {
  eventListComponent = new PointListView();
  #container = null;
  #pointModel = null;

  constructor({container, pointModel}) {
    this.#container = container;
    this.#pointModel = pointModel;
  }

  init() {
    const points = this.#pointModel.getPoints();

    render(new SortingsView(), this.#container);
    render(this.eventListComponent, this.#container);

    const isEmpty = (array) => !(array && array.length > 0);
    if (isEmpty(points)) {
      this.#renderEmptyMessageView();
      return;
    }

    points.forEach((point) => {
      this.#renderPoint(point);
    });
  }

  #renderEmptyMessageView() {
    render(new EmptyMessageView({filter: Filters}), this.#container);
  }

  #renderPoint(point) {
    const destinations = this.#pointModel.getDestinations();
    const offers = this.#pointModel.getOffers();

    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const pointComponent = new PointView({
      point,
      destinations: destinations,
      offers: offers,
      onEditClick: () => {
        replacePointToForm();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    const editFormComponent = new EditFormView({
      point,
      destinations: destinations,
      offers: offers,
      onFormSubmit: () => {
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      },
      onEditClick: () => {
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    function replaceFormToPoint() {
      replace(pointComponent, editFormComponent);
    }

    function replacePointToForm() {
      replace(editFormComponent, pointComponent);
    }

    render(pointComponent, this.eventListComponent.element, RenderPosition.BEFOREEND);
  }
}
