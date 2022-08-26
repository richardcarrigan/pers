const Modal = ({ isHidden, setIsHidden, children }) => {
  return (
    <div
      className={`overlay ${isHidden ? 'hidden' : ''}`}
      onClick={e => setIsHidden(true)}
    >
      <div
        id='modal'
        className={isHidden ? 'hidden' : ''}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};
export default Modal;
