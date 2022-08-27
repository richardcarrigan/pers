export default function Transaction({ transaction }) {
  const { description, recurrence, amount, type, startDate } = transaction;

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];

  const startDateFormatted = new Date(Number(startDate));
  const day = weekdays[startDateFormatted.getUTCDay()];
  const month = months[startDateFormatted.getUTCMonth()];
  const date = startDateFormatted.getUTCDate();
  const year = startDateFormatted.getUTCFullYear();

  return (
    <div className='transactionCard'>
      <span>{`${day}, ${month} ${date}, ${year}`}</span>
      <span>{description}</span>
      <span>{recurrence}</span>
      <span>{amount}</span>
      <span>{type}</span>
    </div>
  );
}
