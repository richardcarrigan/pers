import { FaDollarSign } from 'react-icons/fa';
import { useMutation } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import Modal from './Modal';

import { GET_ACCOUNT, GET_ACCOUNTS } from '../graphQL/queries';
import { ADD_ACCOUNT, UPDATE_ACCOUNT } from '../graphQL/mutations';

const NewAccountForm = ({
  account,
  formData,
  setFormData
}) => {
  const { _id, name, balance } = formData;
  
  const { user } = useAuth0();
  
  const userId = user.sub;
  
  const [addAccount, { addMutationLoading, addMutationError }] = useMutation(
    ADD_ACCOUNT,
    {
      update(cache, { data: { addAccount } }) {
        const data = { ...cache.readQuery({ query: GET_ACCOUNTS, variables: { userId } }) };
        data.accounts = [...data.accounts, addAccount];
        cache.writeQuery({ query: GET_ACCOUNTS, variables: { userId }, data });
      }
    }
    );
    
  const [updateAccount, { updateMutationLoading, updateMutationError }] =
    useMutation(UPDATE_ACCOUNT, {
      update(cache, { data: { updateAccount } }) {
        const data = {
          ...cache.readQuery({
            query: GET_ACCOUNT,
            variables: { id: _id, userId }
          })
        };
        data.account = { ...updateAccount };
        cache.writeQuery({ query: GET_ACCOUNT, variables: { userId }, data });
      }
    });
    
    function handleFormChange(e) {
    if (e.target.id === 'balance' && !isNaN(parseFloat(e.target.value))) {
      setFormData({ ...formData, [e.target.id]: parseFloat(e.target.value) });
    } else {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  function handleSubmit() {
    if (_id) {
      const { transactions } = account;

      updateAccount({
        variables: {
          accountId: _id,
          name,
          balance,
          transactions
        },
        optimisticResponse: {
          updateAccount: {
            _id,
            __typename: 'Account',
            name,
            balance,
            transactions
          }
        }
      });
    } else {
      addAccount({
        variables: { ...formData, userId },
        optimisticResponse: {
          addAccount: {
            _id: 'temp-id',
            __typename: 'Account',
            ...formData,
            userId,
            transactions: []
          }
        }
      });
    }
    setFormData({
      name: '',
      balance: ''
    });
  }

  function handleCancel() {
    setFormData({
      name: '',
      balance: ''
    });
  }

  return (
    <Modal
      id='accountModal'
      heading={`${_id ? 'Update' : 'Add a new'} account`}
      submitHandler={handleSubmit}
      cancelHandler={handleCancel}
    >
      <label htmlFor='name'>Account Name</label>
      <input
        id='name'
        type='text'
        value={name}
        onChange={handleFormChange}
        required
        placeholder='Account name'
      />
      <label htmlFor='balance'>Current Balance</label>
      <div className='amountInputWithIcon'>
        <FaDollarSign />
        <input
          id='balance'
          type='number'
          min='0'
          step='0.01'
          required
          placeholder='Account balance'
          value={balance}
          onChange={handleFormChange}
        />
      </div>
    </Modal>
  );
};
export default NewAccountForm;
