import { useMemo, useState } from 'react';
import { CssBaseline, useMediaQuery } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Accounts from './pages/Accounts';
import Account from './pages/Account';
import Profile from './pages/Profile';

import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import Footer from './components/Footer';

function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
        primary: {
          light: '#af72f5',
          main: '#8722ED',
          dark: '#5e00d8',
          contrastText: '#fff',
        },
        secondary: {
          light: '#f8b4f6',
          main: '#ed22ed',
          dark: '#c500d8',
          contrastText: '#000',
        },
      }),
    [prefersDarkMode],
  );
  
  const [accountFormData, setAccountFormData] = useState({
    name: '',
    balance: ''
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Header />
        <main>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route
              path='/accounts'
              element={
                <PrivateRoute>
                  <Accounts
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
    </ThemeProvider>
  );
}

export default App;
