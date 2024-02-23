import { useState } from 'react';
import { Button, Collapse, IconButton, TableCell, TableRow } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Draggable } from 'react-beautiful-dnd';

export default function Transaction({
  balance,
  index,
  setTransactionFormData,
  transaction
}) {
  const { amount, description, startDate, type } = transaction;

  const [isOpen, setIsOpen] = useState(false);

  const options = {
    timeZone: 'UTC',
    weekday: 'short',
    month: 'short',
    year: 'numeric',
    day: 'numeric'
  };

  const startDateFormatted = new Intl.DateTimeFormat('en-US', options).format(
    new Date(Number(startDate))
  );

  return (
    <Draggable draggableId={index.toString()} index={index}>
      {provided => (
        <>
          <TableRow
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            sx={{ '& > *': { borderBottom: 'unset'}}}
          >
            <TableCell width='65%'>
              <div>{description}</div>
              <div className="transDate">{startDateFormatted}</div>
            </TableCell>
            <TableCell width='30%'>
              <div
                className="transAmount"
                style={{
                  color: type === 'income'
                  ? 'green'
                  : 'inherit',
                  textAlign: 'right'
                }}
              >
                {Intl.NumberFormat('en-us', {
                  style: 'currency',
                  currency: 'USD'
                }).format(type === 'income' ? amount : amount * -1)}
              </div>
              <div className="transBalance" style={{ color: balance < 0 && 'red', textAlign: 'right' }}>
                {Intl.NumberFormat('en-us', { style: 'currency', currency: 'USD' }).format(balance)}
              </div>
            </TableCell>
            <TableCell align='right' width='5%'>
              <IconButton
                aria-label='expand row'
                // size='small'
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </IconButton>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell sx={{ paddingBlock: 0 }} colSpan={3}>
              <Collapse in={isOpen} timeout='auto' unmountOnExit>
                <div className="btnGroup">
                  <Button variant='contained' onClick={() => {
                    if (description !== 'Initial balance') {
                      setTransactionFormData({ index, ...transaction });
                      transactionModal.showModal();
                    }
                  }}>
                    Edit
                  </Button>
                  <Button variant='outlined' onClick={() => {
                    if (description !== 'Initial balance') {
                      setTransactionFormData({ index, ...transaction });
                      deleteTransactionModal.showModal();
                    }
                  }}>
                    Delete
                  </Button>
                </div>
              </Collapse>
            </TableCell>
          </TableRow>
        </>
      )}
    </Draggable>
  );
}
