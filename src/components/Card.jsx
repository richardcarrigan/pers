const Card = ({ heading, children }) => {
  return (
    <div className='card'>
      <header>
        <h2>{heading}</h2>
      </header>
      <main>{children}</main>
    </div>
  );
};
export default Card;
