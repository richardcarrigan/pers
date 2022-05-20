import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';

import Home from './pages/Home';

import Header from './components/Header';
import Form from './components/Form';
import Transactions from './pages/Transactions';
import Footer from './components/Footer';

function App() {
  const [transactions, setTransactions] = useState([
    {
      id: 1,
      description: 'Transaction 1',
      recurrence: 'none',
      amount: 10.53,
      type: 'income',
      startDate: '2021-01-01'
    },
    {
      id: 2,
      description: 'Transaction 2',
      recurrence: 'monthly',
      amount: 1250.0,
      type: 'expense',
      startDate: '2021-06-01'
    },
    {
      id: 3,
      description: 'Transaction 3',
      recurrence: 'daily',
      amount: 5.0,
      type: 'expense',
      startDate: '2021-12-01'
    }
  ]);

  const [currentTrans, setCurrentTrans] = useState({
    id: 0,
    startDate: '',
    recurrence: 'none',
    amount: 0,
    type: 'income',
    description: ''
  });

  function onSubmit(newTransaction) {
    let updatedTransactions = [];

    if (currentTrans.id) {
      updatedTransactions = [
        ...transactions.slice(0, currentTrans.id - 1),
        currentTrans,
        ...transactions.slice(currentTrans.id)
      ];
    } else {
      newTransaction.id = transactions.length + 1;
      updatedTransactions = [...transactions, newTransaction];
    }
    setTransactions(updatedTransactions);
    setCurrentTrans({
      id: 0,
      startDate: '',
      recurrence: 'none',
      amount: 0,
      type: 'income',
      description: ''
    });
  }

  function onDelete(deletedTransaction) {
    const updatedTransactions = transactions.filter(transaction => {
      return transaction.id !== deletedTransaction.id;
    });
    setTransactions(updatedTransactions);
  }

  function onEdit(editTransaction) {
    setCurrentTrans(editTransaction);
  }

  function onFormChange(e) {
    const newTransaction = { ...currentTrans };
    newTransaction[e.target.name] = e.target.value;
    setCurrentTrans(newTransaction);
  }

  return (
    <>
      <Router>
        <CssBaseline enableColorScheme />
        <Header />
        <div className='container'>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route
              path='/form'
              element={
                <Form
                  submitHandler={onSubmit}
                  currentTrans={currentTrans}
                  changeHandler={onFormChange}
                />
              }
            />
            <Route
              path='/transactions'
              element={
                <Transactions
                  transactions={transactions}
                  editHandler={onEdit}
                  deleteHandler={onDelete}
                />
              }
            />
          </Routes>
        </div>
        <Footer />
      </Router>
    </>
  );
}

export default App;
