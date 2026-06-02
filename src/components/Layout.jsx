import Sidebar from './Sidebar';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function Layout({ children }) {
  const { user, loading } = useAuth();

  if (loading) return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: '#F5F6FA',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: '1rem' }}>💼</div>
        <p style={{ color: '#6B7280', fontSize: '14px' }}>Loading...</p>
      </div>
    </div>
  );

  if (!user) return <Navigate to="/login" />;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F6FA' }}>
      <Sidebar />
      <main style={{
        marginLeft: '250px', flex: 1,
        padding: '2rem', minHeight: '100vh',
      }}>
        {children}
      </main>
    </div>
  );
}
