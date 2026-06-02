import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({
    username: '', email: '', password: '',
    first_name: '', last_name: '',
    role: 'Employee', phone: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.post('/auth/register/', form);
      toast.success('Account created! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.username?.[0] || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '11px 14px',
    border: '1.5px solid #E5E7EB',
    borderRadius: '10px', fontSize: '14px',
    background: '#F9FAFB', outline: 'none',
  };

  const labelStyle = {
    display: 'block', fontSize: '13px',
    fontWeight: '600', color: '#1E1B4B', marginBottom: '6px',
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1E1B4B 0%, #6C63FF 100%)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '1rem',
    }}>
      <div style={{
        background: '#fff', borderRadius: '20px',
        padding: '2.5rem', width: '100%', maxWidth: '480px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.2)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '60px', height: '60px',
            background: 'linear-gradient(135deg, #6C63FF, #4B44CC)',
            borderRadius: '16px', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 1rem', fontSize: '28px',
          }}>✨</div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1E1B4B' }}>Create Account</h1>
          <p style={{ color: '#6B7280', marginTop: '4px', fontSize: '14px' }}>Join the expense tracker</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={labelStyle}>First Name</label>
              <input style={inputStyle} placeholder="John"
                value={form.first_name}
                onChange={e => setForm({ ...form, first_name: e.target.value })} />
            </div>
            <div>
              <label style={labelStyle}>Last Name</label>
              <input style={inputStyle} placeholder="Doe"
                value={form.last_name}
                onChange={e => setForm({ ...form, last_name: e.target.value })} />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Username</label>
            <input style={inputStyle} placeholder="johndoe" required
              value={form.username}
              onChange={e => setForm({ ...form, username: e.target.value })} />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Email</label>
            <input style={inputStyle} type="email" placeholder="john@company.com"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })} />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Password</label>
            <input style={inputStyle} type="password" placeholder="Create a password" required
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <label style={labelStyle}>Role</label>
              <select style={inputStyle}
                value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value })}>
                <option>Employee</option>
                <option>Manager</option>
                <option>Admin</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Phone</label>
              <input style={inputStyle} placeholder="9999999999"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '13px',
            background: loading ? '#9CA3AF' : 'linear-gradient(135deg, #6C63FF, #4B44CC)',
            color: '#fff', border: 'none', borderRadius: '10px',
            fontSize: '15px', fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '14px', color: '#6B7280' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#6C63FF', fontWeight: '600' }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
