import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';

import AccountHeading from '../components/AccountHeading';
import TransactionList from '../components/TransactionList';
import NewAccountForm from '../components/NewAccountForm';
import NewTransactionForm from '../components/NewTransactionForm';

import { GET_ACCOUNT } from '../graphQL/queries';

export default function Account({ accountFormData, setAccountFormData }) {
  const { id } = useParams();
  const [transactionFormData, setTransactionFormData] = useState({
    description: '',
    recurrence: 'none',
    amount: 0.00,
    type: 'expense',
    startDate: '',
    displayOrder: 0
  });

  const navigate = useNavigate();

  const { user } = useAuth0();
  const userId = user.sub;

  const {
    loading: queryLoading,
    error: queryError,
    data: queryData
  } = useQuery(GET_ACCOUNT, {
    variables: { id, userId }
  });

  if (queryLoading) return <p>Loading...</p>;
  if (queryError) return <p>Error 😢</p>;

  const { name, balance, transactions } = queryData.account;

  return (
    <>
      <AccountHeading
        _id={id}
        name={name}
        balance={balance}
        setAccountFormData={setAccountFormData}
      />
      <TransactionList
        transactionsProp={transactions}
        accountId={id}
        setTransactionFormData={setTransactionFormData}
        accountName={name}
        balance={balance}
      />
      <div className='btnGroup'>
        <button
          id='addTransactionBtn'
          type='button'
          onClick={() => {
            transactionModal.showModal();
          }}
        >
          Add new transaction
        </button>
        <button type='button' onClick={() => navigate('/dashboard')}>
          Back
        </button>
      </div>
      <NewAccountForm
        formData={accountFormData}
        setFormData={setAccountFormData}
        transactions={transactions}
      />
      <NewTransactionForm
        formData={transactionFormData}
        setFormData={setTransactionFormData}
        accountId={id}
        transactionCount={transactions.length}
        accountName={name}
      />
    </>
  );
}
