import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import { useMutation, gql } from '@apollo/client';
import { Draggable } from 'react-beautiful-dnd';

const DELETE_TRANSACTION = gql`
  mutation DeleteTransaction($transactionId: ID!) {
    deleteTransaction(transactionId: $transactionId)
  }
`;

export default function Transaction({
  index,
  transaction,
  handleAddTransaction,
  setFormData,
  getAccount,
  accountId
}) {
  const { _id, description, recurrence, amount, type, startDate } = transaction;

  const [deleteTransaction, { loading, error }] = useMutation(
    DELETE_TRANSACTION,
    {
      refetchQueries: { query: getAccount, variables: { accountId } }
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
          <span>{startDateFormatted}</span>
          <span>{description}</span>
          <span>{recurrence}</span>
          <span>{amount}</span>
          <span>{type}</span>
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
