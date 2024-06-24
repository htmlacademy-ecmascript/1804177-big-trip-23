import {remove, render, RenderPosition} from '../framework/render.js';

import {UpdateType, UserAction} from '../const.js';
import EditFormView from '../view/edit-form-view.js';

const BLANK_EVENT = {
  dateFrom: null,
  dateTo: null,
  basePrice: 0,
  isFavorite: false,
  offers: [],
  destination: null,
  type: 'flight'
};

export default class NewPointPresenter {
  #pointListContainer = null;
  #handleDataChange = null;
  #handleDestroy = null;

  #editFormView = null;

  constructor({pointListContainer, onDataChange, onDestroy}) {
    this.#pointListContainer = pointListContainer;
    this.#handleDataChange = onDataChange;
    this.#handleDestroy = onDestroy;
  }

  init({offers, destinations}) {
    if (this.#editFormView !== null) {
      return;
    }

    this.#editFormView = new EditFormView({
      point: BLANK_EVENT,
      offers,
      destinations,
      onFormSubmit: this.#handleFormSubmit,
      onDeleteClick: this.#handleDeleteClick
    });

    render(this.#editFormView, this.#pointListContainer, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this.#escKeyDownHandler);
  }

  destroy() {
    if (this.#editFormView === null) {
      return;
    }

    this.#handleDestroy();

    remove(this.#editFormView);
    this.#editFormView = null;

    document.removeEventListener('keydown', this.#escKeyDownHandler);
  }

  setSaving() {
    this.#editFormView.updateElement({
      isDisabled: true,
      isSaveIng: true,
    });
  }

  setAborting() {
    const resetFormState = () => {
      this.#editFormView.updateElement({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this.#editFormView.shake(resetFormState);
  }

  #handleFormSubmit = (point) => {
    this.#handleDataChange(
      UserAction.ADD_POINT,
      UpdateType.MAJOR,
      point
    );
  };

  #handleDeleteClick = () => {
    this.destroy();
  };

  #escKeyDownHandler = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.destroy();
    }
  };
}
