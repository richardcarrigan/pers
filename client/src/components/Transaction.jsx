export default function Transaction({ transaction }) {
  const { startDate, description, amount } = transaction;

  return (
    <li>
      {startDate}
      {description}
      {amount}
    </li>
  );
}
