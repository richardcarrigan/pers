import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';

import Card from '../components/Card';
import NewAccountForm from '../components/NewAccountForm';

import Account from './Account';

import { GET_ACCOUNTS } from '../graphQL/queries';

export default function Home({ accountFormData, setAccountFormData }) {
  const [isAccountFormVisible, setIsAccountFormVisible] = useState(false);
  const { loading, error, data } = useQuery(GET_ACCOUNTS);

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
              <Card heading={account.name} footer='Click to view transactions'>
                <h3>{`Balance: $${account.balance}`}</h3>
              </Card>
            </Link>
          );
        })}
        <button
          id='addAccountBtn'
          type='button'
          onClick={() => setIsAccountFormVisible(true)}
        >
          Add new account
        </button>
      </div>
      <NewAccountForm
        isVisible={isAccountFormVisible}
        setIsVisible={setIsAccountFormVisible}
        formData={accountFormData}
        setFormData={setAccountFormData}
      />
    </>
  );
}
