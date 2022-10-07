import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import AccountHeading from '../components/AccountHeading';
import TransactionList from '../components/TransactionList';
import NewTransactionForm from '../components/NewTransactionForm';

import { GET_ACCOUNT } from '../graphQL/queries';

export default function Account() {
  const { id } = useParams();
  const [isHidden, setIsHidden] = useState(true);
  const [formData, setFormData] = useState({
    description: '',
    recurrence: 'none',
    amount: 0.01,
    type: 'expense',
    startDate: '',
    displayOrder: 0
  });

  const navigate = useNavigate();

  const handleAddTransaction = () => {
    setIsHidden(false);
  };

  const {
    loading: queryLoading,
    error: queryError,
    data: queryData
  } = useQuery(GET_ACCOUNT, {
    variables: { id }
  });

  if (queryLoading) return <p>Loading...</p>;
  if (queryError) return <p>Error 😢</p>;

  const { name, transactions } = queryData.account;

  return (
    <>
      <AccountHeading
        accountId={id}
        accountNameProp={name}
        transactions={transactions}
      />
      <TransactionList
        transactionsProp={transactions}
        accountId={id}
        handleAddTransaction={handleAddTransaction}
        setFormData={setFormData}
      />
      <div className='btnGroup'>
        <button
          id='addTransactionBtn'
          type='button'
          onClick={handleAddTransaction}
        >
          Add new transaction
        </button>
        <button type='button' onClick={e => navigate('/')}>
          Back
        </button>
      </div>
      <NewTransactionForm
        isHidden={isHidden}
        setIsHidden={setIsHidden}
        formData={formData}
        setFormData={setFormData}
        accountId={id}
        transactionCount={transactions.length}
      />
    </>
  );
}
