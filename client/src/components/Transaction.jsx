export default function Transaction({ transaction }) {
  const { startDate, description, amount } = transaction;

  return (
    <div className='transactionCard'>
      <span>{startDate}</span>
      <span>{description}</span>
      <span>{amount}</span>
    </div>
  );
}
