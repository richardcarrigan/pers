import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { FaPencilAlt, FaSave, FaTrashAlt } from 'react-icons/fa';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

import Transaction from '../components/Transaction';
import NewTransactionForm from '../components/NewTransactionForm';

import { GET_ACCOUNT, GET_ACCOUNTS } from '../graphQL/queries';
import {
  UPDATE_ACCOUNT,
  DELETE_ACCOUNT,
  UPDATE_TRANSACTION
} from '../graphQL/mutations';

export default function Account() {
  const { id } = useParams();
  const [isHidden, setIsHidden] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    recurrence: 'none',
    amount: 0.01,
    type: 'expense',
    startDate: ''
  });
  const [accountName, setAccountName] = useState('');

  const navigate = useNavigate();

  const handleAddTransaction = () => {
    setIsHidden(false);
  };

  const onDragEnd = result => {
    const { source, destination, draggableId } = result;
    const transactions = [...queryData.account.transactions];

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

  const {
    loading: queryLoading,
    error: queryError,
    data: queryData
  } = useQuery(GET_ACCOUNT, {
    variables: { id },
    pollInterval: 100
  });

  const [updateAccount, { mutationLoading, mutationError }] = useMutation(
    UPDATE_ACCOUNT,
    {
      refetchQueries: [{ query: GET_ACCOUNT, variables: { id } }]
    }
  );

  const [deleteAccount, { deleteMutationLoading, deleteMutationError }] =
    useMutation(DELETE_ACCOUNT, {
      refetchQueries: [{ query: GET_ACCOUNTS }]
    });

  const [updateTransaction] = useMutation(UPDATE_TRANSACTION);

  if (queryLoading || mutationLoading || deleteMutationLoading)
    return <p>Loading...</p>;
  if (queryError || mutationError || deleteMutationError)
    return <p>Error 😢</p>;

  const sortedTransactions = [...queryData.account.transactions].sort(
    (a, b) => a.displayOrder - b.displayOrder
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className='accountHeading'>
        {isEditing ? (
          <>
            <input
              type='text'
              value={accountName}
              className='accountNameUpdateInput'
              onChange={e => {
                setAccountName(e.target.value);
              }}
            />
            <FaSave
              className='btn'
              onClick={e => {
                setIsEditing(false);
                updateAccount({
                  variables: {
                    accountId: queryData.account._id,
                    updatedAccountName: accountName
                  }
                });
              }}
            />
          </>
        ) : (
          <>
            <h1>{queryData.account.name}</h1>
            <FaPencilAlt
              className='btn'
              onClick={e => {
                setAccountName(queryData.account.name);
                setIsEditing(true);
              }}
            />
            <FaTrashAlt
              className='btn'
              onClick={e => {
                deleteAccount({
                  variables: { accountId: queryData.account._id }
                });
                navigate('/');
              }}
            />
          </>
        )}
      </div>
      <h2>Transactions</h2>
      <Droppable droppableId={queryData.account._id}>
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
                  accountId={queryData.account._id}
                />
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <div className='btnGroup'>
        <button
          id='addTransactionBtn'
          type='button'
          onClick={handleAddTransaction}
        >
          Add new transaction
        </button>
        <button type='button' onClick={e => navigate('/')}>
          Back
        </button>
      </div>
      <NewTransactionForm
        isHidden={isHidden}
        setIsHidden={setIsHidden}
        formData={formData}
        setFormData={setFormData}
        accountId={queryData.account._id}
      />
    </DragDropContext>
  );
}
