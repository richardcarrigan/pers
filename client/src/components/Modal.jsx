const Modal = ({ isVisible, setIsVisible, setFormData, children }) => {
  return (
    <div
      className={`overlay ${isVisible ? '' : 'hidden'}`}
      onClick={() => {
        setIsVisible(false);
        setFormData({
          description: '',
          recurrence: 'none',
          amount: 0.00,
          type: 'expense',
          startDate: ''
        });
      }}
    >
      <div
        id='modal'
        className={isVisible ? '' : 'hidden'}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};
export default Modal;
