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
      <h1>Your Accounts</h1>
      <div className='accounts'>
        {data.accounts.map(account => {
          return (
            <Link to={`/accounts/${account._id}`} element={<Account />}>
              <div key={account._id} className='accountCard'>
                <h2>{account.name}</h2>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
