import { useState } from 'react';
import {
  ListItem,
  ListItemText,
  OutlinedInput,
  InputAdornment
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function Transaction({ transaction, balance, deleteHandler, editHandler }) {
  const { startDate, description, amount, type } = transaction;

  const [isEdit, setIsEdit] = useState(false);

  const handleDelete = () => {
    deleteHandler(transaction);
  };

  const handleEdit = () => {
    setIsEdit(prevState => !prevState);
  };

  return (
    <ListItem>
      <ListItemText
        primary={
          isEdit ? <OutlinedInput value={startDate} size='small' /> : startDate
        }
      />
      <ListItemText
        primary={
          isEdit ? (
            <OutlinedInput value={description} size='small' />
          ) : (
            description
          )
        }
      />
      <ListItemText
        primary={
          type === 'expense' ? (
            isEdit ? (
              <OutlinedInput
                value={amount * -1}
                type='number'
                size='small'
                startAdornment={
                  <InputAdornment position='start'>$</InputAdornment>
                }
              />
            ) : (
              `$${amount * -1}`
            )
          ) : isEdit ? (
            <OutlinedInput
              value={amount}
              type='number'
              size='small'
              startAdornment={
                <InputAdornment position='start'>$</InputAdornment>
              }
            />
          ) : (
            `$${amount}`
          )
        }
      />
      <ListItemText
        secondary={balance < 0 ? `-$${balance * -1}` : `$${balance}`}
      />
      <ListItemText primary={<EditIcon onClick={handleEdit} />} />
      <ListItemText primary={<DeleteIcon onClick={handleDelete} />} />
    </ListItem>
  );
}

export default Transaction;
