import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, gql } from '@apollo/client';
import { FaPencilAlt, FaSave, FaTrashAlt } from 'react-icons/fa';

import Transaction from '../components/Transaction';
import NewTransactionForm from '../components/NewTransactionForm';

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
        type
        recurrence
      }
    }
  }
`;

const UPDATE_ACCOUNT = gql`
  mutation UpdateAccount($accountId: ID!, $updatedAccountName: String!) {
    updateAccount(
      accountId: $accountId
      updatedAccountName: $updatedAccountName
    ) {
      _id
      name
    }
  }
`;

const DELETE_ACCOUNT = gql`
  mutation DeleteAccount($accountId: ID!) {
    deleteAccount(accountId: $accountId)
  }
`;

export default function Account() {
  const { id } = useParams();
  const [isHidden, setIsHidden] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    recurrence: 'none',
    amount: 0.01,
    type: 'expense',
    startDate: ''
  });
  const [accountName, setAccountName] = useState('');

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

  const [updateAccount, { mutationLoading, mutationError }] = useMutation(
    UPDATE_ACCOUNT,
    { refetchQueries: { query: GET_ACCOUNT, variables: { id } } }
  );

  const [deleteAccount, { deleteMutationLoading, deleteMutationError }] =
    useMutation(DELETE_ACCOUNT);

  if (queryLoading || mutationLoading || deleteMutationLoading)
    return <p>Loading...</p>;
  if (queryError || mutationError || deleteMutationError)
    return <p>Error 😢</p>;

  return (
    <>
      <div className='accountHeading'>
        {isEditing ? (
          <>
            <input
              type='text'
              value={accountName}
              class='accountNameUpdateInput'
              onChange={e => {
                setAccountName(e.target.value);
              }}
            />
            <FaSave
              className='btn'
              onClick={e => {
                setIsEditing(false);
                updateAccount({
                  variables: {
                    accountId: queryData.account._id,
                    updatedAccountName: accountName
                  }
                });
              }}
            />
          </>
        ) : (
          <>
            <h1>{queryData.account.name}</h1>
            <FaPencilAlt
              className='btn'
              onClick={e => {
                setAccountName(queryData.account.name);
                setIsEditing(true);
              }}
            />
            <FaTrashAlt
              className='btn'
              onClick={e => {
                deleteAccount({
                  variables: { accountId: queryData.account._id }
                });
                navigate('/');
              }}
            />
          </>
        )}
      </div>
      <h2>Transactions</h2>
      <div className='transactions'>
        {queryData.account.transactions.map(transaction => {
          return (
            <Transaction
              key={transaction._id}
              transaction={transaction}
              handleAddTransaction={handleAddTransaction}
              setFormData={setFormData}
              getAccount={GET_ACCOUNT}
              accountId={queryData.account._id}
            />
          );
        })}
      </div>
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
        getAccount={GET_ACCOUNT}
        accountId={queryData.account._id}
      />
    </>
  );
}
