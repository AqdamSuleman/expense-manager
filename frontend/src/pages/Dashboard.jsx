import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const CATEGORIES = [
  { name: 'All', emoji: '' },
  { name: 'Food', emoji: '🍔' },
  { name: 'Travel', emoji: '🚗' },
  { name: 'Bills', emoji: '💡' },
  { name: 'Shopping', emoji: '🛍️' },
  { name: 'Health', emoji: '❤️' },
  { name: 'Other', emoji: '📌' }
];

const categoryColors = {
  Food: '#f97316',
  Travel: '#3b82f6',
  Bills: '#ef4444',
  Shopping: '#a855f7',
  Health: '#22c55e',
  Other: '#6b7280'
};

function Dashboard() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [filter, setFilter] = useState('All');
  const [form, setForm] = useState({ title: '', amount: '', category: 'Food', date: new Date().toISOString().split('T')[0] });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchExpenses = async () => {
    try {
      const { data } = await API.get('/expenses');
      setExpenses(data);
    } catch (err) {
      console.error('Failed to fetch expenses');
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    } else {
      fetchExpenses();
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await API.post('/expense', form);
      setSuccess('Expense added!');
      setForm({ title: '', amount: '', category: 'Food', date: new Date().toISOString().split('T')[0] });
      fetchExpenses();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add expense');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const filtered = filter === 'All' ? expenses : expenses.filter(e => e.category === filter);
  const total = filtered.reduce((sum, e) => sum + e.amount, 0);

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <span style={styles.logo}>💰 ExpenseWise</span>
        <div style={styles.navRight}>
          <span style={styles.welcome}>Hello, <strong>{user?.name}</strong></span>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>TOTAL SPENT</p>
          <p style={styles.statValue}>₹{total.toFixed(2)}</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>EXPENSES</p>
          <p style={styles.statValue}>{filtered.length}</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>ACTIVE FILTER</p>
          <p style={styles.statValue}>{filter}</p>
        </div>
      </div>

      {/* Main Grid */}
      <div style={styles.grid}>
        {/* Add Expense Form */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Add Expense</h3>
          {error && <div style={styles.error}>{error}</div>}
          {success && <div style={styles.successMsg}>{success}</div>}
          <form onSubmit={handleSubmit}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>TITLE</label>
              <input style={styles.input} type="text" name="title" placeholder="e.g. Lunch at café" value={form.title} onChange={handleChange} required />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>AMOUNT (₹)</label>
              <input style={styles.input} type="number" name="amount" placeholder="0.00" value={form.amount} onChange={handleChange} required />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>CATEGORY</label>
              <select style={styles.input} name="category" value={form.category} onChange={handleChange}>
                <option>Food</option>
                <option>Travel</option>
                <option>Bills</option>
                <option>Shopping</option>
                <option>Health</option>
                <option>Other</option>
              </select>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>DATE</label>
              <input style={styles.input} type="date" name="date" value={form.date} onChange={handleChange} required />
            </div>
            <button style={styles.addBtn} type="submit">+ Add Expense</button>
          </form>
        </div>

        {/* Expense List */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Expenses</h3>
          {/* Filter Buttons */}
          <div style={styles.filterRow}>
            {CATEGORIES.map(cat => (
              <button
                key={cat.name}
                style={{ ...styles.filterBtn, ...(filter === cat.name ? styles.filterBtnActive : {}) }}
                onClick={() => setFilter(cat.name)}
              >
                {cat.emoji} {cat.name}
              </button>
            ))}
          </div>

          {/* List */}
          {filtered.length === 0 ? (
            <div style={styles.empty}>
              <p style={{ fontSize: '40px' }}>🧾</p>
              <p style={{ color: '#888' }}>No expenses yet. Add your first one!</p>
            </div>
          ) : (
            filtered.map(exp => (
              <div key={exp._id} style={styles.expItem}>
                <div style={styles.expLeft}>
                  <span style={{ ...styles.badge, backgroundColor: categoryColors[exp.category] || '#6b7280' }}>
                    {exp.category}
                  </span>
                  <div>
                    <p style={styles.expTitle}>{exp.title}</p>
                    <p style={styles.expDate}>{new Date(exp.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <p style={styles.expAmount}>₹{exp.amount}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', backgroundColor: '#0f0f0f', color: 'white' },
  navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', backgroundColor: '#1a1a1a', borderBottom: '1px solid #2a2a2a' },
  logo: { fontSize: '20px', fontWeight: 'bold', color: '#f5a623' },
  navRight: { display: 'flex', alignItems: 'center', gap: '16px' },
  welcome: { color: '#ccc', fontSize: '14px' },
  logoutBtn: { padding: '8px 18px', backgroundColor: 'transparent', color: 'white', border: '1px solid #444', borderRadius: '8px', cursor: 'pointer' },
  statsRow: { display: 'flex', gap: '16px', padding: '24px 32px', flexWrap: 'wrap' },
  statCard: { flex: 1, minWidth: '180px', backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '20px' },
  statLabel: { color: '#888', fontSize: '11px', letterSpacing: '1px', margin: '0 0 8px 0' },
  statValue: { color: '#f5a623', fontSize: '28px', fontWeight: 'bold', margin: 0 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '24px', padding: '0 32px 32px', flexWrap: 'wrap' },
  card: { backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '24px' },
  cardTitle: { color: 'white', fontSize: '18px', marginBottom: '20px', marginTop: 0 },
  inputGroup: { marginBottom: '16px' },
  label: { display: 'block', color: '#888', fontSize: '11px', letterSpacing: '1px', marginBottom: '6px' },
  input: { width: '100%', padding: '11px', backgroundColor: '#2a2a2a', border: '1px solid #333', borderRadius: '8px', color: 'white', fontSize: '14px', boxSizing: 'border-box' },
  addBtn: { width: '100%', padding: '13px', backgroundColor: '#f5a623', color: '#000', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', marginTop: '4px' },
  error: { backgroundColor: '#2d1a1a', color: '#ff6b6b', padding: '10px', borderRadius: '8px', marginBottom: '12px', fontSize: '13px' },
  successMsg: { backgroundColor: '#1a2d1a', color: '#4caf50', padding: '10px', borderRadius: '8px', marginBottom: '12px', fontSize: '13px' },
  filterRow: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' },
  filterBtn: { padding: '6px 14px', backgroundColor: '#2a2a2a', color: '#ccc', border: '1px solid #333', borderRadius: '20px', cursor: 'pointer', fontSize: '13px' },
  filterBtnActive: { backgroundColor: '#f5a623', color: '#000', border: '1px solid #f5a623', fontWeight: 'bold' },
  empty: { textAlign: 'center', padding: '40px 0' },
  expItem: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #2a2a2a' },
  expLeft: { display: 'flex', alignItems: 'center', gap: '12px' },
  badge: { padding: '4px 10px', borderRadius: '20px', color: 'white', fontSize: '11px', fontWeight: 'bold', whiteSpace: 'nowrap' },
  expTitle: { margin: 0, color: 'white', fontWeight: '600', fontSize: '14px' },
  expDate: { margin: 0, color: '#666', fontSize: '12px' },
  expAmount: { color: '#f5a623', fontWeight: 'bold', fontSize: '16px' }
};

export default Dashboard;