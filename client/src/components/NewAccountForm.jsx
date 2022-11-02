import { useMutation } from '@apollo/client';
import Modal from './Modal';

import { GET_ACCOUNT, GET_ACCOUNTS } from '../graphQL/queries';
import { ADD_ACCOUNT, UPDATE_ACCOUNT } from '../graphQL/mutations';

const NewAccountForm = ({
  isVisible,
  setIsVisible,
  formData,
  setFormData,
  transactions
}) => {
  const { _id, name, balance } = formData;

  const [addAccount, { addMutationLoading, addMutationError }] = useMutation(
    ADD_ACCOUNT,
    {
      update(cache, { data: { addAccount } }) {
        const data = { ...cache.readQuery({ query: GET_ACCOUNTS }) };
        data.accounts = [...data.accounts, addAccount];
        cache.writeQuery({ query: GET_ACCOUNTS, data });
      }
    }
  );

  const [updateAccount, { updateMutationLoading, updateMutationError }] =
    useMutation(UPDATE_ACCOUNT, {
      update(cache, { data: { updateAccount } }) {
        const data = {
          ...cache.readQuery({
            query: GET_ACCOUNT,
            variables: { id: _id }
          })
        };
        data.account = { ...updateAccount, transactions };
        cache.writeQuery({ query: GET_ACCOUNT, data });
      }
    });

  const handleFormChange = e => {
    if (e.target.id === 'balance') {
      setFormData({ ...formData, balance: Number(e.target.value) });
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
      <h1>{`${_id ? 'Update' : 'Add a new'} account`}</h1>
      <form
        onSubmit={e => {
          e.preventDefault();
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
              variables: formData,
              optimisticResponse: {
                addAccount: {
                  _id: 'temp-id',
                  __typename: 'Account',
                  ...formData
                }
              }
            });
          }
          setIsVisible(false);
          setFormData({
            name: '',
            balance: 0.01
          });
        }}
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
        <input
          id='balance'
          type='number'
          min='0.01'
          step='0.01'
          required
          placeholder='Account balance'
          value={balance}
          onChange={handleFormChange}
        />
        <div className='btnGroup'>
          <button type='submit'>Submit</button>
          <button
            type='button'
            onClick={() => {
              setIsVisible(false);
              setFormData({
                name: '',
                balance: 0.01
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
