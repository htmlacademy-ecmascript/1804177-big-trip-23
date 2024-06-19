import {remove, render, RenderPosition, replace} from '../framework/render.js';

import PointView from '../view/point-view.js';
import EditFormView from '../view/edit-form-view.js';

import {Mode, UserAction, UpdateType} from '../const.js';
import {isDatesEqual} from '../utils/common.js';

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
    const prevEditFormView = this.#editFormView;

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
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleDeleteClick,
      onEditClick: () => {
        this.#replaceFormToPoint();
      }
    });

    if (prevPointView === null || prevEditFormView === null) {
      render(this.#pointView, this.#container, RenderPosition.BEFOREEND);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointView, prevPointView);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#pointView, prevEditFormView);
      this.#mode = Mode.DEFAULT;
    }

    remove(prevPointView);
    remove(prevEditFormView);
  }

  #handleFormSubmit = (update) => {
    const isMajorUpdate =
      !isDatesEqual(this.#point.dateFrom, update.dateTo) ||
      !isDatesEqual(this.#point.dateTo, update.dateFrom) ||
      this.#point.basePrice !== update.basePrice;

    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      isMajorUpdate ? UpdateType.MAJOR : UpdateType.MINOR,
      update,
    );
    this.#replacePointToForm();
  };

  #handleDeleteClick = (point) => {
    this.#handleDataChange(
      UserAction.DELETE_POINT,
      UpdateType.MAJOR,
      point,
    );
  };

  destroy() {
    remove(this.#pointView);
    remove(this.#editFormView);

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  resetView() {
    if (this.#mode === Mode.EDITING) {
      this.#editFormView.reset(this.#point);
      this.#replaceFormToPoint();
    }
  }

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#editFormView.updateElement({
        isDisabled: true,
        isSaving: true,
      });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#editFormView.updateElement({
        isDisabled: true,
        isDeleting: true,
      });
    }
  }

  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.#editFormView.shake();
      return;
    }
    const resetFormState = () => {
      this.#editFormView.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#editFormView.shake(resetFormState);
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
      this.resetView();
    }
  };

  #handleFavoriteClick = () => {
    this.#handleDataChange(
      UserAction.UPDATE_POINT,
      UpdateType.MINOR,
      {...this.#point, isFavorite: !this.#point.isFavorite});
  };
}
