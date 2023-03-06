import { useMutation } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';

import { DELETE_TRANSACTION } from '../graphQL/mutations';
import { GET_ACCOUNT } from '../graphQL/queries';

import Modal from './Modal';

const DeleteTransactionForm = ({ formData, setFormData, accountId }) => {
  const { _id } = formData;
  const { user } = useAuth0();
  const userId = user.sub;

  const [deleteTransaction] = useMutation(
    DELETE_TRANSACTION,
    {
      update(cache, { data: { deleteTransaction } }) {
        const data = {
          ...cache.readQuery({
            query: GET_ACCOUNT,
            variables: { id: accountId, userId }
          })
        };
        const updatedTransactions = data.account.transactions.filter(
          transaction => {
            return transaction._id !== deleteTransaction._id;
          }
        );
        data.account = { ...data.account, transactions: updatedTransactions };
        cache.writeQuery({
          query: GET_ACCOUNT,
          variables: { id: accountId, userId },
          data
        });
      }
    }
  );

  return (
    <Modal id='deleteTransactionModal' heading='Delete Transaction?'
      submitHandler={() => {
        deleteTransaction({
          variables: { transactionId: _id },
          optimisticResponse: {
            deleteTransaction: {
              _id,
              __typename: 'Transaction'
            }
          }
        });
        setFormData({
          description: '',
          recurrence: 'none',
          amount: 0.00,
          type: 'expense',
          startDate: '',
          displayOrder: 0
        })
      }}
      cancelHandler={() => {
        setFormData({
          description: '',
          recurrence: 'none',
          amount: 0.00,
          type: 'expense',
          startDate: '',
          displayOrder: 0
        });
      }} >
      <p>Are you sure you want to delete this transaction? This action cannot be undone.</p>
    </Modal>
  )
}

export default DeleteTransactionForm