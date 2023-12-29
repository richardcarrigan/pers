import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Account from './pages/Account';
import Profile from './pages/Profile';

import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import Footer from './components/Footer';

function App() {
  const [accountFormData, setAccountFormData] = useState({
    name: '',
    balance: 0
  });

  return (
    <>
      <Router>
        <Header />
        <main>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route
              path='/dashboard'
              element={
                <PrivateRoute>
                  <Dashboard
                    accountFormData={accountFormData}
                    setAccountFormData={setAccountFormData}
                  />
                </PrivateRoute>
              }
            />
            <Route
              path='/accounts/:id'
              element={
                <PrivateRoute>
                  <Account
                    accountFormData={accountFormData}
                    setAccountFormData={setAccountFormData}
                  />
                </PrivateRoute>
              }
            />
            <Route
              path='/profile'
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
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
