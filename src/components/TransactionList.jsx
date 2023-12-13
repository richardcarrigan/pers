import { useMutation } from '@apollo/client';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { useAuth0 } from '@auth0/auth0-react';

import Transaction from '../components/Transaction';
import { UPDATE_TRANSACTION } from '../graphQL/mutations';
import { GET_ACCOUNT } from '../graphQL/queries';

const TransactionList = ({
  accountId,
  accountName,
  balance,
  setAccountFormData,
  setTransactionFormData,
  transactionsProp
}) => {
  const { user } = useAuth0();
  const userId = user.sub;

  const [updateTransaction] = useMutation(UPDATE_TRANSACTION, {
    update(cache, { data: { updateTransaction } }) {
      const data = {
        ...cache.readQuery({
          query: GET_ACCOUNT,
          variables: { id: accountId, userId }
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
        variables: { id: accountId, userId },
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
      console.log('nothing should happen');
      return;
    }

    transactions.forEach(transaction => {
      const {
        _id,
        amount,
        description,
        displayOrder,
        recurrence,
        startDate,
        type
      } = transaction;

      if (_id === draggableId) {
        updateTransaction({
          variables: {
            amount,
            description,
            displayOrder: destination.index,
            recurrence,
            startDate,
            transactionId: draggableId,
            type
          },
          optimisticResponse: {
            updateTransaction: {
              _id,
              __typename: 'Transaction',
              amount,
              description,
              displayOrder: destination.index,
              recurrence,
              startDate,
              type,
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
              amount,
              description,
              displayOrder: displayOrder - 1,
              recurrence,
              startDate,
              transactionId: _id,
              type
            },
            optimisticResponse: {
              updateTransaction: {
                _id,
                __typename: 'Transaction',
                amount,
                description,
                displayOrder: displayOrder - 1,
                recurrence,
                startDate,
                type,
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
              amount,
              description,
              displayOrder: displayOrder + 1,
              recurrence,
              startDate,
              transactionId: _id,
              type
            },
            optimisticResponse: {
              updateTransaction: {
                _id,
                __typename: 'Transaction',
                amount,
                description,
                displayOrder: displayOrder + 1,
                recurrence,
                startDate,
                type,
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

  let runningBalance = balance;

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId={accountId}>
          {provided => (
            <table
              className='transactions'
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              <thead className='transactionListHeader'>
                <tr>
                  <th>Description</th>
                  <th style={{textAlign: 'center'}}>Amount</th>
                  <th style={{textAlign: 'right'}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                <Transaction
                  accountId={accountId}
                  accountName={accountName}
                  balance={balance}
                  index='-1'
                  setTransactionFormData={setAccountFormData}
                  transaction={{
                    _id: 'null',
                    amount: balance,
                    description: 'Initial balance',
                    startDate: Date.now(),
                    type: 'initial'
                  }}
                />
                {sortedTransactions.map((transaction, index) => {
                  // This fixes calculation issues when a transaction is either dropped in its starting location or outside the droppable area
                  if (index === 0) {
                    runningBalance = balance;
                  }
                  if (transaction.type === 'income') {
                    runningBalance += transaction.amount
                  } else {
                    runningBalance -= transaction.amount;
                  }
                  return (
                    <Transaction
                      accountId={accountId}
                      balance={runningBalance}
                      index={index}
                      key={transaction._id}
                      setTransactionFormData={setTransactionFormData}
                      transaction={transaction}
                    />
                  );
                })}
                {provided.placeholder}
              </tbody>
            </table>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};

export default TransactionList;