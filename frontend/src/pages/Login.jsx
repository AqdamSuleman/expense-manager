import { useState } from 'react';
import API from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await API.post('/login', form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify({ name: data.name, email: data.email }));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logoRow}>
          <span style={styles.logo}>💰 ExpenseWise</span>
        </div>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Login to manage your expenses</p>
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>EMAIL</label>
            <input
              style={styles.input}
              type="email"
              name="email"
              placeholder="john@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>PASSWORD</label>
            <input
              style={styles.input}
              type="password"
              name="password"
              placeholder="Your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p style={styles.link}>
          Don't have an account? <Link to="/register" style={styles.linkA}>Register here</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0f0f0f' },
  card: { backgroundColor: '#1a1a1a', padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '420px', border: '1px solid #2a2a2a' },
  logoRow: { textAlign: 'center', marginBottom: '24px' },
  logo: { fontSize: '22px', fontWeight: 'bold', color: '#f5a623' },
  title: { color: 'white', textAlign: 'center', marginBottom: '8px', fontSize: '24px' },
  subtitle: { color: '#888', textAlign: 'center', marginBottom: '24px', fontSize: '14px' },
  inputGroup: { marginBottom: '16px' },
  label: { display: 'block', color: '#888', fontSize: '11px', letterSpacing: '1px', marginBottom: '6px' },
  input: { width: '100%', padding: '12px', backgroundColor: '#2a2a2a', border: '1px solid #333', borderRadius: '8px', color: 'white', fontSize: '14px', boxSizing: 'border-box' },
  button: { width: '100%', padding: '13px', backgroundColor: '#f5a623', color: '#000', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', marginTop: '8px' },
  error: { backgroundColor: '#2d1a1a', color: '#ff6b6b', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', textAlign: 'center' },
  link: { textAlign: 'center', marginTop: '20px', color: '#888', fontSize: '14px' },
  linkA: { color: '#f5a623', textDecoration: 'none' }
};

export default Login;