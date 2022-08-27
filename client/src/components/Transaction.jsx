export default function Transaction({ transaction }) {
  const { description, recurrence, amount, type, startDate } = transaction;

  const options = {
    timeZone: 'UTC',
    weekday: 'short',
    month: 'short',
    year: 'numeric',
    day: 'numeric'
  };

  const startDateFormatted = new Intl.DateTimeFormat('en-US', options).format(
    new Date(Number(startDate))
  );

  return (
    <div className='transactionCard'>
      <span>{startDateFormatted}</span>
      <span>{description}</span>
      <span>{recurrence}</span>
      <span>{amount}</span>
      <span>{type}</span>
    </div>
  );
}
