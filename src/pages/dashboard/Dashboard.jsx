import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../api/axiosInstance';
import StatCard from '../../components/StatCard';
import Badge from '../../components/Badge';
import { ROLES } from '../../utils/constants';

export default function Dashboard() {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const expRes = await axiosInstance.get('/expenses/');
        setExpenses(expRes.data);
        if (user?.role !== ROLES.EMPLOYEE) {
          const deptRes = await axiosInstance.get('/departments/');
          setDepartments(deptRes.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const total = expenses.length;
  const pending = expenses.filter(e => e.status === 'Pending').length;
  const approved = expenses.filter(e => e.status === 'Approved').length;
  const rejected = expenses.filter(e => e.status === 'Rejected').length;
  const totalAmount = expenses
    .filter(e => e.status === 'Approved')
    .reduce((sum, e) => sum + parseFloat(e.amount), 0);

  const recent = [...expenses]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 5);

  if (loading) return (
    <div style={{
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', height: '60vh',
    }}>
      <p style={{ color: '#6B7280', fontSize: '16px' }}>Loading dashboard...</p>
    </div>
  );

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1E1B4B' }}>
          👋 Welcome, {user?.first_name || user?.username}!
        </h1>
        <p style={{ color: '#6B7280', marginTop: '4px', fontSize: '14px' }}>
          Here is your expense overview for today
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem', marginBottom: '2rem',
      }}>
        <StatCard title="Total Expenses" value={total} icon="🧾" light="#EEF0FF" />
        <StatCard title="Pending" value={pending} icon="⏳" light="#FEF3C7" />
        <StatCard title="Approved" value={approved} icon="✅" light="#DCFCE7" />
        <StatCard title="Rejected" value={rejected} icon="❌" light="#FEE2E2" />
        <StatCard
          title="Total Approved Amount"
          value={`₹${totalAmount.toLocaleString('en-IN')}`}
          icon="💰"
          light="#DBEAFE"
        />
      </div>

      {user?.role !== ROLES.EMPLOYEE && departments.length > 0 && (
        <div style={{
          background: '#fff', borderRadius: '16px',
          padding: '1.5rem', marginBottom: '2rem',
          border: '1px solid #F3F4F6',
        }}>
          <h2 style={{
            fontSize: '16px', fontWeight: '700',
            color: '#1E1B4B', marginBottom: '1rem',
          }}>🏢 Department Budget Overview</h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
          }}>
            {departments.map(dept => (
              <div key={dept.id} style={{
                background: '#F5F6FA', borderRadius: '12px',
                padding: '1rem',
              }}>
                <p style={{
                  fontWeight: '600', fontSize: '14px',
                  color: '#1E1B4B', marginBottom: '4px',
                }}>{dept.name}</p>
                <p style={{ fontSize: '13px', color: '#6B7280' }}>
                  Budget: ₹{parseFloat(dept.budget_limit).toLocaleString('en-IN')}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{
        background: '#fff', borderRadius: '16px',
        padding: '1.5rem', border: '1px solid #F3F4F6',
      }}>
        <h2 style={{
          fontSize: '16px', fontWeight: '700',
          color: '#1E1B4B', marginBottom: '1rem',
        }}>🕐 Recent Expenses</h2>

        {recent.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '2rem',
            color: '#6B7280', fontSize: '14px',
          }}>
            No expenses found. Submit your first expense!
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #F3F4F6' }}>
                  {['Title', 'Amount', 'Category', 'Status', 'Date'].map(h => (
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
                {recent.map(exp => (
                  <tr key={exp.id} style={{
                    borderBottom: '1px solid #F9FAFB',
                    transition: 'background 0.15s',
                  }}>
                    <td style={{ padding: '12px', fontSize: '14px', fontWeight: '500', color: '#1E1B4B' }}>
                      {exp.title}
                    </td>
                    <td style={{ padding: '12px', fontSize: '14px', color: '#1E1B4B', fontWeight: '600' }}>
                      ₹{parseFloat(exp.amount).toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span style={{
                        background: '#EEF0FF', color: '#4B44CC',
                        padding: '3px 10px', borderRadius: '20px',
                        fontSize: '12px', fontWeight: '600',
                      }}>{exp.category}</span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <Badge status={exp.status} />
                    </td>
                    <td style={{ padding: '12px', fontSize: '13px', color: '#6B7280' }}>
                      {new Date(exp.created_at).toLocaleDateString('en-IN')}
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
