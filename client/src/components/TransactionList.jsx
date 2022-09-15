import { useMutation } from '@apollo/client';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import Transaction from '../components/Transaction';
import { UPDATE_TRANSACTION } from '../graphQL/mutations';

const TransactionList = ({
  transactionsProp,
  accountId,
  handleAddTransaction,
  setFormData
}) => {
  const [updateTransaction] = useMutation(UPDATE_TRANSACTION);

  const sortedTransactions = [...transactionsProp].sort(
    (a, b) => a.displayOrder - b.displayOrder
  );

  const onDragEnd = result => {
    const { source, destination, draggableId } = result;
    const transactions = [...transactionsProp];

    if (!destination || source.index === destination.index) {
      return;
    }

    transactions.forEach(transaction => {
      const {
        _id,
        description,
        recurrence,
        amount,
        type,
        startDate,
        displayOrder
      } = transaction;

      let startDateFormatted = new Date(Number(startDate));
      startDateFormatted = `${startDateFormatted.getUTCFullYear()}-${
        startDateFormatted.getUTCMonth() + 1 < 10
          ? `0${startDateFormatted.getUTCMonth() + 1}`
          : startDateFormatted.getUTCMonth()
      }-${
        startDateFormatted.getUTCDate() < 10
          ? `0${startDateFormatted.getUTCDate()}`
          : startDateFormatted.getUTCDate()
      }`;

      if (_id === draggableId) {
        updateTransaction({
          variables: {
            transactionId: draggableId,
            description,
            recurrence,
            amount,
            type,
            startDate: startDateFormatted,
            displayOrder: destination.index
          },
          update(cache) {
            const normalizedId = cache.identify({
              id: _id,
              __typename: 'Transaction'
            });
            cache.evict({ id: normalizedId });
            cache.gc();
          }
        });
      } else if (source.index < destination.index) {
        if (displayOrder > source.index && displayOrder <= destination.index) {
          updateTransaction({
            variables: {
              transactionId: _id,
              description,
              recurrence,
              amount,
              type,
              startDate: startDateFormatted,
              displayOrder: displayOrder - 1
            },
            update(cache) {
              const normalizedId = cache.identify({
                id: _id,
                __typename: 'Transaction'
              });
              cache.evict({ id: normalizedId });
              cache.gc();
            }
          });
        }
      } else if (destination.index < source.index) {
        if (displayOrder >= destination.index && displayOrder < source.index) {
          updateTransaction({
            variables: {
              transactionId: _id,
              description,
              recurrence,
              amount,
              type,
              startDate: startDateFormatted,
              displayOrder: displayOrder + 1
            },
            update(cache) {
              const normalizedId = cache.identify({
                id: _id,
                __typename: 'Transaction'
              });
              cache.evict({ id: normalizedId });
              cache.gc();
            }
          });
        }
      }
    });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <h2>Transactions</h2>
      <Droppable droppableId={accountId}>
        {provided => (
          <div
            className='transactions'
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {sortedTransactions.map((transaction, index) => {
              return (
                <Transaction
                  key={transaction._id}
                  index={index}
                  transaction={transaction}
                  handleAddTransaction={handleAddTransaction}
                  setFormData={setFormData}
                  accountId={accountId}
                />
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default TransactionList;
