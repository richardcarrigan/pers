import { useState } from 'react';
import { FaDollarSign } from 'react-icons/fa';
import { useMutation, gql } from '@apollo/client';
import Modal from './Modal';

const ADD_TRANSACTION = gql`
  mutation AddTransaction(
    $description: String!
    $recurrence: RecurrenceOptions!
    $amount: Float!
    $type: TransactionTypes!
    $startDate: String!
    $accountId: ID!
  ) {
    addTransaction(
      description: $description
      recurrence: $recurrence
      amount: $amount
      type: $type
      startDate: $startDate
      accountId: $accountId
    ) {
      _id
      description
      recurrence
      amount
      type
      startDate
    }
  }
`;

const NewTransactionForm = ({
  isHidden,
  setIsHidden,
  getAccount,
  accountId
}) => {
  const [formData, setFormData] = useState({
    description: '',
    recurrence: 'none',
    amount: 0.01,
    type: 'expense',
    startDate: ''
  });

  const { description, recurrence, amount, type, startDate } = formData;

  const [addTransaction, { loading, error }] = useMutation(ADD_TRANSACTION, {
    refetchQueries: [getAccount]
  });

  const handleFormChange = e => {
    if (e.target.id === 'amount') {
      setFormData({ ...formData, amount: Number(e.target.value) });
    } else {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>{error.message}</p>;
  }

  return (
    <Modal isHidden={isHidden} setIsHidden={setIsHidden}>
      <h1>Add a new transaction</h1>
      <form
        onSubmit={e => {
          e.preventDefault();
          addTransaction({
            variables: { ...formData, accountId }
          });
          setIsHidden(true);
          setFormData({
            description: '',
            recurrence: 'none',
            amount: 0.01,
            type: 'expense',
            startDate: ''
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
          value={startDate}
          id='startDate'
          required
          onChange={handleFormChange}
        />
        <div className='btnGroup'>
          <button type='submit'>Submit</button>
          <button type='button' onClick={e => setIsHidden(true)}>
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};
export default NewTransactionForm;
