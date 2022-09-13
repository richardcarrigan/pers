import { FaDollarSign } from 'react-icons/fa';
import { useMutation } from '@apollo/client';
import Modal from './Modal';

import { GET_ACCOUNT } from '../graphQL/queries';
import { ADD_TRANSACTION, UPDATE_TRANSACTION } from '../graphQL/mutations';

const NewTransactionForm = ({
  isHidden,
  setIsHidden,
  formData,
  setFormData,
  accountId
}) => {
  const { description, recurrence, amount, type, startDate } = formData;

  let startDateFormatted;
  if (formData._id) {
    startDateFormatted = new Date(Number(startDate));
    startDateFormatted = `${startDateFormatted.getUTCFullYear()}-${
      startDateFormatted.getUTCMonth() + 1 < 10
        ? `0${startDateFormatted.getUTCMonth() + 1}`
        : startDateFormatted.getUTCMonth()
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
      refetchQueries: [{ query: GET_ACCOUNT, variables: { id: accountId } }]
    });

  const [updateTransaction, { updateMutationLoading, updateMutationError }] =
    useMutation(UPDATE_TRANSACTION, [
      { refetchQueries: { query: GET_ACCOUNT, variables: { id: accountId } } }
    ]);

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
      isHidden={isHidden}
      setIsHidden={setIsHidden}
      setFormData={setFormData}
    >
      <h1>{`${formData._id ? 'Update' : 'Add a new'} transaction`}</h1>
      <form
        onSubmit={e => {
          e.preventDefault();
          if (formData._id) {
            updateTransaction({
              variables: {
                transactionId: formData._id,
                description,
                recurrence,
                amount,
                type,
                startDate: startDateFormatted
              }
            });
          } else {
            addTransaction({
              variables: { ...formData, accountId }
            });
          }
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
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};
export default NewTransactionForm;
