import { useMutation } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

import { GET_ACCOUNTS } from '../graphQL/queries';
import { DELETE_ACCOUNT } from '../graphQL/mutations';

import Modal from './Modal';

const DeleteAccountForm = ({ _id }) => {
  const { user } = useAuth0();
  const userId = user.sub;

  const navigate = useNavigate();

  const [deleteAccount] =
    useMutation(DELETE_ACCOUNT, {
      update(cache, { data: { deleteAccount } }) {
        const data = {
          ...cache.readQuery({
            query: GET_ACCOUNTS, variables: { userId }
          })
        };
        const updatedAccounts = data.accounts.filter(account => {
          return account._id !== deleteAccount._id;
        });
        data.accounts = updatedAccounts;
        cache.writeQuery({ query: GET_ACCOUNTS, variables: { userId }, data });
      }
    });

  return (
    <Modal id='deleteAccountModal' heading='Delete Account?' submitHandler={(e) => {
      e.preventDefault();
          deleteAccount({
            variables: { accountId: _id },
            optimisticResponse: {
              deleteAccount: {
                _id,
                __typename: 'Account'
              }
            }
          });
          navigate('/accounts');
    }}>
      <p>Are you sure you want to delete this account? This action cannot be undone.</p>
        </Modal>
  )
}

export default DeleteAccountForm