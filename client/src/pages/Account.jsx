import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, gql } from '@apollo/client';
import { FaPencilAlt, FaSave, FaTrashAlt } from 'react-icons/fa';

import Transaction from '../components/Transaction';

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

export default function Account({ getAccounts }) {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [accountName, setAccountName] = useState('');
  const navigate = useNavigate();

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
          <input
            value={accountName}
            onChange={e => {
              setAccountName(e.target.value);
            }}
          />
        ) : (
          <h1>{queryData.account.name}</h1>
        )}

        {!isEditing && (
          <>
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
        {isEditing && (
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
        )}
      </div>
      <h2>Transactions</h2>
      <div className='transactions'>
        {queryData.account.transactions.map(transaction => {
          return (
            <Transaction key={transaction._id} transaction={transaction} />
          );
        })}
      </div>
      <Link to='/'>
        <button>Go Back</button>
      </Link>
    </>
  );
}
