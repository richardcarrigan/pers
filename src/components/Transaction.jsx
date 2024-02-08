import { IconButton, List, ListItem, ListItemText, Stack } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Draggable } from 'react-beautiful-dnd';

export default function Transaction({
  accountId,
  accountName,
  balance,
  index,
  setTransactionFormData,
  transaction
}) {
  const { _id, amount, description, startDate, type } = transaction;

  const options = {
    timeZone: 'UTC',
    weekday: 'short',
    month: 'short',
    year: 'numeric',
    day: 'numeric'
  };

  const startDateFormatted = new Intl.DateTimeFormat('en-US', options).format(
    new Date(Number(startDate))
  );

  return (
    type !== 'initial' ? (
      <Draggable draggableId={_id} index={index}>
        {provided => (
          <ListItem
            secondaryAction={
              <Stack direction='row' spacing={1} sx={{ justifyContent: 'end' }}>
                <IconButton aria-label='edit' onClick={() => {
                  if (description !== 'Initial balance') {
                    setTransactionFormData(transaction);
                    transactionModal.showModal();
                  }
                }}>
                  <EditIcon />
                </IconButton>
                <IconButton aria-label='delete' onClick={() => {
                  if (description !== 'Initial balance') {
                    setTransactionFormData(transaction);
                    deleteTransactionModal.showModal();
                  }
                }}>
                  <DeleteIcon />
                </IconButton>
              </Stack>
            }
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
              <ListItemText
                primary={
                  <span className='transDescription'>
                    {description}
                  </span>
                }
                secondary={
                  <span className='transDate'>
                    {startDateFormatted}
                  </span>
                }
              />
              <ListItemText
                primary={
                  <span className="transAmount" style={{ color: type === 'income' ? 'green' : 'inherit' }}>
                    {
                      Intl.NumberFormat('en-us', {
                        style: 'currency',
                        currency: 'USD'
                      }).format(type === 'income' ? amount : amount * -1)
                    }
                  </span>
                }
                secondary={
                  <span className="transBalance" style={{ color: balance < 0 && 'red' }}>
                    {
                      Intl.NumberFormat('en-us', {
                        style: 'currency', currency: 'USD'
                      }).format(balance)
                    }
                  </span>
                }
              />
            </ListItem>
        )}
      </Draggable>
    ) : (
      <ListItem secondaryAction={
        <Stack direction='row' spacing={1} sx={{ justifyContent: 'end' }}>
          <IconButton aria-label='edit' onClick={() => {
            setTransactionFormData({
              _id: accountId,
              name: accountName,
              balance
            });
            accountModal.showModal();
          }}>
            <EditIcon />
          </IconButton>
        </Stack>
      }>
          <ListItemText
            primary={
              <span className='transDescription'>
                {description}
              </span>
            }
          />
        <ListItemText
            primary={
              <span className='transAmount'>
                {
                  Intl.NumberFormat('en-us', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(amount)
                }
              </span>
          }
        />
      </ListItem>
    )
  );
}
