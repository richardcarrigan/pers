import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import { useMutation } from '@apollo/client';
import { Draggable } from 'react-beautiful-dnd';

import { GET_ACCOUNT } from '../graphQL/queries';
import { DELETE_TRANSACTION } from '../graphQL/mutations';

export default function Transaction({
  index,
  transaction,
  handleAddTransaction,
  setFormData,
  accountId
}) {
  const { _id, description, recurrence, amount, type, startDate } = transaction;

  const [deleteTransaction, { loading, error }] = useMutation(
    DELETE_TRANSACTION,
    {
      refetchQueries: { query: GET_ACCOUNT, variables: { accountId } }
    }
  );

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

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <Draggable draggableId={_id} index={index}>
      {provided => (
        <div
          className='transactionCard'
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <span className='transStartDate'>{startDateFormatted}</span>
          <span className='transDescription'>{description}</span>
          <span className='transRecurrence'>{recurrence}</span>
          <span className='transAmount'>${amount}</span>
          <span className='transType'>{type}</span>
          <FaPencilAlt
            className='btn'
            onClick={() => {
              setFormData(transaction);
              handleAddTransaction(transaction);
            }}
          />
          <FaTrashAlt
            className='btn'
            onClick={() => {
              deleteTransaction({
                variables: { transactionId: _id },
                update(cache) {
                  const normalizedId = cache.identify({
                    id: _id,
                    __typename: 'Transaction'
                  });
                  cache.evict({ id: normalizedId });
                  cache.gc();
                }
              });
            }}
          />
        </div>
      )}
    </Draggable>
  );
}
