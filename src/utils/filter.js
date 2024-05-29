import {Filters} from '../const.js';

const isPopintFuture = (dateFrom) => new Date(dateFrom) > new Date();
const isPopintPresent = (dateFrom, dateTo) => new Date(dateFrom) <= new Date() && new Date(dateTo) >= new Date();
const isPopintPast = (dateTo) => new Date(dateTo) < new Date();

const filter = {
  [Filters.FUTURE]: (points) => points.filter((point) => isPopintFuture(point.dateFrom)),
  [Filters.PRESENT]: (points) => points.filter((point) => isPopintPresent(point.dateFrom, point.dateTo)),
  [Filters.PAST]: (points) => points.filter((point) => isPopintPast(point.dateTo))
};

export {filter};
