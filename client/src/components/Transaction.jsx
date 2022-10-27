import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import { useMutation } from '@apollo/client';
import { Draggable } from 'react-beautiful-dnd';

import { DELETE_TRANSACTION } from '../graphQL/mutations';
import { GET_ACCOUNT } from '../graphQL/queries';

export default function Transaction({
  index,
  transaction,
  setIsTransactionFormVisible,
  setTransactionFormData,
  accountId
}) {
  const { _id, description, recurrence, amount, type, startDate } = transaction;

  const [deleteTransaction, { loading, error }] = useMutation(
    DELETE_TRANSACTION,
    {
      update(cache, { data: { deleteTransaction } }) {
        const data = {
          ...cache.readQuery({
            query: GET_ACCOUNT,
            variables: { id: accountId }
          })
        };
        const updatedTransactions = data.account.transactions.filter(
          transaction => {
            return transaction._id !== deleteTransaction._id;
          }
        );
        data.account = { ...data.account, transactions: updatedTransactions };
        cache.writeQuery({
          query: GET_ACCOUNT,
          variables: { id: accountId },
          data
        });
      }
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
              if (description !== 'Initial balance') {
                setTransactionFormData(transaction);
                setIsTransactionFormVisible(true);
              }
            }}
          />
          <FaTrashAlt
            className='btn'
            onClick={() => {
              if (description !== 'Initial balance') {
                deleteTransaction({
                  variables: { transactionId: _id },
                  optimisticResponse: {
                    deleteTransaction: {
                      _id,
                      __typename: 'Transaction'
                    }
                  }
                });
              }
            }}
          />
        </div>
      )}
    </Draggable>
  );
}
