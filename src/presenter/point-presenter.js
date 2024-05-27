import {remove, render, RenderPosition, replace} from '../framework/render.js';

import PointView from '../view/point-view.js';
import EditFormView from '../view/edit-form-view.js';

import {Mode} from '../const.js';

export default class PointPresenter {
  #container = null;
  #point = null;

  #destinations = [];
  #offers = [];

  #pointView = null;
  #editFormView = null;

  #handleDataChange = null;
  #handleModeChange = null;

  #mode = Mode.DEFAULT;

  constructor({container, point, destinations, offers, onDataChange, onModeChange}) {
    this.#container = container;

    this.#point = point;
    this.#destinations = destinations;
    this.#offers = offers;

    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;
    this.#renderPoint(this.#point, this.#destinations, this.#offers);
  }

  #renderPoint(point, destinations, offers) {
    const prevPointView = this.#pointView;

    this.#pointView = new PointView({
      point,
      destinations,
      offers,
      onEditClick: () => {
        this.#replacePointToForm();
      },
      onFavoriteClick: this.#handleFavoriteClick,
    });

    this.#editFormView = new EditFormView({
      point,
      destinations,
      offers,
      onFormSubmit: () => {
        this.#replaceFormToPoint();
      },
      onEditClick: () => {
        this.#replaceFormToPoint();
      }
    });

    if (prevPointView === null) {
      render(this.#pointView, this.#container, RenderPosition.BEFOREEND);
      return;
    }

    replace(this.#pointView, prevPointView);
  }

  destroy() {
    remove(this.#pointView);
    remove(this.#editFormView);

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  resetView() {
    if (this.#mode === Mode.EDITING) {
      this.#replaceFormToPoint();
    }
  }

  #replacePointToForm() {
    replace(this.#editFormView, this.#pointView);
    document.addEventListener('keydown', this.#escKeyDownHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceFormToPoint() {
    replace(this.#pointView, this.#editFormView);
    document.removeEventListener('keydown', this.#escKeyDownHandler);
    this.#mode = Mode.DEFAULT;
  }

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape') {
      this.#replaceFormToPoint();
    }
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange({...this.#point, isFavorite: !this.#point.isFavorite});
  };
}
