import {getPoints} from '../mock/points.js';
import {getDestinations} from '../mock/destinations.js';
import {getOffers} from '../mock/offers.js';
import Observable from '../framework/observable.js';

export default class PointModel extends Observable {
  #points = [];
  #destinations = [];
  #offers = [];

  init() {
    this.#points = getPoints();
    this.#destinations = getDestinations();
    this.#offers = getOffers();
  }

  get points() {
    return this.#points;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  updatePoint(updatePoint, update) {
    const index = this.#points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      update,
      ...this.#points.slice(index + 1)
    ];

    this._notify(updatePoint, update);
  }

  addPoint(updatePoint, update) {
    this.#points = [
      update,
      ...this.#points,
    ];

    this._notify(updatePoint, update);
  }

  deletePoint(updatePoint, update) {
    this.#points = this.#points.filter((point) => point.id !== update.point.point.id);

    this._notify(updatePoint, update);
  }
}
