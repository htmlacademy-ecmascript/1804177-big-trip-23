const sortByTime = (pointA, pointB) => new Date(pointA.dateTo).getTime() - new Date(pointB.dateFrom).getTime();

const sortByPrice = (pointA, pointB) => pointB.basePrice - pointA.basePrice;

export {sortByTime, sortByPrice};
