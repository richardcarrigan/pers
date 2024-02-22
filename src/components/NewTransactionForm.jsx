import { FaDollarSign } from 'react-icons/fa';
import { useMutation } from '@apollo/client';
import DatePicker from 'react-datepicker';

import 'react-datepicker/dist/react-datepicker.css';

import Modal from './Modal';
import { UPDATE_ACCOUNT } from '../graphQL/mutations';

const NewTransactionForm = ({
  account,
  formData,
  setFormData
}) => {
  const {
    index,
    description,
    amount,
    type,
    startDate
  } = formData;

  const [updateAccount, { loading, error }] =
    useMutation(UPDATE_ACCOUNT);

  function handleFormChange(e) {
    if (e.target.id === 'amount' && !isNaN(parseFloat(e.target.value))) {
      setFormData({ ...formData, amount: parseFloat(e.target.value) });
    } else if (e.target.id === 'startDate') {
      setFormData({ ...formData, startDate: Date.parse(e.target.value).toString() });
    } else {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  function handleSubmit(e) {
    e.preventDefault();

    const { index, ...reducedFormData } = formData;
    const { _id: accountId, name, balance } = account;
    let transactions = [...account.transactions];
    
    if (index === null) {
      // Add new transaction to end of array
      transactions.push(reducedFormData);
    } else {
      // Update existing transaction within array
      transactions[index] = reducedFormData;
    }

    transactions = transactions.map(transaction => {
      const { __typename, ...reducedTransaction } = transaction;
      return reducedTransaction;
    });

    const updatedAccount = { accountId, name, balance, transactions };

    const optimisticResponse = {
      updateAccount: {
        _id: accountId,
        __typename: 'Account',
        balance,
        name,
        transactions
      }
    }

    updateAccount({ variables: updatedAccount, optimisticResponse });

    setFormData({
      index: null,
      description: '',
      amount: '',
      type: 'expense',
      startDate: ''
    });
  }

  function handleCancel() {
    setFormData({
      index: null,
      description: '',
      amount: '',
      type: 'expense',
      startDate: ''
    });
  }

  if (loading || error) {
    return;
  }

  return (
    <Modal
      id='transactionModal'
      heading={`${index === null ? 'Add a new' : 'Update'} transaction`}
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
