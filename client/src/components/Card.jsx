const Card = ({ heading, children }) => {
  return (
    <div className='card'>
      <div className='cardHeading'>
        <h2>{heading}</h2>
      </div>
      <div className='cardBody'>{children}</div>
    </div>
  );
};
export default Card;
