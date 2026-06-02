import { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import Badge from '../../components/Badge';
import { useAuth } from '../../context/AuthContext';
import { ROLES, EXPENSE_CATEGORIES } from '../../utils/constants';
import toast from 'react-hot-toast';

export default function Expenses() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({
    title: '', amount: '', category: 'Food',
    department: '', description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');

  const fetchExpenses = async () => {
    try {
      const params = filterStatus ? `?status=${filterStatus}` : '';
      const res = await axiosInstance.get(`/expenses/${params}`);
      setExpenses(res.data);
    } catch {
      toast.error('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await axiosInstance.get('/departments/');
      setDepartments(res.data);
      if (res.data.length > 0) {
        setForm(f => ({ ...f, department: res.data[0].id }));
      }
    } catch {}
  };

  useEffect(() => { fetchExpenses(); }, [filterStatus]);
  useEffect(() => { fetchDepartments(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axiosInstance.post('/expenses/', form);
      toast.success('Expense submitted successfully!');
      setShowForm(false);
      setForm({ title: '', amount: '', category: 'Food', department: departments[0]?.id || '', description: '' });
      fetchExpenses();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to submit expense');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axiosInstance.post(`/expenses/${id}/approve/`);
      toast.success('Expense approved!');
      fetchExpenses();
    } catch {
      toast.error('Failed to approve expense');
    }
  };

  const handleReject = async (id) => {
    try {
      await axiosInstance.post(`/expenses/${id}/reject/`);
      toast.success('Expense rejected');
      fetchExpenses();
    } catch {
      toast.error('Failed to reject expense');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    try {
      await axiosInstance.delete(`/expenses/${id}/`);
      toast.success('Expense deleted');
      fetchExpenses();
    } catch {
      toast.error('Cannot delete a reviewed expense');
    }
  };

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    border: '1.5px solid #E5E7EB', borderRadius: '10px',
    fontSize: '14px', background: '#F9FAFB', outline: 'none',
  };

  const labelStyle = {
    display: 'block', fontSize: '13px',
    fontWeight: '600', color: '#1E1B4B', marginBottom: '6px',
  };

  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: '1.5rem',
      }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1E1B4B' }}>🧾 Expenses</h1>
          <p style={{ color: '#6B7280', fontSize: '14px', marginTop: '4px' }}>Manage and track all expenses</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #6C63FF, #4B44CC)',
            color: '#fff', border: 'none', borderRadius: '10px',
            fontSize: '14px', fontWeight: '600', cursor: 'pointer',
          }}
        >
          {showForm ? '✕ Cancel' : '+ New Expense'}
        </button>
      </div>

      {showForm && (
        <div style={{
          background: '#fff', borderRadius: '16px',
          padding: '1.5rem', marginBottom: '1.5rem',
          border: '1px solid #F3F4F6',
        }}>
          <h2 style={{
            fontSize: '16px', fontWeight: '700',
            color: '#1E1B4B', marginBottom: '1.25rem',
          }}>Submit New Expense</h2>
          <form onSubmit={handleSubmit}>
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: '1rem', marginBottom: '1rem',
            }}>
              <div>
                <label style={labelStyle}>Title</label>
                <input
                  style={inputStyle} placeholder="e.g. Team Lunch" required
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div>
                <label style={labelStyle}>Amount (₹)</label>
                <input
                  style={inputStyle} type="number" placeholder="0.00" required
                  value={form.amount}
                  onChange={e => setForm({ ...form, amount: e.target.value })}
                />
              </div>
              <div>
                <label style={labelStyle}>Category</label>
                <select
                  style={inputStyle}
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                >
                  {EXPENSE_CATEGORIES.map(c => (<option key={c}>{c}</option>))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Department</label>
                <select
                  style={inputStyle} required
                  value={form.department}
                  onChange={e => setForm({ ...form, department: e.target.value })}
                >
                  {departments.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Description</label>
              <textarea
                style={{ ...inputStyle, height: '80px', resize: 'vertical' }}
                placeholder="Optional description..."
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <button
              type="submit" disabled={submitting}
              style={{
                padding: '11px 28px',
                background: submitting ? '#9CA3AF' : 'linear-gradient(135deg, #6C63FF, #4B44CC)',
                color: '#fff', border: 'none', borderRadius: '10px',
                fontSize: '14px', fontWeight: '600',
                cursor: submitting ? 'not-allowed' : 'pointer',
              }}
            >
              {submitting ? 'Submitting...' : 'Submit Expense'}
            </button>
          </form>
        </div>
      )}

      <div style={{
        background: '#fff', borderRadius: '16px',
        padding: '1.5rem', border: '1px solid #F3F4F6',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center',
          gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: '13px', fontWeight: '600', color: '#6B7280' }}>Filter:</span>
          {['', 'Pending', 'Approved', 'Rejected'].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              style={{
                padding: '6px 14px', borderRadius: '20px',
                border: '1.5px solid',
                borderColor: filterStatus === s ? '#6C63FF' : '#E5E7EB',
                background: filterStatus === s ? '#EEF0FF' : '#fff',
                color: filterStatus === s ? '#4B44CC' : '#6B7280',
                fontSize: '13px', fontWeight: '600', cursor: 'pointer',
              }}
            >
              {s || 'All'}
            </button>
          ))}
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#6B7280', padding: '2rem' }}>Loading expenses...</p>
        ) : expenses.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '3rem',
            color: '#6B7280', fontSize: '14px',
          }}>
            <div style={{ fontSize: '40px', marginBottom: '1rem' }}>🧾</div>
            No expenses found.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                  {['Title', 'Amount', 'Category', 'Department', 'Status', 'Date', 'Actions'].map(h => (
                    <th key={h} style={{
                      textAlign: 'left', padding: '10px 12px',
                      fontSize: '12px', fontWeight: '600',
                      color: '#6B7280', textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {expenses.map(exp => (
                  <tr key={exp.id} style={{ borderBottom: '1px solid #F9FAFB' }}>
                    <td style={{ padding: '12px', fontSize: '14px', fontWeight: '500', color: '#1E1B4B' }}>
                      {exp.title}
                    </td>
                    <td style={{ padding: '12px', fontSize: '14px', fontWeight: '600', color: '#1E1B4B' }}>
                      ₹{parseFloat(exp.amount).toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        background: '#EEF0FF', color: '#4B44CC',
                        padding: '3px 10px', borderRadius: '20px',
                        fontSize: '12px', fontWeight: '600',
                      }}>{exp.category}</span>
                    </td>
                    <td style={{ padding: '12px', fontSize: '13px', color: '#6B7280' }}>
                      {exp.department_detail?.name || '-'}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <Badge status={exp.status} />
                    </td>
                    <td style={{ padding: '12px', fontSize: '13px', color: '#6B7280' }}>
                      {new Date(exp.created_at).toLocaleDateString('en-IN')}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {(user?.role === ROLES.MANAGER || user?.role === ROLES.ADMIN) && exp.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(exp.id)}
                              style={{
                                padding: '5px 10px', background: '#DCFCE7',
                                color: '#166534', border: 'none',
                                borderRadius: '6px', fontSize: '12px',
                                fontWeight: '600', cursor: 'pointer',
                              }}
                            >✅ Approve</button>
                            <button
                              onClick={() => handleReject(exp.id)}
                              style={{
                                padding: '5px 10px', background: '#FEE2E2',
                                color: '#991B1B', border: 'none',
                                borderRadius: '6px', fontSize: '12px',
                                fontWeight: '600', cursor: 'pointer',
                              }}
                            >❌ Reject</button>
                          </>
                        )}
                        {(user?.role === ROLES.ADMIN || exp.submitted_by?.id === user?.id) && exp.status === 'Pending' && (
                          <button
                            onClick={() => handleDelete(exp.id)}
                            style={{
                              padding: '5px 10px', background: '#F3F4F6',
                              color: '#6B7280', border: 'none',
                              borderRadius: '6px', fontSize: '12px',
                              fontWeight: '600', cursor: 'pointer',
                            }}
                          >🗑 Delete</button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
