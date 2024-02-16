import { useMutation } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';

import { UPDATE_ACCOUNT } from '../graphQL/mutations';
import { GET_ACCOUNT } from '../graphQL/queries';

import Modal from './Modal';

const DeleteTransactionForm = ({ account, formData, setFormData }) => {
  const { index } = formData;
  const { user } = useAuth0();
  const userId = user.sub;

  const [updateAccount] = useMutation(UPDATE_ACCOUNT);

  // const [updateAccount] = useMutation(
  //   UPDATE_ACCOUNT,
  //   {
  //     update(cache, { data: { updateAccount } }) {
  //       const data = {
  //         ...cache.readQuery({
  //           query: GET_ACCOUNT,
  //           variables: { id: accountId, userId }
  //         })
  //       };
  //       const updatedTransactions = data.account.transactions.filter(
  //         transaction => {
  //           return transaction._id !== updateAccount._id;
  //         }
  //       );
  //       data.account = { ...data.account, transactions: updatedTransactions };
  //       cache.writeQuery({
  //         query: GET_ACCOUNT,
  //         variables: { id: accountId, userId },
  //         data
  //       });
  //     }
  //   }
  // );

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