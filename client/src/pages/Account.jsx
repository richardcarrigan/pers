import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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

export default function Account() {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [accountName, setAccountName] = useState('');
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

  if (queryLoading || mutationLoading) return <p>Loading...</p>;
  if (queryError || mutationError) return <p>Error 😢</p>;

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
          <FaPencilAlt
            className='btn'
            onClick={e => {
              setAccountName(queryData.account.name);
              setIsEditing(true);
            }}
          />
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
        <FaTrashAlt className='btn' />
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
