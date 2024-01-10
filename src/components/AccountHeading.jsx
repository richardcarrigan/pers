import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';

const AccountHeading = ({
  _id,
  name,
  balance,
  setAccountFormData
}) => {
  return (
    <div className='accountHeading'>
      <h1>{name}</h1>
      <FaPencilAlt
        className='btn btn-icon'
        onClick={() => {
          setAccountFormData({
            _id,
            name,
            balance
          });
          accountModal.showModal();
        }}
      />
      <FaTrashAlt
        className='btn btn-icon'
        onClick={() => {
          deleteAccountModal.showModal()
        }}
      />
    </div>
  );
};

export default AccountHeading;
