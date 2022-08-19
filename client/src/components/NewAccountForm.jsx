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
    <div className={`overlay ${isHidden ? 'hidden' : ''}`}>
      <div id='newAccountForm' className={isHidden ? 'hidden' : ''}>
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
          <input ref={node => (input = node)} required />
          <button type='submit'>Submit</button>
          <button type='button' onClick={handleCancel}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};
export default NewAccountForm;
