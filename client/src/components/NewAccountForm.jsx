import { useMutation, gql } from '@apollo/client';
import Modal from './Modal';

const ADD_ACCOUNT = gql`
  mutation AddAccount($accountName: String!) {
    addAccount(accountName: $accountName) {
      _id
      name
    }
  }
`;

const NewAccountForm = ({ isHidden, setIsHidden, getAccounts }) => {
  let input;
  const [addAccount, { loading, error }] = useMutation(ADD_ACCOUNT, {
    refetchQueries: [getAccounts]
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
            variables: { accountName: input.value }
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
