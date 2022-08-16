import { List } from '@mui/material';
import { Link } from 'react-router-dom';
import { useQuery, gql } from '@apollo/client';
import Transaction from '../components/Transaction';

const GET_TRANSACTIONS = gql`
  query getTransactions {
    transactions {
      _id
      description
      type
      amount
      startDate
    }
  }
`;

function Transactions({ transactions, deleteHandler, editHandler }) {
  let balance = 0;

  const handleDelete = transaction => {
    deleteHandler(transaction);
  };

  const handleEdit = transaction => {
    editHandler(transaction);
  };

  const { loading, error, data } = useQuery(GET_TRANSACTIONS);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error :(</p>;
  }

  return (
    <>
      <div className='tableContainer'>
        <List>
          {data.transactions.map(transaction => {
            balance =
              transaction.type === 'income'
                ? balance + transaction.amount
                : balance - transaction.amount;

            return (
              <Transaction
                transaction={transaction}
                balance={balance}
                deleteHandler={handleDelete}
                editHandler={handleEdit}
                key={transaction._id}
              />
            );
          })}
        </List>
      </div>
      <div>
        <Link to='/form'>Add new transaction</Link>
      </div>
    </>
  );
}

export default Transactions;
