import { IconButton, Stack, TableCell, TableRow } from '@mui/material';
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
    type !== 'initial'
      ? <Draggable draggableId={_id} index={index}>
          {provided => (
            <TableRow
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <TableCell>
              <div
                // className="transDescription"
              >{description}</div>
              <div
                className="transDate"
              >{startDateFormatted}</div>
              </TableCell>
              <TableCell>
              <div
                className="transAmount"
                style={{
                  color: type === 'income'
                    ? 'green'
                    : 'inherit',
                  textAlign: 'right'
                }}>
                  {Intl.NumberFormat('en-us', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(type === 'income' ? amount : amount * -1)}
                </div>
                <div className="transBalance" style={{ color: balance < 0 && 'red', textAlign: 'right' }}>
                  {Intl.NumberFormat('en-us', { style: 'currency', currency: 'USD' }).format(balance)}
                </div>
              </TableCell>
            <TableCell>
              <Stack direction='row' spacing={1} sx={{ justifyContent: 'end' }}>
                <IconButton onClick={() => {
                  if (description !== 'Initial balance') {
                    setTransactionFormData(transaction);
                    transactionModal.showModal();
                  }
                }}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => {
                  if (description !== 'Initial balance') {
                    setTransactionFormData(transaction);
                    deleteTransactionModal.showModal();
                  }
                }}>
                  <DeleteIcon />
                </IconButton>
              </Stack>
              </TableCell>
            </TableRow>
          )}
        </Draggable>
      : <TableRow>
          <TableCell>
          <div>{description}</div>
          </TableCell>
          <TableCell>
          <div
            className="transAmount"
            style={{ textAlign: 'right' }}>
              {Intl.NumberFormat('en-us', {
                style: 'currency',
                currency: 'USD'
              }).format(amount)}
            </div>
          </TableCell>
        <TableCell sx={{ textAlign: 'right' }}>
          <Stack direction='row' spacing={1} sx={{ justifyContent: 'end' }}>
            <IconButton onClick={() => {
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
          </TableCell>
        </TableRow>
  );
}
