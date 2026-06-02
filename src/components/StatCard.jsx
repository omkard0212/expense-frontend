export default function StatCard({ title, value, icon, color, light }) {
  return (
    <div style={{
      background: '#fff', borderRadius: '16px',
      padding: '1.25rem 1.5rem',
      border: '1px solid #F3F4F6',
      display: 'flex', alignItems: 'center', gap: '1rem',
    }}>
      <div style={{
        width: '52px', height: '52px',
        background: light, borderRadius: '14px',
        display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: '24px',
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '4px' }}>{title}</p>
        <p style={{ fontSize: '22px', fontWeight: '700', color: '#1E1B4B' }}>{value}</p>
      </div>
    </div>
  );
}
