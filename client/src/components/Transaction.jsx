import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import { Draggable } from 'react-beautiful-dnd';

export default function Transaction({
  index,
  transaction,
  setTransactionFormData,
  balance
}) {
  const { _id, description, amount, type, startDate } = transaction;

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
    <Draggable draggableId={_id} index={index}>
      {provided => (
        <tr
          className='transactionCard'
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <td className='transStartDate'>{startDateFormatted}</td>
          <td className='transDescription'>{description}</td>
          <td
            className='transAmount'
            style={{ color: type === 'income' ? 'green' : 'inherit', textAlign: 'right' }}
          >
            {Intl.NumberFormat('en-us', {
              style: 'currency',
              currency: 'USD'
            }).format(type === 'income' ? amount : amount * -1)}
          </td>
          <td style={{ color: balance < 0 ? 'red' : 'inherit', textAlign: 'right' }}>
            {Intl.NumberFormat('en-us', { style: 'currency', currency: 'USD' }).format(balance)}
          </td>
          <td>
            <FaPencilAlt
              className='btn'
              onClick={() => {
                if (description !== 'Initial balance') {
                  setTransactionFormData(transaction);
                  transactionModal.showModal();
                }
              }}
            />
            <FaTrashAlt
              className='btn'
              onClick={() => {
                if (description !== 'Initial balance') {
                  setTransactionFormData(transaction);
                  deleteTransactionModal.showModal();
                }
              }}
            />
          </td>
        </tr>
      )}
    </Draggable>
  );
}
