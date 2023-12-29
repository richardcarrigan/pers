import { FaDollarSign } from 'react-icons/fa';
import { useMutation } from '@apollo/client';
import { useAuth0 } from '@auth0/auth0-react';
import Modal from './Modal';

import { GET_ACCOUNT, GET_ACCOUNTS } from '../graphQL/queries';
import { ADD_ACCOUNT, UPDATE_ACCOUNT } from '../graphQL/mutations';

const NewAccountForm = ({
  formData,
  setFormData,
  transactions
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
        data.account = { ...updateAccount, transactions };
        cache.writeQuery({ query: GET_ACCOUNT, variables: { userId }, data });
      }
    });

  function handleFormChange(e) {
    if (e.target.id === 'balance') {
      setFormData({ ...formData, [e.target.id]: parseFloat(e.target.value) });
    } else {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  function handleSubmit() {
    if (_id) {
      updateAccount({
        variables: {
          accountId: _id,
          name,
          balance
        },
        optimisticResponse: {
          updateAccount: {
            _id,
            __typename: 'Account',
            name,
            balance
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
            userId
          }
        }
      });
    }
    setFormData({
      name: '',
      balance: 0
    });
  }

  function handleCancel() {
    setFormData({
      name: '',
      balance: 0
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
