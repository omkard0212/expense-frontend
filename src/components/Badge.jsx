export default function Badge({ status }) {
  const styles = {
    Pending:  { bg: '#FEF3C7', color: '#92400E', label: '⏳ Pending' },
    Approved: { bg: '#DCFCE7', color: '#166534', label: '✅ Approved' },
    Rejected: { bg: '#FEE2E2', color: '#991B1B', label: '❌ Rejected' },
  };

  const s = styles[status] || { bg: '#F3F4F6', color: '#374151', label: status };

  return (
    <span style={{
      padding: '4px 10px', borderRadius: '20px',
      background: s.bg, color: s.color,
      fontSize: '12px', fontWeight: '600',
      whiteSpace: 'nowrap',
    }}>
      {s.label}
    </span>
  );
}
