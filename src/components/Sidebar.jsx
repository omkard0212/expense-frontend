import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { label: 'Dashboard', icon: '📊', path: '/dashboard', roles: ['Admin', 'Manager', 'Employee'] },
  { label: 'My Expenses', icon: '🧾', path: '/expenses', roles: ['Admin', 'Manager', 'Employee'] },
  { label: 'Departments', icon: '🏢', path: '/departments', roles: ['Admin', 'Manager'] },
  { label: 'All Users', icon: '👥', path: '/users', roles: ['Admin'] },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const roleColors = {
    Admin: { bg: '#FEE2E2', color: '#991B1B' },
    Manager: { bg: '#DBEAFE', color: '#1E40AF' },
    Employee: { bg: '#DCFCE7', color: '#166534' },
  };
  const roleStyle = roleColors[user?.role] || {};

  return (
    <div style={{
      width: '250px', minHeight: '100vh',
      background: '#1E1B4B',
      display: 'flex', flexDirection: 'column',
      position: 'fixed', left: 0, top: 0,
      zIndex: 100,
    }}>
      <div style={{
        padding: '1.5rem',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px', height: '38px',
            background: 'linear-gradient(135deg, #6C63FF, #4B44CC)',
            borderRadius: '10px', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: '18px',
          }}>💼</div>
          <div>
            <p style={{ color: '#fff', fontWeight: '700', fontSize: '14px' }}>ExpenseTracker</p>
            <p style={{ color: '#9CA3AF', fontSize: '11px' }}>Business Suite</p>
          </div>
        </div>
      </div>

      <div style={{
        padding: '1rem 1.25rem',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px',
            background: '#6C63FF', borderRadius: '50%',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: '#fff',
            fontWeight: '700', fontSize: '14px',
          }}>
            {user?.first_name?.[0] || user?.username?.[0] || 'U'}
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <p style={{
              color: '#fff', fontSize: '13px',
              fontWeight: '600', whiteSpace: 'nowrap',
              overflow: 'hidden', textOverflow: 'ellipsis',
            }}>{user?.first_name} {user?.last_name}</p>
            <span style={{
              fontSize: '11px', fontWeight: '600',
              padding: '2px 8px', borderRadius: '20px',
              background: roleStyle.bg, color: roleStyle.color,
            }}>{user?.role}</span>
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: '1rem 0.75rem' }}>
        {navItems.filter(item => item.roles.includes(user?.role)).map(item => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex', alignItems: 'center',
                gap: '10px', padding: '10px 12px',
                borderRadius: '10px', marginBottom: '4px',
                background: isActive ? '#6C63FF' : 'transparent',
                color: isActive ? '#fff' : '#C7C4F0',
                fontSize: '14px', fontWeight: isActive ? '600' : '400',
                transition: 'all 0.2s',
              }}
            >
              <span style={{ fontSize: '16px' }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: '1rem 0.75rem' }}>
        <button
          onClick={logout}
          style={{
            width: '100%', padding: '10px 12px',
            background: 'rgba(239,68,68,0.15)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '10px', color: '#FCA5A5',
            fontSize: '14px', fontWeight: '600',
            cursor: 'pointer', display: 'flex',
            alignItems: 'center', gap: '8px',
          }}
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
}
