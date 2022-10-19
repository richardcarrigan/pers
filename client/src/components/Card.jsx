const Card = ({ heading, footer, children }) => {
  return (
    <div className='card'>
      <header>
        <h2>{heading}</h2>
      </header>
      <main>{children}</main>
      <footer>{footer}</footer>
    </div>
  );
};
export default Card;
