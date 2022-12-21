const Modal = ({ id, heading, submitHandler, cancelHandler, children }) => {
  return (
    <dialog id={id} className='modal'>
      <h1>{heading}</h1>
      <form method='dialog'
        onSubmit={submitHandler}
      >
        {children}
        <div className='btnGroup'>
          <button type='submit' value='default'>Submit</button>
          <button
            type='button' value='cancel'
            onClick={() => {
              cancelHandler();
              document.getElementById(id).close();
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </dialog>
  );
};
export default Modal;
