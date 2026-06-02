import { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { useAuth } from '../../context/AuthContext';
import { ROLES } from '../../utils/constants';
import toast from 'react-hot-toast';

export default function Departments() {
  const { user } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', budget_limit: '',
  });

  const fetchDepartments = async () => {
    try {
      const res = await axiosInstance.get('/departments/');
      setDepartments(res.data);
      res.data.forEach(dept => fetchBudget(dept.id));
    } catch {
      toast.error('Failed to load departments');
    } finally {
      setLoading(false);
    }
  };

  const fetchBudget = async (id) => {
    try {
      const res = await axiosInstance.get(`/departments/${id}/budget/`);
      setBudgets(prev => ({ ...prev, [id]: res.data }));
    } catch {}
  };

  useEffect(() => { fetchDepartments(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axiosInstance.post('/departments/', form);
      toast.success('Department created successfully!');
      setShowForm(false);
      setForm({ name: '', description: '', budget_limit: '' });
      fetchDepartments();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to create department');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this department?')) return;
    try {
      await axiosInstance.delete(`/departments/${id}/`);
      toast.success('Department deleted');
      fetchDepartments();
    } catch {
      toast.error('Failed to delete department');
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

  const getBudgetPercent = (id) => {
    const b = budgets[id];
    if (!b) return 0;
    const pct = (parseFloat(b.total_approved) / parseFloat(b.budget_limit)) * 100;
    return Math.min(pct, 100).toFixed(0);
  };

  const getBudgetColor = (pct) => {
    if (pct >= 90) return '#EF4444';
    if (pct >= 70) return '#F59E0B';
    return '#22C55E';
  };

  return (
    <div>
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: '1.5rem',
      }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1E1B4B' }}>
            🏢 Departments
          </h1>
          <p style={{ color: '#6B7280', fontSize: '14px', marginTop: '4px' }}>
            Manage departments and track budgets
          </p>
        </div>
        {user?.role === ROLES.ADMIN && (
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              padding: '10px 20px',
              background: 'linear-gradient(135deg, #6C63FF, #4B44CC)',
              color: '#fff', border: 'none', borderRadius: '10px',
              fontSize: '14px', fontWeight: '600', cursor: 'pointer',
            }}
          >
            {showForm ? '✕ Cancel' : '+ New Department'}
          </button>
        )}
      </div>

      {showForm && user?.role === ROLES.ADMIN && (
        <div style={{
          background: '#fff', borderRadius: '16px',
          padding: '1.5rem', marginBottom: '1.5rem',
          border: '1px solid #F3F4F6',
        }}>
          <h2 style={{
            fontSize: '16px', fontWeight: '700',
            color: '#1E1B4B', marginBottom: '1.25rem',
          }}>
            Create New Department
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr',
              gap: '1rem', marginBottom: '1rem',
            }}>
              <div>
                <label style={labelStyle}>Department Name</label>
                <input
                  style={inputStyle} placeholder="e.g. Engineering" required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <label style={labelStyle}>Budget Limit (₹)</label>
                <input
                  style={inputStyle} type="number" placeholder="e.g. 50000" required
                  value={form.budget_limit}
                  onChange={e => setForm({ ...form, budget_limit: e.target.value })}
                />
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
              {submitting ? 'Creating...' : 'Create Department'}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <p style={{ textAlign: 'center', color: '#6B7280', padding: '2rem' }}>
          Loading departments...
        </p>
      ) : departments.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '3rem',
          color: '#6B7280', fontSize: '14px',
          background: '#fff', borderRadius: '16px',
        }}>
          <div style={{ fontSize: '40px', marginBottom: '1rem' }}>🏢</div>
          No departments found.
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem',
        }}>
          {departments.map(dept => {
            const b = budgets[dept.id];
            const pct = getBudgetPercent(dept.id);
            const barColor = getBudgetColor(Number(pct));
            return (
              <div key={dept.id} style={{
                background: '#fff', borderRadius: '16px',
                padding: '1.5rem', border: '1px solid #F3F4F6',
              }}>
                <div style={{
                  display: 'flex', alignItems: 'flex-start',
                  justifyContent: 'space-between', marginBottom: '1rem',
                }}>
                  <div>
                    <h3 style={{
                      fontSize: '16px', fontWeight: '700',
                      color: '#1E1B4B', marginBottom: '4px',
                    }}>
                      {dept.name}
                    </h3>
                    <p style={{ fontSize: '13px', color: '#6B7280' }}>
                      {dept.description || 'No description'}
                    </p>
                  </div>
                  {user?.role === ROLES.ADMIN && (
                    <button
                      onClick={() => handleDelete(dept.id)}
                      style={{
                        background: '#FEE2E2', color: '#991B1B',
                        border: 'none', borderRadius: '8px',
                        padding: '6px 10px', fontSize: '12px',
                        fontWeight: '600', cursor: 'pointer',
                      }}
                    >
                      🗑 Delete
                    </button>
                  )}
                </div>

                <div style={{
                  background: '#F5F6FA', borderRadius: '12px',
                  padding: '1rem', marginBottom: '1rem',
                }}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between',
                    marginBottom: '8px',
                  }}>
                    <span style={{ fontSize: '12px', color: '#6B7280', fontWeight: '600' }}>
                      Budget Used
                    </span>
                    <span style={{ fontSize: '12px', fontWeight: '700', color: barColor }}>
                      {pct}%
                    </span>
                  </div>
                  <div style={{
                    background: '#E5E7EB', borderRadius: '20px',
                    height: '8px', overflow: 'hidden',
                  }}>
                    <div style={{
                      width: `${pct}%`, height: '100%',
                      background: barColor, borderRadius: '20px',
                      transition: 'width 0.5s ease',
                    }} />
                  </div>
                </div>

                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr',
                  gap: '0.75rem',
                }}>
                  <div style={{
                    background: '#EEF0FF', borderRadius: '10px',
                    padding: '0.75rem', textAlign: 'center',
                  }}>
                    <p style={{ fontSize: '11px', color: '#6B7280', marginBottom: '4px' }}>
                      Total Budget
                    </p>
                    <p style={{ fontSize: '15px', fontWeight: '700', color: '#4B44CC' }}>
                      ₹{b ? parseFloat(b.budget_limit).toLocaleString('en-IN') : '...'}
                    </p>
                  </div>
                  <div style={{
                    background: '#DCFCE7', borderRadius: '10px',
                    padding: '0.75rem', textAlign: 'center',
                  }}>
                    <p style={{ fontSize: '11px', color: '#6B7280', marginBottom: '4px' }}>
                      Remaining
                    </p>
                    <p style={{ fontSize: '15px', fontWeight: '700', color: '#166534' }}>
                      ₹{b ? parseFloat(b.remaining_budget).toLocaleString('en-IN') : '...'}
                    </p>
                  </div>
                </div>

                {Number(pct) >= 90 && (
                  <div style={{
                    marginTop: '1rem', background: '#FEE2E2',
                    borderRadius: '10px', padding: '0.75rem',
                    display: 'flex', alignItems: 'center', gap: '8px',
                  }}>
                    <span style={{ fontSize: '16px' }}>⚠️</span>
                    <p style={{ fontSize: '13px', color: '#991B1B', fontWeight: '600' }}>
                      Budget almost exhausted!
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
