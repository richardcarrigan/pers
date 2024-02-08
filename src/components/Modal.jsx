import { Button } from '@mui/material';

const Modal = ({ id, heading, submitHandler, cancelHandler, children }) => {
  return (
    <dialog id={id} className='modal'>
      <h1>{heading}</h1>
      <form method='dialog'
        onSubmit={submitHandler}
      >
        {children}
        <div className='btnGroup'>
          <Button variant='contained' type='submit' value='default'>Submit</Button>
          <Button
            variant='outlined' value='cancel'
            onClick={() => {
              if (cancelHandler) {
                cancelHandler();
              }
              document.getElementById(id).close();
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
    </dialog>
  );
};
export default Modal;
