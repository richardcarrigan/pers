export default function Transaction({ transaction }) {
  const { startDate, description, amount } = transaction;

  return (
    <div className='transactionCard'>
      {startDate}
      {description}
      {amount}
    </div>
  );
}
