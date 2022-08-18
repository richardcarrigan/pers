import { useParams, Link } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';

import Transaction from '../components/Transaction';

const GET_ACCOUNT = gql`
  query getAccount($id: ID!) {
    account(id: $id) {
      _id
      name
      transactions {
        _id
        startDate
        description
        amount
      }
    }
  }
`;

export default function Account() {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_ACCOUNT, {
    variables: { id }
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error 😢</p>;

  return (
    <div>
      <h1>{`${data.account.name} Transactions`}</h1>
      {data.account.transactions.map(transaction => {
        return <Transaction key={transaction._id} transaction={transaction} />;
      })}
      <Link to='/'>
        <button>Go Back</button>
      </Link>
    </div>
  );
}
