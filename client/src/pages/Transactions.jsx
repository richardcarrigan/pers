import { List } from '@mui/material';
import { Link } from 'react-router-dom';
import Transaction from '../components/Transaction';

function Transactions({ transactions, deleteHandler, editHandler }) {
  let balance = 0;

  const handleDelete = transaction => {
    deleteHandler(transaction);
  };

  const handleEdit = transaction => {
    editHandler(transaction);
  };

  return (
    <>
      <div className='tableContainer'>
        <List>
          {transactions.map(transaction => {
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
                key={transaction.id}
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
