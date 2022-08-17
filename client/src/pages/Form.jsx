export default function Form() {
  return (
    <form>
      <label htmlFor='startDate'>Start Date</label>
      <input type='date' id='startDate' name='startDate' required />
      <label htmlFor='recurrence'>Recurrence</label>
      <select id='recurrence' name='recurrence' required>
        <option value='none'>none</option>
        <option value='daily'>daily</option>
        <option value='weekly'>weekly</option>
        <option value='monthly'>monthly</option>
        <option value='yearly'>yearly</option>
      </select>
      <label htmlFor='amount'>Amount</label>
      <input type='number' id='amount' name='amount' required />
      <label htmlFor='type'>Type</label>
      <select id='type' name='type' required>
        <option value='income'>income</option>
        <option value='expense'>expense</option>
      </select>
      <label htmlFor='description'>Description</label>
      <input type='text' id='description' name='description' required />
      <button type='submit'>Submit</button>
    </form>
  );
}
