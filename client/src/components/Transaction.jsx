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
          <td style={{textAlign: 'right'}}>
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
