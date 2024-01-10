import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
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
              <td style={{textAlign: 'right'}}>
                <FaPencilAlt
                  className='btn btn-icon'
                  onClick={() => {
                    if (description !== 'Initial balance') {
                      setTransactionFormData(transaction);
                      transactionModal.showModal();
                    }
                  }}
                />
                <FaTrashAlt
                  className='btn btn-icon'
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
            <FaPencilAlt
              className='btn btn-icon'
              onClick={() => {
                setTransactionFormData({
                  _id: accountId,
                  name: accountName,
                  balance
                });
                accountModal.showModal();
              }}
            />
          </td>
        </tr>
  );
}
