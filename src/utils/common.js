import duration from 'dayjs/plugin/duration';
import dayjs from 'dayjs';

dayjs.extend(duration);

const formatDate = (dueDate) => dueDate
  ? {
    monthDay: dayjs(dueDate).format('MMM D').toUpperCase(),
    dayMonth: dayjs(dueDate).format('D MMM').toUpperCase(),
    yearMonthDay: dayjs(dueDate).format('YYYY-MM-DD'),
    hourMinute: dayjs(dueDate).format('HH:mm'),
    dateHoursMinute: dayjs(dueDate).format('YY/MM/DD HH:mm'),
    dateTHoursMinute: dayjs(dueDate).format('YYYY-MM-DDTHH:mm'),
  }
  : '';

const capitalizeFirstLetter = (word) => word[0].toUpperCase() + word.slice(1);

const getDuration = (dateFrom, dateTo) => {
  const startDate = dayjs(dateFrom).startOf('minute');
  const endDate = dayjs(dateTo).startOf('minute');
  const timeDifferenceInMs = endDate.diff(startDate);
  const durationDate = dayjs.duration(timeDifferenceInMs);

  const days = durationDate.days();
  const hours = durationDate.hours();
  const minutes = durationDate.minutes();

  const formattedDurationParts = [];
  if (days > 0) {
    formattedDurationParts.push(`${days}D`);
  }
  if (hours > 0) {
    formattedDurationParts.push(`${hours}H`);
  }
  if (minutes > 0) {
    formattedDurationParts.push(`${minutes}M`);
  }

  return formattedDurationParts.join(' ');
};

const isDatesEqual = (dateA, dateB) => (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D');

export {formatDate, getDuration, capitalizeFirstLetter, isDatesEqual};
