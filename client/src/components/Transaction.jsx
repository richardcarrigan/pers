import { FaPencilAlt, FaTrashAlt } from 'react-icons/fa';
import { useMutation } from '@apollo/client';
import { Draggable } from 'react-beautiful-dnd';

import { DELETE_TRANSACTION } from '../graphQL/mutations';
import { GET_ACCOUNT } from '../graphQL/queries';

export default function Transaction({
  index,
  transaction,
  setTransactionFormData,
  accountId,
  balance
}) {
  const { _id, description, amount, type, startDate } = transaction;

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
          </td>
        </tr>
      )}
    </Draggable>
  );
}
