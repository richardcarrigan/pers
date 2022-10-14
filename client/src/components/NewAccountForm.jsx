import { useState } from 'react';
import { useMutation } from '@apollo/client';
import Modal from './Modal';

import { GET_ACCOUNTS } from '../graphQL/queries';
import { ADD_ACCOUNT } from '../graphQL/mutations';

const NewAccountForm = ({ isHidden, setIsHidden }) => {
  const [formData, setFormData] = useState({
    name: '',
    balance: 0
  });

  const [addAccount, { loading, error }] = useMutation(ADD_ACCOUNT, {
    update(cache, { data: { addAccount } }) {
      const data = { ...cache.readQuery({ query: GET_ACCOUNTS }) };
      data.accounts = [...data.accounts, addAccount];
      cache.writeQuery({ query: GET_ACCOUNTS, data });
    }
  });

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>{error.message}</p>;
  }

  const handleFormChange = e => {
    if (e.target.id === 'balance') {
      setFormData({ ...formData, balance: Number(e.target.value) });
    } else {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  return (
    <Modal isHidden={isHidden} setIsHidden={setIsHidden}>
      <h1>Add a new account</h1>
      <form
        onSubmit={e => {
          e.preventDefault();
          addAccount({
            variables: formData,
            optimisticResponse: {
              addAccount: {
                _id: 'temp-id',
                __typename: 'Account',
                ...formData
              }
            }
          });
          setFormData({
            name: '',
            balance: 0
          });
          setIsHidden(true);
        }}
      >
        <label htmlFor='name'>Account Name</label>
        <input
          id='name'
          required
          placeholder='Account name'
          value={formData.name}
          onChange={handleFormChange}
        />
        <label htmlFor='balance'>Current Balance</label>
        <input
          id='balance'
          type='number'
          min='0.01'
          step='0.01'
          required
          placeholder='Account balance'
          value={formData.balance}
          onChange={handleFormChange}
        />
        <div className='btnGroup'>
          <button type='submit'>Submit</button>
          <button
            type='button'
            onClick={e => {
              setIsHidden(true);
              setFormData({
                name: '',
                balance: 0
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
export default NewAccountForm;
