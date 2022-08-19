import { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { Link } from 'react-router-dom';

import NewAccountForm from '../components/NewAccountForm';

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
  const [isHidden, setIsHidden] = useState(true);
  const { loading, error, data } = useQuery(GET_ACCOUNTS);

  const handleAddAccount = () => {
    setIsHidden(false);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  return (
    <>
      <h1>Your Accounts</h1>
      <div className='accounts'>
        {data.accounts.map(account => {
          return (
            <Link
              key={account._id}
              to={`/accounts/${account._id}`}
              element={<Account />}
            >
              <div className='accountCard'>
                <h2>{account.name}</h2>
              </div>
            </Link>
          );
        })}
        <button id='addAccountBtn' type='button' onClick={handleAddAccount}>
          Add new account
        </button>
      </div>
      <NewAccountForm
        isHidden={isHidden}
        setIsHidden={setIsHidden}
        getAccounts={GET_ACCOUNTS}
      />
    </>
  );
}
