const Card = ({ heading }) => {
  return (
    <div className='card'>
      <div className='cardHeading'>
        <h2>{heading}</h2>
      </div>
      <div className='cardBody'>
        <p>Click to view transactions</p>
      </div>
    </div>
  );
};
export default Card;
