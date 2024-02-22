import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import AddIcon from '@mui/icons-material/Add';
import { Fab } from '@mui/material';

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
    index: null,
    amount: '',
    description: '',
    startDate: '',
    type: 'expense'
  });

  const { user } = useAuth0();
  const userId = user.sub;

  const {
    loading,
    error,
    data
  } = useQuery(GET_ACCOUNT, {
    variables: { id, userId }
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error 😢</p>;

  const { account } = data;
  const { name, balance } = account;

  return (
    <>
      <AccountHeading
        _id={id}
        balance={balance}
        name={name}
        setAccountFormData={setAccountFormData}
      />
      <TransactionList
        account={account}
        setAccountFormData={setAccountFormData}
        setTransactionFormData={setTransactionFormData}
      />
      <Fab color='secondary' aria-label='add' sx={{ position: 'fixed', bottom: '15px', right: '15px' }} onClick={() => transactionModal.showModal()}><AddIcon /></Fab>
      <NewAccountForm
        account={account}
        formData={accountFormData}
        setFormData={setAccountFormData}
      />
      <NewTransactionForm
        account={account}
        formData={transactionFormData}
        setFormData={setTransactionFormData}
      />
      <DeleteAccountForm _id={id} />
      <DeleteTransactionForm
        account={account}
        formData={transactionFormData}
        setFormData={setTransactionFormData}
      />
    </>
  );
}
