import { useMutation } from '@apollo/client';
import Modal from './Modal';

import { GET_ACCOUNTS } from '../graphQL/queries';
import { ADD_ACCOUNT } from '../graphQL/mutations';

const NewAccountForm = ({ isHidden, setIsHidden }) => {
  let input;
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

  return (
    <Modal isHidden={isHidden} setIsHidden={setIsHidden}>
      <h1>Add a new account</h1>
      <form
        onSubmit={e => {
          e.preventDefault();
          addAccount({
            variables: { accountName: input.value },
            optimisticResponse: {
              addAccount: {
                _id: 'temp-id',
                __typename: 'Account',
                name: input.value
              }
            }
          });
          input.value = '';
          setIsHidden(true);
        }}
      >
        <label htmlFor='accountName'>Account Name</label>
        <input
          ref={node => (input = node)}
          required
          placeholder='Account name'
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
export default NewAccountForm;
