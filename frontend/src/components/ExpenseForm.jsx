import { useState } from 'react';
import API from '../api/axios';

function ExpenseForm({ onExpenseAdded }) {
  const [form, setForm] = useState({
    title: '',
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0]
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await API.post('/expense', form);
      setSuccess('Expense added successfully!');
      setForm({
        title: '',
        amount: '',
        category: 'Food',
        date: new Date().toISOString().split('T')[0]
      });
      onExpenseAdded();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add expense');
    }
  };

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>Add New Expense</h3>
      {error && <p style={styles.error}>{error}</p>}
      {success && <p style={styles.success}>{success}</p>}
      <form onSubmit={handleSubmit}>
        <input
          style={styles.input}
          type="text"
          name="title"
          placeholder="Expense Title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          style={styles.input}
          type="number"
          name="amount"
          placeholder="Amount (₹)"
          value={form.amount}
          onChange={handleChange}
          required
        />
        <select
          style={styles.input}
          name="category"
          value={form.category}
          onChange={handleChange}
        >
          <option>Food</option>
          <option>Travel</option>
          <option>Bills</option>
          <option>Shopping</option>
          <option>Health</option>
          <option>Other</option>
        </select>
        <input
          style={styles.input}
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />
        <button style={styles.button} type="submit">Add Expense</button>
      </form>
    </div>
  );
}

const styles = {
  card: { backgroundColor: 'white', padding: '24px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', marginBottom: '24px' },
  title: { marginBottom: '16px', color: '#333' },
  input: { width: '100%', padding: '10px', marginBottom: '12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' },
  button: { width: '100%', padding: '12px', backgroundColor: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', fontSize: '15px', cursor: 'pointer' },
  error: { color: 'red', marginBottom: '10px' },
  success: { color: 'green', marginBottom: '10px' }
};

export default ExpenseForm;