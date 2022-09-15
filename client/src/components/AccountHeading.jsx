import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPencilAlt, FaSave, FaTrashAlt } from 'react-icons/fa';
import { useMutation } from '@apollo/client';

import { GET_ACCOUNT, GET_ACCOUNTS } from '../graphQL/queries';
import { UPDATE_ACCOUNT, DELETE_ACCOUNT } from '../graphQL/mutations';

const AccountHeading = ({ accountId, accountNameProp }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [accountName, setAccountName] = useState('');

  const navigate = useNavigate();

  const [updateAccount, { mutationLoading, mutationError }] = useMutation(
    UPDATE_ACCOUNT,
    {
      refetchQueries: [{ query: GET_ACCOUNT, variables: { id: accountId } }]
    }
  );

  const [deleteAccount, { deleteMutationLoading, deleteMutationError }] =
    useMutation(DELETE_ACCOUNT, {
      refetchQueries: [{ query: GET_ACCOUNTS }]
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
                variables: { accountId }
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
