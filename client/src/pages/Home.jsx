import { useQuery, gql } from '@apollo/client';
import { Link } from 'react-router-dom';

import Account from './Account';

const GET_ACCOUNTS = gql`
  query getAccounts {
    accounts {
      _id
      name
    }
  }
`;

export default function Home() {
  const { loading, error, data } = useQuery(GET_ACCOUNTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error 😢</p>;

  return (
    <>
      <h1>Home</h1>
      {data.accounts.map(account => {
        return (
          <div key={account._id}>
            <h2>{account.name}</h2>
            <p>{account._id}</p>
            <Link to={`/accounts/${account._id}`} element={<Account />}>
              See transactions
            </Link>
          </div>
        );
      })}
    </>
  );
}
