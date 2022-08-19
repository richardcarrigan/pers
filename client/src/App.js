import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Account from './pages/Account';

import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Router>
        <Header />
        <main>
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/accounts/:id' element={<Account />} />
          </Routes>
        </main>
        <Footer />
      </Router>
    </>
  );
}

export default App;
