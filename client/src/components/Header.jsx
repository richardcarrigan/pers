import { Link } from 'react-router-dom';

function Header() {
  return (
    <header>
      <Link to='/'>
        <h3 id='brand'>Pers.io</h3>
      </Link>
    </header>
  );
}

export default Header;
