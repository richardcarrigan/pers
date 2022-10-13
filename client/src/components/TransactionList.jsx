import { useMutation } from '@apollo/client';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import Transaction from '../components/Transaction';
import { UPDATE_TRANSACTION } from '../graphQL/mutations';
import { GET_ACCOUNT } from '../graphQL/queries';

const TransactionList = ({
  transactionsProp,
  accountId,
  handleAddTransaction,
  setFormData,
  accountName
}) => {
  const [updateTransaction] = useMutation(UPDATE_TRANSACTION, {
    update(cache, { data: { updateTransaction } }) {
      const data = {
        ...cache.readQuery({
          query: GET_ACCOUNT,
          variables: { id: accountId }
        })
      };
      const updatedTransaction = { ...updateTransaction };
      delete updatedTransaction.account;
      const updatedTransactions = [...data.account.transactions];
      const index = updatedTransactions.findIndex(transaction => {
        return transaction._id === updatedTransaction._id;
      });
      updatedTransactions.splice(index, 1, updatedTransaction);
      data.account = { ...data.account, transactions: updatedTransactions };
      cache.writeQuery({
        query: GET_ACCOUNT,
        variables: { id: accountId },
        data
      });
    }
  });

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
          optimisticResponse: {
            updateTransaction: {
              _id,
              __typename: 'Transaction',
              description,
              recurrence,
              amount,
              type,
              startDate,
              displayOrder: destination.index,
              account: {
                _id: accountId,
                __typename: 'Account',
                name: accountName
              }
            }
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
            optimisticResponse: {
              updateTransaction: {
                _id,
                __typename: 'Transaction',
                description,
                recurrence,
                amount,
                type,
                startDate,
                displayOrder: displayOrder - 1,
                account: {
                  _id: accountId,
                  __typename: 'Account',
                  name: accountName
                }
              }
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
            optimisticResponse: {
              updateTransaction: {
                _id,
                __typename: 'Transaction',
                description,
                recurrence,
                amount,
                type,
                startDate,
                displayOrder: displayOrder + 1,
                account: {
                  _id: accountId,
                  __typename: 'Account',
                  name: accountName
                }
              }
            }
          });
        }
      }
    });
  };

  return (
    <>
      <h2>Transactions</h2>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={accountId}>
          {provided => (
            <div
              className='transactions'
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <div className='transactionListHeader'>
                <h3>Start Date</h3>
                <h3>Description</h3>
                <h3>Recurrence</h3>
                <h3>Amount</h3>
                <h3>Transaction Type</h3>
                <h3>Edit</h3>
                <h3>Delete</h3>
              </div>
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
    </>
  );
};

export default TransactionList;
