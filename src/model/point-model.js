import {getPoints} from '../mock/points.js';
import {getDestinations} from '../mock/destinations.js';
import {getOffers} from '../mock/offers.js';

export default class PointModel {
  #points = [];
  #destinations = [];
  #offers = [];

  init() {
    this.#points = getPoints();
    this.#destinations = getDestinations();
    this.#offers = getOffers();
  }

  getPoints() {
    return this.#points;
  }

  getDestinations() {
    return this.#destinations;
  }

  getOffers() {
    return this.#offers;
  }
}
