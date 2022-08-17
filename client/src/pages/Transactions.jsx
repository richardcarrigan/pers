import { Link } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import Transaction from '../components/Transaction';

const GET_TRANSACTIONS = gql`
  query getTransactions {
    transactions {
      _id
      description
      type
      amount
      startDate
    }
  }
`;

function Transactions() {
  const { loading, error, data } = useQuery(GET_TRANSACTIONS);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error :(</p>;
  }

  return (
    <>
      <ul>
        {data.transactions.map(transaction => {
          return (
            <Transaction transaction={transaction} key={transaction._id} />
          );
        })}
      </ul>
      <Link to='/form'>Add new transaction</Link>
    </>
  );
}

export default Transactions;
