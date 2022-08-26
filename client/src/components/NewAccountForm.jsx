import { useMutation, gql } from '@apollo/client';

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

  const handleCancel = () => {
    setIsHidden(true);
  };

  return (
    <div
      className={`overlay ${isHidden ? 'hidden' : ''}`}
      onClick={handleCancel}
    >
      <div
        id='newAccountForm'
        className={isHidden ? 'hidden' : ''}
        onClick={e => e.stopPropagation()}
      >
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
          <div class='btnGroup'>
            <button type='submit'>Submit</button>
            <button type='button' onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default NewAccountForm;
