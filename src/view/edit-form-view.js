import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import he from 'he';

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import {formatDate, capitalizeFirstLetter} from '../utils/common.js';

const regExp = /[^0-9,]/g;

const pointTypeItemTempalte = (point, pointId, type) => {
  const {isDisabled} = point;

  return `
    <div class="event__type-item">
        <input id="event-type-${point.type}-${pointId}"
        class="event__type-input  visually-hidden"
        type="radio"
        name="event-type"
        value="${point.type}"
        ${point.type === type ? 'checked' : ''}
        ${isDisabled ? 'disabled' : ''}>

        <label class="event__type-label  event__type-label--${point.type}" for="event-type-${point.type}-${pointId}">${capitalizeFirstLetter(point.type)}</label>
    </div>`;
};

const pointOfferSelectorTempalte = (typeOffer, pointOffers) => `
    <div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden"
        id="${typeOffer.id}"
        type="checkbox"
        name="event-offer-luggage"
        ${pointOffers.map((offer) => offer.id).includes(typeOffer.id) ? 'checked' : ''}>

        <label class="event__offer-label" for="${typeOffer.id}">
          <span class="event__offer-title">${typeOffer.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${typeOffer.price}</span>
        </label>
    </div>`;

const pointSectionOffersTempalte = (typeOffers, pointOffers) => `
    <section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
          ${typeOffers.map((typeOffer) => (pointOfferSelectorTempalte(typeOffer, pointOffers))).join('')}
        </div>
    </section>`;

const pointSectionDestinationTempalte = (description, pictures) => `
    ${pictures.length > 0
    ? `
    <section class="event__section  event__section--destination">
        <h3 class="event__section-title  event__section-title--destination">Destination</h3>
        <p class="event__destination-description">${description}</p>

        <div class="event__photos-container">
            <div class="event__photos-tape">
                ${pictures.map((pictype) => `<img class="event__photo" src="${pictype.src}" alt="${pictype.description}">`)}
            </div>
       </div>`
    : ''}
    </section>`;

const createFormTemplate = (point, destinations, offers) => {
  const pointDestinations = destinations.find((destination) => destination.id === point.destination);
  const typeOffers = offers.find((offer) => offer.type === point.type).offers;
  const pointOffers = typeOffers.filter((typeOffer) => point.offers.includes(typeOffer.id));
  const pointId = point.id || null;

  const {dateFrom, dateTo, type, basePrice, isDisabled, isSaving, isDeleting} = point;
  const {description, pictures} = pointDestinations || {};

  const startDate = formatDate(dateFrom);
  const endDate = formatDate(dateTo);

  return (`
<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-${pointId}">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${pointId}" type="checkbox">
          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>
              ${offers.map((offer) => pointTypeItemTempalte(offer, pointId, type, isDisabled)).join('')}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${pointId}">
            ${type}
          </label>

      <input class="event__input  event__input--destination"
            id="event-destination-${pointId}"
            type="text"
            name="event-destination"
            value="${he.encode(pointDestinations?.name ?? '')}"
            list="destination-list-${pointId}"
            ${isDisabled ? 'disabled' : ''}>
          <datalist id="destination-list-${pointId}">
                ${destinations.map((destination) => `<option value="${destination.name}"></option>`).join('')}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time"
          id="event-start-time-1"
          type="text"
          name="event-start-time"
          value="${startDate.dateHoursMinute ? startDate.dateHoursMinute : ''}"
          ${isDisabled ? 'disabled' : ''}>
          &mdash;
          <label class="visually-hidden" for="event-end-time-${pointId}">To</label>
          <input class="event__input  event__input--time"
          id="event-end-time-${pointId}"
          type="text"
          name="event-end-time"
          value="${endDate.dateHoursMinute ? endDate.dateHoursMinute : ''}"
          ${isDisabled ? 'disabled' : ''}>
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-${pointId}">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price"
          id="event-price-${pointId}"
          type="text"
          name="event-price"
          value="${he.encode(basePrice.toString())}"
          ${isDisabled ? 'disabled' : ''}>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>
        ${isSaving ? 'Saving...' : 'Save'}
      </button>
      ${point.id
      ? `<button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${isDeleting ? 'Deleting...' : 'Delete'}</button>
       <button class="event__rollup-btn" type="button" ${isDisabled ? 'disabled' : ''}><span class="visually-hidden">Open event</span></button>`
      : `<button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>Cancel</button>`}
      </header>
      <section class="event__details">
        ${typeOffers.length > 0 ? pointSectionOffersTempalte(typeOffers, pointOffers) : ''}
        ${pointDestinations ? pointSectionDestinationTempalte(description, pictures) : ''}
      </section>
    </form>
</li>`);
};

export default class EditFormView extends AbstractStatefulView {
  #point = null;
  #destinations = null;
  #offers = null;
  #datepickerStart = null;
  #datepickerEnd = null;

  #handleFormSubmit = null;
  #handleEditClick = null;
  #handleDeleteClick = null;

  constructor({point, destinations, offers, onFormSubmit, onEditClick, onDeleteClick}) {
    super();
    this._setState(EditFormView.parseStateToPoint(point));
    this.#point = point;
    this.#destinations = destinations;
    this.#offers = offers;

    this.#handleFormSubmit = onFormSubmit;
    this.#handleEditClick = onEditClick;
    this.#handleDeleteClick = onDeleteClick;

    this._restoreHandlers();
  }

  get template() {
    return createFormTemplate(this._state, this.#destinations, this.#offers);
  }

  reset(point) {
    this.updateElement(EditFormView.parseStateToPoint(point));
  }

  removeElement() {
    super.removeElement();

    if (this.#datepickerStart) {
      this.#datepickerStart.destroy();
      this.#datepickerStart = null;
    }
    if (this.#datepickerEnd) {
      this.#datepickerEnd.destroy();
      this.#datepickerEnd = null;
    }
  }

  _restoreHandlers() {
    this.element.querySelector('form')?.addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event--edit').addEventListener('change', this.#formChangeHandler);
    this.element.querySelector('.event__rollup-btn')?.addEventListener('click', this.#editClickHandler);
    this.element.querySelector('.event__type-group')?.addEventListener('change', this.#typeToggleHandler);
    this.element.querySelector('.event__input--destination')?.addEventListener('change', this.#destinationTypeHandler);
    this.element.querySelector('.event__reset-btn')?.addEventListener('click', this.#formDeleteHandler);
    this.element.querySelector('.event__input--price')?.addEventListener('input', this.#priceInputHandler);

    this.#setDatePickerStart();
    this.#setDatePickerEnd();
  }

  #typeToggleHandler = (evt) => {
    evt.preventDefault();
    if (this._state.type === evt.target.value) {
      return;
    }
    this.updateElement({
      type: evt.target.value,
      offers: []
    });
  };

  #offerChangeHandler = (evt) => {
    let offers = [...this._state.offers];
    if (evt.target.checked) {
      offers.push(evt.target.id);
    } else {
      offers = offers.filter((id) => id !== evt.target.id);
    }

    this.updateElement({ offers: offers });
  };

  #formChangeHandler = (evt) => {
    const input = evt.target;

    if (input.matches('.event__offer-checkbox')) {
      this.#offerChangeHandler(evt);
    } else if (input.matches('.event__type-input')) {
      this.#typeToggleHandler(evt);
    }
  };

  #destinationTypeHandler = (evt) => {
    evt.preventDefault();
    const selectedDestination = this.#destinations.find((destination) => evt.target.value === destination.name);
    if (!selectedDestination) {
      this.shake();
      return;
    }
    this.updateElement({
      destination: selectedDestination.id
    });
  };

  #dateFromChangeHandler = ([userDate]) => {
    this._setState({
      dateFrom: userDate.toISOString()
    });
    this.#datepickerEnd.set('minDate', userDate);
  };

  #dateToChangeHandler = ([userDate]) => {
    this._setState({
      dateTo: userDate.toISOString()
    });
    this.#datepickerStart.set('maxDate', userDate);
  };

  #priceInputHandler = (evt) => {
    if (evt.target.value === '' || regExp.test(evt.target.value.toString())) {
      evt.preventDefault();
      this.shake();
      return;
    }

    this._setState({
      basePrice: evt.target.value
    });
  };

  #setDatePickerStart() {
    this.#datepickerStart = flatpickr(this.element.querySelector('[name="event-start-time"]'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        'time_24hr': true,
        minuteIncrement: 1,
        defaultDate: this._state.dateFrom,
        minDate: this._state.dateTo,
        onChange: this.#dateFromChangeHandler
      });
  }

  #setDatePickerEnd() {
    this.#datepickerEnd = flatpickr(this.element.querySelector('[name="event-end-time"]'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        'time_24hr': true,
        minuteIncrement: 1,
        defaultDate: this._state.dateTo,
        minDate: this._state.dateFrom,
        onChange: this.#dateToChangeHandler
      });
  }

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(EditFormView.parseStateToPoint(this._state));
  };

  #formDeleteHandler = (evt) => {
    evt.preventDefault();
    this.#handleDeleteClick(EditFormView.parseStateToPoint(this._state));
  };

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };

  static parseStateToPoint(state) {
    const point = {...state};

    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return point;
  }
}
