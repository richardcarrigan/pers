import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

import Card from '../components/Card';
import NewAccountForm from '../components/NewAccountForm';

import Account from './Account';

import { GET_ACCOUNTS } from '../graphQL/queries';

const Dashboard = ({ accountFormData, setAccountFormData }) => {
  const [isAccountFormVisible, setIsAccountFormVisible] = useState(false);
  const { loading, error, data } = useQuery(GET_ACCOUNTS);
  const { isAuthenticated } = useAuth0();

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
              <Card heading={account.name}>
                <h3>{`Balance: ${Intl.NumberFormat('en-us', {
              style: 'currency',
              currency: 'USD'
            }).format(account.balance)}`}</h3>
              </Card>
            </Link>
          );
        })}
        <button
          id='addAccountBtn'
          type='button'
          onClick={() => {
            // setIsAccountFormVisible(true);
            accountModal.showModal();
          }}
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
};

export default Dashboard;
