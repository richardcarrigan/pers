import { useState } from 'react';
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField
} from '@mui/material';

function Form({ submitHandler, currentTrans, changeHandler }) {
  const [formData, setFormData] = useState({
    startDate: '',
    recurrence: 'none',
    amount: 0,
    type: 'income',
    description: ''
  });
  const { startDate, recurrence, amount, type, description } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    submitHandler(formData);
    setFormData({
      startDate: '',
      recurrence: 'none',
      amount: 0,
      type: 'income',
      description: ''
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl fullWidth>
        <TextField
          id='startDate'
          label='Start Date'
          name='startDate'
          onChange={onChange}
          required
          type='date'
          value={startDate}
        />
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id='recurrence-label'>Recurrence</InputLabel>
        <Select
          labelId='recurrence-label'
          id='recurrence'
          onChange={onChange}
          value={recurrence}
          name='recurrence'
          required
        >
          <MenuItem value='none'>none</MenuItem>
          <MenuItem value='daily'>daily</MenuItem>
          <MenuItem value='weekly'>weekly</MenuItem>
          <MenuItem value='monthly'>monthly</MenuItem>
          <MenuItem value='yearly'>yearly</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <TextField
          id='amount'
          label='Amount'
          name='amount'
          onChange={onChange}
          required
          type='number'
          value={amount}
        />
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id='type-label'>Type</InputLabel>
        <Select
          labelId='type-label'
          id='type'
          label='type'
          name='type'
          onChange={onChange}
          required
          value={type}
        >
          <MenuItem value='income'>income</MenuItem>
          <MenuItem value='expense'>expense</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <TextField
          variant='outlined'
          id='description'
          label='Description'
          name='description'
          onChange={onChange}
          required
          type='text'
          value={description}
        />
      </FormControl>
      <Button variant='contained' type='submit'>
        Submit
      </Button>
    </form>
  );
}

export default Form;
