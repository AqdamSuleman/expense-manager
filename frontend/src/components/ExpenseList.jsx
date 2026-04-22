function ExpenseList({ expenses, filter }) {
  const categoryColors = {
    Food: '#f97316',
    Travel: '#3b82f6',
    Bills: '#ef4444',
    Shopping: '#a855f7',
    Health: '#22c55e',
    Other: '#6b7280'
  };

  const filtered = filter === 'All'
    ? expenses
    : expenses.filter(e => e.category === filter);

  const total = filtered.reduce((sum, e) => sum + e.amount, 0);

  if (filtered.length === 0) {
    return (
      <div style={styles.card}>
        <p style={{ textAlign: 'center', color: '#888' }}>No expenses found.</p>
      </div>
    );
  }

  return (
    <div style={styles.card}>
      <div style={styles.totalBar}>
        <span>Total Expenses</span>
        <span style={styles.totalAmount}>₹{total.toFixed(2)}</span>
      </div>
      {filtered.map((expense) => (
        <div key={expense._id} style={styles.item}>
          <div style={styles.left}>
            <span
              style={{ ...styles.badge, backgroundColor: categoryColors[expense.category] || '#6b7280' }}
            >
              {expense.category}
            </span>
            <div>
              <p style={styles.expTitle}>{expense.title}</p>
              <p style={styles.date}>{new Date(expense.date).toLocaleDateString()}</p>
            </div>
          </div>
          <p style={styles.amount}>₹{expense.amount}</p>
        </div>
      ))}
    </div>
  );
}

const styles = {
  card: { backgroundColor: 'white', padding: '24px', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' },
  totalBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', paddingBottom: '12px', borderBottom: '2px solid #f0f0f0', fontSize: '16px', fontWeight: 'bold', color: '#333' },
  totalAmount: { color: '#4f46e5', fontSize: '20px' },
  item: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f5f5f5' },
  left: { display: 'flex', alignItems: 'center', gap: '12px' },
  badge: { padding: '4px 10px', borderRadius: '20px', color: 'white', fontSize: '12px', fontWeight: 'bold' },
  expTitle: { margin: 0, fontWeight: '600', color: '#333' },
  date: { margin: 0, fontSize: '12px', color: '#888' },
  amount: { fontWeight: 'bold', color: '#333', fontSize: '16px' }
};

export default ExpenseList;