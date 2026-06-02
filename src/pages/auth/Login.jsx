import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../api/axiosInstance';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosInstance.post('/auth/login/', form);
      const { access, refresh } = res.data;
      const profileRes = await axiosInstance.get('/users/me/', {
        headers: { Authorization: `Bearer ${access}` },
      });
      login(profileRes.data, access, refresh);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch {
      toast.error('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1E1B4B 0%, #6C63FF 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: '20px',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '60px', height: '60px',
            background: 'linear-gradient(135deg, #6C63FF, #4B44CC)',
            borderRadius: '16px',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            fontSize: '28px',
          }}>💼</div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1E1B4B' }}>Welcome Back</h1>
          <p style={{ color: '#6B7280', marginTop: '4px', fontSize: '14px' }}>Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{
              display: 'block', fontSize: '13px',
              fontWeight: '600', color: '#1E1B4B', marginBottom: '6px',
            }}>Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })}
              required
              style={{
                width: '100%', padding: '12px 14px',
                border: '1.5px solid #E5E7EB',
                borderRadius: '10px', fontSize: '14px',
                background: '#F9FAFB', outline: 'none',
                transition: 'border 0.2s',
              }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{
              display: 'block', fontSize: '13px',
              fontWeight: '600', color: '#1E1B4B', marginBottom: '6px',
            }}>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
              style={{
                width: '100%', padding: '12px 14px',
                border: '1.5px solid #E5E7EB',
                borderRadius: '10px', fontSize: '14px',
                background: '#F9FAFB', outline: 'none',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '13px',
              background: loading ? '#9CA3AF' : 'linear-gradient(135deg, #6C63FF, #4B44CC)',
              color: '#fff', border: 'none',
              borderRadius: '10px', fontSize: '15px',
              fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '14px', color: '#6B7280' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#6C63FF', fontWeight: '600' }}>Register</Link>
        </p>
      </div>
    </div>
  );
}
