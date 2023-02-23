import { FaDollarSign } from 'react-icons/fa';
import { useMutation } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import Modal from './Modal';

import { GET_ACCOUNT } from '../graphQL/queries';
import { ADD_TRANSACTION, UPDATE_TRANSACTION } from '../graphQL/mutations';

const NewTransactionForm = ({
  formData,
  setFormData,
  accountId,
  transactionCount,
  accountName
}) => {
  const {
    _id,
    description,
    recurrence,
    amount,
    type,
    startDate,
    displayOrder
  } = formData;

  let startDateFormatted;
  if (startDate) {
    startDateFormatted = new Date(Number(startDate));

    startDateFormatted = `${startDateFormatted.getUTCFullYear()}-${
      startDateFormatted.getUTCMonth() + 1 < 10
        ? `0${startDateFormatted.getUTCMonth() + 1}`
        : startDateFormatted.getUTCMonth() + 1
    }-${
      startDateFormatted.getUTCDate() < 10
        ? `0${startDateFormatted.getUTCDate()}`
        : startDateFormatted.getUTCDate()
    }`;
  } else {
    startDateFormatted = startDate;
  }

  const { user } = useAuth0();
  const userId = user.sub;

  const [addTransaction, { addMutationLoading, addMutationError }] =
    useMutation(ADD_TRANSACTION, {
      update(cache, { data: { addTransaction } }) {
        const data = {
          ...cache.readQuery({
            query: GET_ACCOUNT,
            variables: { id: accountId, userId }
          })
        };
        data.account = {
          ...data.account,
          transactions: [...data.account.transactions, addTransaction]
        };
        cache.writeQuery({ query: GET_ACCOUNT, data });
      }
    });

  const [updateTransaction, { updateMutationLoading, updateMutationError }] =
    useMutation(UPDATE_TRANSACTION, {
      update(cache, { data: { updateTransaction } }) {
        const data = {
          ...cache.readQuery({
            query: GET_ACCOUNT,
            variables: { id: accountId, userId }
          })
        };
        const updatedTransaction = { ...updateTransaction };
        delete updatedTransaction.account;
        const updatedTransactions = [...data.account.transactions];
        const index = updatedTransactions.findIndex(transaction => {
          return transaction._id === _id;
        });
        updatedTransactions.splice(index, 1, updatedTransaction);
        data.account = { ...data.account, transactions: updatedTransactions };
        cache.writeQuery({
          query: GET_ACCOUNT,
          variables: { id: accountId, userId },
          data
        });
      }
    });

  function handleFormChange(e) {
    if (e.target.id === 'amount') {
      setFormData({ ...formData, amount: Number(e.target.value) });
    } else if (e.target.id === 'startDate') {
      setFormData({ ...formData, startDate: Date.parse(e.target.value).toString() });
    } else {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  function handleSubmit() {
    if (_id) {
      updateTransaction({
        variables: {
          transactionId: _id,
          description,
          recurrence,
          amount,
          type,
          startDate,
          displayOrder
        },
        optimisticResponse: {
          updateTransaction: {
            _id,
            __typename: 'Transaction',
            description,
            recurrence,
            amount,
            type,
            startDate,
            displayOrder
          }
        }
      });
    } else {
      addTransaction({
        variables: {
          ...formData,
          accountId,
          displayOrder: transactionCount
        },
        optimisticResponse: {
          addTransaction: {
            _id: 'temp-id',
            __typename: 'Transaction',
            description,
            recurrence,
            amount,
            type,
            startDate,
            displayOrder
          }
        }
      });
    }
    setFormData({
      description: '',
      recurrence: 'none',
      amount: 0.00,
      type: 'expense',
      startDate: '',
      displayOrder: 0
    });
  }

  function handleCancel() {
    setFormData({
      description: '',
      recurrence: 'none',
      amount: 0.00,
      type: 'expense',
      startDate: '',
      displayOrder: 0
    });
  }

  if (addMutationLoading || updateMutationLoading) {
    return <p>Loading...</p>;
  }
  if (addMutationError || updateMutationError) {
    return <p>{error.message}</p>;
  }

  return (
    <Modal
      id='transactionModal'
      heading={`${_id ? 'Update' : 'Add a new'} transaction`}
      submitHandler={handleSubmit}
      cancelHandler={handleCancel}
    >
      <label htmlFor='description'>Description</label>
      <input
        id='description'
        type='text'
        value={description}
        onChange={handleFormChange}
        required
        placeholder='Description'
      />
      <label htmlFor='recurrence'>Recurrence</label>
      <select
        id='recurrence'
        selected
        value={recurrence}
        onChange={handleFormChange}
        required
      >
        <option value='none'>none</option>
        <option value='daily'>daily</option>
        <option value='weekly'>weekly</option>
        <option value='monthly'>monthly</option>
      </select>
      <label htmlFor='amount'>Amount</label>
      <div className='amountInputWithIcon'>
        <FaDollarSign />
        <input
          type='number'
          min='0.00'
          step='0.01'
          id='amount'
          required
          value={amount}
          onChange={handleFormChange}
        />
      </div>
      <label htmlFor='type'>Transaction Type</label>
      <select
        id='type'
        required
        selected
        value={type}
        onChange={handleFormChange}
      >
        <option value='income'>income</option>
        <option value='expense'>expense</option>
      </select>
      <label htmlFor='startDate'>Start Date</label>
      <input
        type='date'
        value={startDateFormatted}
        id='startDate'
        required
        onChange={handleFormChange}
      />
    </Modal>
  );
};
export default NewTransactionForm;
