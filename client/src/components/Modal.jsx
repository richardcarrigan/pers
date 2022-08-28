const Modal = ({ isHidden, setIsHidden, setFormData, children }) => {
  return (
    <div
      className={`overlay ${isHidden ? 'hidden' : ''}`}
      onClick={() => {
        setIsHidden(true);
        setFormData({
          description: '',
          recurrence: 'none',
          amount: 0.01,
          type: 'expense',
          startDate: ''
        });
      }}
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
