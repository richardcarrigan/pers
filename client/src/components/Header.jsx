import { Link } from 'react-router-dom';

function Header() {
  return (
    <header>
      <Link to='/'>
        <h3>Pers.io</h3>
      </Link>
    </header>
  );
}

export default Header;
