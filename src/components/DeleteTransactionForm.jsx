import { useMutation } from '@apollo/client';

import { UPDATE_ACCOUNT } from '../graphQL/mutations';

import Modal from './Modal';

const DeleteTransactionForm = ({ account, formData, setFormData }) => {
  const { index } = formData;

  const [updateAccount] = useMutation(UPDATE_ACCOUNT);

  return (
    <Modal id='deleteTransactionModal' heading='Delete Transaction?'
      submitHandler={() => {
        const { _id: accountId, name, balance, transactions } = account;

        let updatedTransactions = [...transactions.map(transaction => {
          const { __typename, ...reducedTransaction } = transaction;
          return reducedTransaction;
        })];

        updatedTransactions.splice(index, 1);

        const updatedAccount = {
          accountId,
          name,
          balance,
          transactions: updatedTransactions
        };

        updateAccount({
          variables: updatedAccount,
          optimisticResponse: {
            updateAccount: {
              __typename: 'Account',
              transactions: updatedTransactions,
              ...account
            }
          }
        });
        setFormData({
          index: null,
          description: '',
          amount: '',
          type: 'expense',
          startDate: '',
        })
      }}
      cancelHandler={() => {
        setFormData({
          index: null,
          description: '',
          amount: '',
          type: 'expense',
          startDate: '',
        });
      }} >
      <p>Are you sure you want to delete this transaction? This action cannot be undone.</p>
    </Modal>
  )
}

export default DeleteTransactionForm