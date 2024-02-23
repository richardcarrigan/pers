import { useMutation } from '@apollo/client';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import Transaction from '../components/Transaction';
import { UPDATE_ACCOUNT } from '../graphQL/mutations';

const TransactionList = ({
  account,
  setAccountFormData,
  setTransactionFormData
}) => {
  const { _id: accountId, name, balance, transactions } = account;

  const [updateAccount] = useMutation(UPDATE_ACCOUNT);

  const onDragEnd = result => {
    const { source, destination } = result;
    let updatedTransactions = [...transactions];

    if (!destination || source.index === destination.index) {
      return;
    }

    const droppedTransaction = updatedTransactions.splice(source.index, 1);
    updatedTransactions.splice(destination.index, 0, ...droppedTransaction);

    updatedTransactions = updatedTransactions.map(transaction => {
      const { __typename, ...reducedTransaction } = transaction;
      return reducedTransaction;
    });

    const updatedAccount = {
      accountId,
      name,
      balance,
      transactions: updatedTransactions
    }

    updateAccount({
      variables: updatedAccount,
      optimisticResponse: {
        updateAccount: {
          _id: accountId,
          __typename: 'Account',
          name,
          balance,
          transactions: updatedTransactions
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
            <TableContainer component={Paper} sx={{marginBlock: '15px'}}>
              <Table
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Description</TableCell>
                    <TableCell sx={{textAlign: 'right'}}>Amount</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map((transaction, index) => {
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
                        balance={runningBalance}
                        index={index}
                        key={index}
                        setTransactionFormData={setTransactionFormData}
                        transaction={transaction}
                      />
                    );
                  })}
                  {provided.placeholder}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};

export default TransactionList;
