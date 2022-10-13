import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPencilAlt, FaSave, FaTrashAlt } from 'react-icons/fa';
import { useMutation } from '@apollo/client';

import { GET_ACCOUNT, GET_ACCOUNTS } from '../graphQL/queries';
import { UPDATE_ACCOUNT, DELETE_ACCOUNT } from '../graphQL/mutations';

const AccountHeading = ({ accountId, accountNameProp, transactions }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [accountName, setAccountName] = useState('');

  const navigate = useNavigate();

  const [updateAccount, { mutationLoading, mutationError }] = useMutation(
    UPDATE_ACCOUNT,
    {
      update(cache, { data: { updateAccount } }) {
        const data = {
          ...cache.readQuery({
            query: GET_ACCOUNT,
            variables: { id: accountId }
          })
        };
        data.account = { ...updateAccount, transactions };
        cache.writeQuery({ query: GET_ACCOUNT, data });
      }
    }
  );

  const [deleteAccount, { deleteMutationLoading, deleteMutationError }] =
    useMutation(DELETE_ACCOUNT, {
      update(cache, { data: { deleteAccount } }) {
        const data = {
          ...cache.readQuery({
            query: GET_ACCOUNTS
          })
        };
        const updatedAccounts = data.accounts.filter(account => {
          return account._id !== deleteAccount._id;
        });
        data.accounts = updatedAccounts;
        cache.writeQuery({ query: GET_ACCOUNTS, data });
      }
    });

  if (mutationLoading || deleteMutationLoading) return <p>Loading...</p>;
  if (mutationError || deleteMutationError) return <p>Error 😢</p>;

  return (
    <div className='accountHeading'>
      {isEditing ? (
        <>
          <input
            type='text'
            value={accountName}
            className='accountNameUpdateInput'
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
                  accountId,
                  updatedAccountName: accountName
                },
                optimisticResponse: {
                  updateAccount: {
                    _id: accountId,
                    __typename: 'Account',
                    name: accountName
                  }
                }
              });
            }}
          />
        </>
      ) : (
        <>
          <h1>{accountNameProp}</h1>
          <FaPencilAlt
            className='btn'
            onClick={e => {
              setAccountName(accountNameProp);
              setIsEditing(true);
            }}
          />
          <FaTrashAlt
            className='btn'
            onClick={() => {
              deleteAccount({
                variables: { accountId },
                optimisticResponse: {
                  deleteAccount: {
                    _id: accountId,
                    __typename: 'Account'
                  }
                }
              });
              navigate('/');
            }}
          />
        </>
      )}
    </div>
  );
};

export default AccountHeading;
