import { IconButton, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const AccountHeading = ({
  _id,
  name,
  balance,
  setAccountFormData
}) => {
  return (
    <Stack direction='row' spacing={1}>
      <h1>{name}</h1>
      <IconButton onClick={() => {
        setAccountFormData({
          _id,
          name,
          balance
        });
        accountModal.showModal();
      }}>
        <EditIcon />
      </IconButton>
      <IconButton onClick={() => {
        deleteAccountModal.showModal()
      }}>
        <DeleteIcon />
      </IconButton>
    </Stack>
  );
};

export default AccountHeading;
