import { FaDollarSign } from 'react-icons/fa';
import { useMutation } from '@apollo/client';
import Modal from './Modal';

import { GET_ACCOUNT } from '../graphQL/queries';
import { ADD_TRANSACTION, UPDATE_TRANSACTION } from '../graphQL/mutations';

const NewTransactionForm = ({
  isVisible,
  setIsVisible,
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
  if (_id && !Number.isNaN(Number(startDate))) {
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

  const [addTransaction, { addMutationLoading, addMutationError }] =
    useMutation(ADD_TRANSACTION, {
      update(cache, { data: { addTransaction } }) {
        const data = {
          ...cache.readQuery({
            query: GET_ACCOUNT,
            variables: { id: accountId }
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
            variables: { id: accountId }
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
          variables: { id: accountId },
          data
        });
      }
    });

  const handleFormChange = e => {
    if (e.target.id === 'amount') {
      setFormData({ ...formData, amount: Number(e.target.value) });
    } else {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  if (addMutationLoading || updateMutationLoading) {
    return <p>Loading...</p>;
  }
  if (addMutationError || updateMutationError) {
    return <p>{error.message}</p>;
  }

  return (
    <Modal
      isVisible={isVisible}
      setIsVisible={setIsVisible}
      setFormData={setFormData}
    >
      <h1>{`${_id ? 'Update' : 'Add a new'} transaction`}</h1>
      <form
        onSubmit={e => {
          e.preventDefault();
          if (_id) {
            console.log();

            updateTransaction({
              variables: {
                transactionId: _id,
                description,
                recurrence,
                amount,
                type,
                startDate: startDateFormatted,
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
                  startDate: Date.parse(startDate).toString(),
                  displayOrder,
                  account: {
                    _id: accountId,
                    __typename: 'Account',
                    name: accountName
                  }
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
                  startDate: Date.parse(startDate).toString(),
                  displayOrder
                }
              }
            });
          }
          setIsVisible(false);
          setFormData({
            description: '',
            recurrence: 'none',
            amount: 0.01,
            type: 'expense',
            startDate: '',
            displayOrder: 0
          });
        }}
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
            min='0.01'
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
        <div className='btnGroup'>
          <button type='submit'>Submit</button>
          <button
            type='button'
            onClick={() => {
              setIsVisible(false);
              setFormData({
                description: '',
                recurrence: 'none',
                amount: 0.01,
                type: 'expense',
                startDate: '',
                displayOrder: 0
              });
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};
export default NewTransactionForm;
