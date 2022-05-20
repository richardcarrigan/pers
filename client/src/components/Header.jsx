import { Link } from 'react-router-dom';

function Header() {
  return (
    <header>
      <h3>Pers.io</h3>
      <nav>
        <Link to='/'>Home</Link>
        <Link to='/transactions'>Transactions</Link>
      </nav>
    </header>
  );
}

export default Header;
