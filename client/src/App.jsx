import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Account from './pages/Account';

import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  const [accountFormData, setAccountFormData] = useState({
    name: '',
    balance: 0.01
  });

  return (
    <>
      <Router>
        <Header />
        <main>
          <Routes>
            <Route
              path='/'
              element={
                <Home
                  accountFormData={accountFormData}
                  setAccountFormData={setAccountFormData}
                />
              }
            />
            <Route
              path='/accounts/:id'
              element={
                <Account
                  accountFormData={accountFormData}
                  setAccountFormData={setAccountFormData}
                />
              }
            />
          </Routes>
        </main>
        <Footer />
      </Router>
    </>
  );
}

export default App;
