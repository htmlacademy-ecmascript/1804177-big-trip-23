import {render, RenderPosition, replace} from '../framework/render.js';
import SortingsView from '../view/sortings-view.js';
import EditFormView from '../view/edit-form-view.js';
import WaypointView from '../view/waypoint-view.js';
import EventListView from '../view/event-list-view.js';

export default class MainPresenter {
  eventListComponent = new EventListView();
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

    points.forEach((point) => {
      this.#renderPoint(point);
    });
  }

  #renderPoint(point) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    const pointComponent = new WaypointView({
      point,
      destinations: this.#pointModel.getDestinations(),
      offers: this.#pointModel.getOffers(),
      onEditClick: () => {
        replacePointToForm();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });

    const editFormComponent = new EditFormView({
      point,
      destinations: this.#pointModel.getDestinations(),
      offers: this.#pointModel.getOffers(),
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
