import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import { IconButton, Stack } from '@mui/material';
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
            <tr
              className='transactionCard'
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <td>
                <div className="transDescription">{description}</div>
                <div className="transDate">{startDateFormatted}</div>
              </td>
              <td>
                <div className="transAmount" style={{ color: type === 'income' ? 'green' : 'inherit', textAlign: 'right' }}>
                  {Intl.NumberFormat('en-us', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(type === 'income' ? amount : amount * -1)}
                </div>
                <div className="transBalance" style={{ color: balance < 0 && 'red', textAlign: 'right' }}>
                  {Intl.NumberFormat('en-us', { style: 'currency', currency: 'USD' }).format(balance)}
                </div>
              </td>
            <td>
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
              </td>
            </tr>
          )}
        </Draggable>
      : <tr className='transactionCard'>
          <td>
            <div className="transDescription">{description}</div>
          </td>
          <td>
            <div className="transAmount" style={{ textAlign: 'right' }}>
              {Intl.NumberFormat('en-us', {
                style: 'currency',
                currency: 'USD'
              }).format(amount)}
            </div>
          </td>
        <td style={{ textAlign: 'right' }}>
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
          </td>
        </tr>
  );
}
