import dayjs from 'dayjs';

function dateFormatting(dueDate, format) {
  return dueDate ? dayjs(dueDate).format(format) : '';
}

function convertTime(dateTo, dateFrom) {
  const time = dayjs(dateTo).diff(dayjs(dateFrom), 'minutes');
  return time ? `${Math.floor(time / 60)}H ${time % 60}M` : '';
}

export { dateFormatting, convertTime };
