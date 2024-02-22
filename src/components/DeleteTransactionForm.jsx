import { useMutation } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';

import { GET_ACCOUNT } from '../graphQL/queries';
import { UPDATE_ACCOUNT } from '../graphQL/mutations';

import Modal from './Modal';

const DeleteTransactionForm = ({ account, formData, setFormData }) => {
  const { index } = formData;
  const { user } = useAuth0();
  const userId = user.sub;

  const [updateAccount] = useMutation(UPDATE_ACCOUNT, {
    update(cache) {
      const data = { ...cache.readQuery({ query: GET_ACCOUNT, variables: { id: account._id, userId } }) };
      const updatedAccount = { ...data.account };
      let transactions = [...updatedAccount.transactions];
      transactions.splice(index, 1);
      updatedAccount.transactions = transactions;
      cache.writeQuery({ query: GET_ACCOUNT, data: { account: updatedAccount }});
    }, refetchQueries: [ GET_ACCOUNT ]
  });

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