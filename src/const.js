const POINT_TYPES = ['taxi', 'bus', 'train', 'ship', 'drive', 'flight', 'check-in', 'sightseeing', 'restaurant'];
const FILTER_TYPES = ['Everything', 'Future', 'Present', 'Past'];
const SORT_TYPES = ['Day', 'Event', 'Time', 'Price', 'Offers'];

const Filters = {
  EVERYTHING: 'Everything',
  FUTURE: 'Future',
  PRESENT: 'Present',
  PAST: 'Past',
};

const TripEmptyMessage = {
  [Filters.EVERYTHING]: 'Click New Event to create your first point',
  [Filters.FUTURE]: 'There are no future events now',
  [Filters.PRESENT]: 'There are no present events now',
  [Filters.PAST]: 'There are no past events now'
};

export {POINT_TYPES, FILTER_TYPES, SORT_TYPES, Filters, TripEmptyMessage};
