import { useNavigate } from 'react-router-dom';
import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import { useMutation } from '@apollo/client';

import { GET_ACCOUNTS } from '../graphQL/queries';
import { DELETE_ACCOUNT } from '../graphQL/mutations';

const AccountHeading = ({
  _id,
  name,
  balance,
  setAccountFormData
}) => {
  const navigate = useNavigate();

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

  if (deleteMutationLoading) return <p>Loading...</p>;
  if (deleteMutationError) return <p>Error 😢</p>;

  return (
    <div className='accountHeading'>
      <h1>{name}</h1>
      <FaPencilAlt
        className='btn'
        onClick={() => {
          setAccountFormData({
            _id,
            name,
            balance
          });
          accountModal.showModal();
        }}
      />
      <FaTrashAlt
        className='btn'
        onClick={() => {
          deleteAccount({
            variables: { accountId: _id },
            optimisticResponse: {
              deleteAccount: {
                _id,
                __typename: 'Account'
              }
            }
          });
          navigate('/dashboard');
        }}
      />
    </div>
  );
};

export default AccountHeading;
