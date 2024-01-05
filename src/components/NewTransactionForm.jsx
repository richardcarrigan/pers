import { FaDollarSign } from 'react-icons/fa';
import { useMutation } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

import Modal from './Modal';
import { GET_ACCOUNT } from '../graphQL/queries';
import { ADD_TRANSACTION, UPDATE_TRANSACTION } from '../graphQL/mutations';

const NewTransactionForm = ({
  formData,
  setFormData,
  accountId,
  transactionCount
}) => {
  const {
    _id,
    description,
    amount,
    type,
    startDate,
    displayOrder
  } = formData;

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
    if (e.target.id === 'amount' && !isNaN(parseFloat(e.target.value))) {
      setFormData({ ...formData, amount: parseFloat(e.target.value) });
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
      amount: '',
      type: 'expense',
      startDate: '',
      displayOrder: 0
    });
  }

  function handleCancel() {
    setFormData({
      description: '',
      amount: '',
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
      <label htmlFor='amount'>Amount</label>
      <div className='amountInputWithIcon'>
        <FaDollarSign />
        <input
          type='number'
          min='0'
          step='0.01'
          id='amount'
          required
          value={amount}
          onChange={handleFormChange}
          placeholder='Transaction amount'
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
      <label htmlFor='startDate'>Date</label>
      <DatePicker
        id='startDate'
        selected={startDate && new Date(Number(startDate))}
        onChange={date => {
          handleFormChange({ target: { id: 'startDate', value: date } })
        }}
        placeholderText='Transaction date'
      />
    </Modal>
  );
};
export default NewTransactionForm;
