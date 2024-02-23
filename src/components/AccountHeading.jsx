import { ButtonGroup, Divider, IconButton, Stack, Typography } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const AccountHeading = ({
  _id,
  name,
  balance,
  setAccountFormData
}) => {
  return (
    <Stack
      direction={{
        md: 'row'
      }}
      justifyContent='space-between'
      flexWrap='wrap'
    >
      <Typography variant='h4' flex='1 1' sx={{ textAlign: { md: 'left' } }}>{name}</Typography>
      <Typography variant='h4' flex='1 1'>
        {Intl.NumberFormat('en-us', {
          style: 'currency',
          currency: 'USD'
        }).format(balance)}
      </Typography>
      <ButtonGroup sx={{ flex: '1 1', display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' } }} >
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
      </ButtonGroup>
    </Stack>
  );
};

export default AccountHeading;
