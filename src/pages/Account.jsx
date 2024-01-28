import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import { MdAdd } from "react-icons/md";

import { GET_ACCOUNT } from '../graphQL/queries';
import AccountHeading from '../components/AccountHeading';
import TransactionList from '../components/TransactionList';
import NewAccountForm from '../components/NewAccountForm';
import NewTransactionForm from '../components/NewTransactionForm';
import DeleteAccountForm from '../components/DeleteAccountForm';
import DeleteTransactionForm from '../components/DeleteTransactionForm';

export default function Account({ accountFormData, setAccountFormData }) {
  const { id } = useParams();
  const [transactionFormData, setTransactionFormData] = useState({
    amount: '',
    description: '',
    displayOrder: 0,
    startDate: '',
    type: 'expense'
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
        balance={balance}
        name={name}
        setAccountFormData={setAccountFormData}
      />
      <TransactionList
        accountId={id}
        accountName={name}
        balance={balance}
        setAccountFormData={setAccountFormData}
        setTransactionFormData={setTransactionFormData}
        transactionsProp={transactions}
      />
      <div className='btnGroup'>
        <button
          className='btn btn-primary btn-fab'
          id='addTransactionBtn'
          type='button'
          onClick={() => {
            transactionModal.showModal();
          }}
        >
          <MdAdd />
        </button>
        <button className='btn btn-secondary' type='button' onClick={() => navigate('/accounts')}>
          Back
        </button>
      </div>
      <NewAccountForm
        formData={accountFormData}
        setFormData={setAccountFormData}
        transactions={transactions}
      />
      <NewTransactionForm
        accountId={id}
        accountName={name}
        formData={transactionFormData}
        setFormData={setTransactionFormData}
        transactionCount={transactions.length}
      />
      <DeleteAccountForm _id={id} />
      <DeleteTransactionForm
        accountId={id}
        formData={transactionFormData}
        setFormData={setTransactionFormData}
      />
    </>
  );
}
