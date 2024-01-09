const Modal = ({ id, heading, submitHandler, cancelHandler, children }) => {
  return (
    <dialog id={id} className='modal'>
      <h1>{heading}</h1>
      <form method='dialog'
        onSubmit={submitHandler}
      >
        {children}
        <div className='btnGroup'>
          <button className="btn btn-primary" type='submit' value='default'>Submit</button>
          <button
            className='btn btn-secondary' type='button' value='cancel'
            onClick={() => {
              if (cancelHandler) {
                cancelHandler();
              }
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
