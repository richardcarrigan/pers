import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Account from './pages/Account';
import Form from './pages/Form';
import Transactions from './pages/Transactions';

import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/accounts/:id' element={<Account />} />
          <Route path='/form' element={<Form />} />
          <Route path='/transactions' element={<Transactions />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
