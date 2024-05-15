import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

function formatDate(dueDate, format) {
  return dueDate ? dayjs(dueDate).format(format) : '';
}

const getDuration = (dateFrom, dateTo) => {
  const startDate = dayjs(dateFrom).startOf('minute');
  const endDate = dayjs(dateTo).startOf('minute');
  const timeDifferenceInMs = endDate.diff(startDate);
  const durationDate = dayjs.duration(timeDifferenceInMs);

  const days = durationDate.days();
  const hours = durationDate.hours();
  const minutes = durationDate.minutes();

  const formattedDuration = [];
  if (days > 0) {
    formattedDuration.push(`${days}D`);
  }
  if (hours > 0) {
    formattedDuration.push(`${hours}H`);
  }
  if (minutes > 0) {
    formattedDuration.push(`${minutes}M`);
  }

  return formattedDuration.join(' ');
};

export { formatDate, getDuration };
