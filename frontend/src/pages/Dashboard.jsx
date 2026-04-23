import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

function Dashboard() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({
    itemName: '',
    description: '',
    type: 'Lost',
    location: '',
    date: new Date().toISOString().split('T')[0],
    contactInfo: ''
  });

  const user = JSON.parse(localStorage.getItem('user'));

  const fetchItems = async () => {
    try {
      const { data } = await API.get('/items');
      setItems(data);
    } catch (err) {
      console.error('Failed to fetch items');
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    } else {
      fetchItems();
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
      if (editItem) {
        await API.put(`/items/${editItem._id}`, form);
        setSuccess('Item updated successfully!');
        setEditItem(null);
      } else {
        await API.post('/items', form);
        setSuccess('Item reported successfully!');
      }
      setForm({
        itemName: '',
        description: '',
        type: 'Lost',
        location: '',
        date: new Date().toISOString().split('T')[0],
        contactInfo: ''
      });
      fetchItems();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save item');
    }
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setForm({
      itemName: item.itemName,
      description: item.description,
      type: item.type,
      location: item.location,
      date: new Date(item.date).toISOString().split('T')[0],
      contactInfo: item.contactInfo
    });
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await API.delete(`/items/${id}`);
      setSuccess('Item deleted!');
      fetchItems();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete item');
    }
  };

  const handleSearch = async (e) => {
    setSearch(e.target.value);
    if (e.target.value === '') {
      fetchItems();
      return;
    }
    try {
      const { data } = await API.get(`/items/search?name=${e.target.value}`);
      setItems(data);
    } catch (err) {
      console.error('Search failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleCancelEdit = () => {
    setEditItem(null);
    setForm({
      itemName: '',
      description: '',
      type: 'Lost',
      location: '',
      date: new Date().toISOString().split('T')[0],
      contactInfo: ''
    });
  };

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <span style={styles.logo}>🔍 Lost & Found</span>
        <div style={styles.navRight}>
          <span style={styles.welcome}>Hello, <strong>{user?.name}</strong></span>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Stats */}
      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>TOTAL ITEMS</p>
          <p style={styles.statValue}>{items.length}</p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>LOST ITEMS</p>
          <p style={{ ...styles.statValue, color: '#ef4444' }}>
            {items.filter(i => i.type === 'Lost').length}
          </p>
        </div>
        <div style={styles.statCard}>
          <p style={styles.statLabel}>FOUND ITEMS</p>
          <p style={{ ...styles.statValue, color: '#22c55e' }}>
            {items.filter(i => i.type === 'Found').length}
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div style={styles.grid}>

        {/* Left - Add/Edit Form */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>
            {editItem ? '✏️ Edit Item' : '➕ Report Item'}
          </h3>
          {error && <div style={styles.error}>{error}</div>}
          {success && <div style={styles.successMsg}>{success}</div>}
          <form onSubmit={handleSubmit}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>ITEM NAME</label>
              <input style={styles.input} type="text" name="itemName" placeholder="e.g. Blue Backpack" value={form.itemName} onChange={handleChange} required />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>DESCRIPTION</label>
              <textarea style={{ ...styles.input, height: '80px', resize: 'vertical' }} name="description" placeholder="Describe the item..." value={form.description} onChange={handleChange} required />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>TYPE</label>
              <select style={styles.input} name="type" value={form.type} onChange={handleChange}>
                <option>Lost</option>
                <option>Found</option>
              </select>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>LOCATION</label>
              <input style={styles.input} type="text" name="location" placeholder="e.g. Library, Block A" value={form.location} onChange={handleChange} required />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>DATE</label>
              <input style={styles.input} type="date" name="date" value={form.date} onChange={handleChange} required />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>CONTACT INFO</label>
              <input style={styles.input} type="text" name="contactInfo" placeholder="e.g. 9876543210" value={form.contactInfo} onChange={handleChange} required />
            </div>
            <button style={styles.addBtn} type="submit">
              {editItem ? 'Update Item' : '+ Report Item'}
            </button>
            {editItem && (
              <button style={styles.cancelBtn} type="button" onClick={handleCancelEdit}>
                Cancel
              </button>
            )}
          </form>
        </div>

        {/* Right - Items List */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>📋 All Reported Items</h3>

          {/* Search Bar */}
          <div style={styles.inputGroup}>
            <input
              style={{ ...styles.input, marginBottom: '16px' }}
              type="text"
              placeholder="🔍 Search by item name..."
              value={search}
              onChange={handleSearch}
            />
          </div>

          {/* Items List */}
          {items.length === 0 ? (
            <div style={styles.empty}>
              <p style={{ fontSize: '40px' }}>📭</p>
              <p style={{ color: '#888' }}>No items reported yet.</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item._id} style={styles.itemCard}>
                <div style={styles.itemHeader}>
                  <span style={{
                    ...styles.badge,
                    backgroundColor: item.type === 'Lost' ? '#ef4444' : '#22c55e'
                  }}>
                    {item.type}
                  </span>
                  <div style={styles.itemActions}>
                    <button style={styles.editBtn} onClick={() => handleEdit(item)}>✏️ Edit</button>
                    <button style={styles.deleteBtn} onClick={() => handleDelete(item._id)}>🗑️ Delete</button>
                  </div>
                </div>
                <p style={styles.itemName}>{item.itemName}</p>
                <p style={styles.itemDesc}>{item.description}</p>
                <div style={styles.itemMeta}>
                  <span>📍 {item.location}</span>
                  <span>📅 {new Date(item.date).toLocaleDateString()}</span>
                  <span>📞 {item.contactInfo}</span>
                </div>
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
  statCard: { flex: 1, minWidth: '150px', backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '20px' },
  statLabel: { color: '#888', fontSize: '11px', letterSpacing: '1px', margin: '0 0 8px 0' },
  statValue: { color: '#f5a623', fontSize: '28px', fontWeight: 'bold', margin: 0 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '24px', padding: '0 32px 32px' },
  card: { backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', padding: '24px' },
  cardTitle: { color: 'white', fontSize: '18px', marginBottom: '20px', marginTop: 0 },
  inputGroup: { marginBottom: '14px' },
  label: { display: 'block', color: '#888', fontSize: '11px', letterSpacing: '1px', marginBottom: '6px' },
  input: { width: '100%', padding: '11px', backgroundColor: '#2a2a2a', border: '1px solid #333', borderRadius: '8px', color: 'white', fontSize: '14px', boxSizing: 'border-box' },
  addBtn: { width: '100%', padding: '13px', backgroundColor: '#f5a623', color: '#000', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', marginTop: '4px' },
  cancelBtn: { width: '100%', padding: '13px', backgroundColor: 'transparent', color: '#888', border: '1px solid #444', borderRadius: '8px', fontSize: '15px', cursor: 'pointer', marginTop: '8px' },
  error: { backgroundColor: '#2d1a1a', color: '#ff6b6b', padding: '10px', borderRadius: '8px', marginBottom: '12px', fontSize: '13px' },
  successMsg: { backgroundColor: '#1a2d1a', color: '#4caf50', padding: '10px', borderRadius: '8px', marginBottom: '12px', fontSize: '13px' },
  empty: { textAlign: 'center', padding: '40px 0' },
  itemCard: { backgroundColor: '#2a2a2a', borderRadius: '10px', padding: '16px', marginBottom: '12px' },
  itemHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' },
  itemActions: { display: 'flex', gap: '8px' },
  badge: { padding: '4px 12px', borderRadius: '20px', color: 'white', fontSize: '12px', fontWeight: 'bold' },
  itemName: { color: 'white', fontWeight: 'bold', fontSize: '16px', margin: '0 0 4px 0' },
  itemDesc: { color: '#aaa', fontSize: '13px', margin: '0 0 10px 0' },
  itemMeta: { display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '12px', color: '#888' },
  editBtn: { padding: '6px 12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' },
  deleteBtn: { padding: '6px 12px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }
};

export default Dashboard;