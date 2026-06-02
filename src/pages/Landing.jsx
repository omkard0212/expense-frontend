import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const roles = [
  {
    icon: '👑',
    title: 'Admin',
    color: '#6C63FF',
    light: '#EEF0FF',
    perms: ['Manage all users', 'Create departments', 'View all expenses', 'Delete anything'],
  },
  {
    icon: '🧑‍💼',
    title: 'Manager',
    color: '#3B82F6',
    light: '#DBEAFE',
    perms: ['Approve & reject expenses', 'View department expenses', 'Track department budget', 'Monitor team spending'],
  },
  {
    icon: '👷',
    title: 'Employee',
    color: '#22C55E',
    light: '#DCFCE7',
    perms: ['Submit expenses', 'View own expenses', 'Track approval status', 'Update own profile'],
  },
];

const features = [
  { icon: '🔐', label: 'JWT Auth', bg: '#EEF0FF', color: '#4B44CC' },
  { icon: '📊', label: 'Live Dashboard', bg: '#DBEAFE', color: '#1D4ED8' },
  { icon: '✅', label: 'Approval Flow', bg: '#DCFCE7', color: '#166534' },
  { icon: '🏢', label: 'Budget Tracking', bg: '#FEF3C7', color: '#92400E' },
  { icon: '🔍', label: 'Smart Filters', bg: '#FEE2E2', color: '#991B1B' },
  { icon: '📄', label: 'Paginated APIs', bg: '#F3E8FF', color: '#6B21A8' },
];

const timeline = [
  { num: 1, color: '#6C63FF', title: 'Register & Login', desc: 'Sign up with your role. JWT tokens keep you secure on every request.' },
  { num: 2, color: '#3B82F6', title: 'Submit an Expense', desc: 'Choose category, amount and department. Attach a description if needed.' },
  { num: 3, color: '#F59E0B', title: 'Manager Reviews', desc: 'Your manager sees the expense and approves or rejects it instantly.' },
  { num: 4, color: '#22C55E', title: 'Budget Updated', desc: 'Approved amounts are tracked against the department budget in real time.' },
];

export default function Landing() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [counts, setCounts] = useState({ tests: 0, endpoints: 0, roles: 0 });
  const [activeRole, setActiveRole] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const targets = { tests: 60, endpoints: 13, roles: 3 };
    let frame = 0;
    const total = 80;
    const id = setInterval(() => {
      frame++;
      setCounts({
        tests: Math.min(Math.round((targets.tests / total) * frame), targets.tests),
        endpoints: Math.min(Math.round((targets.endpoints / total) * frame), targets.endpoints),
        roles: Math.min(Math.round((targets.roles / total) * frame), targets.roles),
      });
      if (frame >= total) clearInterval(id);
    }, 20);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setActiveRole(r => (r + 1) % 3), 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#F5F6FA', color: '#1E1B4B' }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes slideRight {
          from { opacity: 0; transform: translateX(-20px); }
          to   { opacity: 1; transform: translateX(0);     }
        }
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.92); }
          to   { opacity: 1; transform: scale(1);    }
        }
        .fade-up   { animation: fadeUp    0.6s ease forwards; }
        .slide-r   { animation: slideRight 0.6s ease forwards; }
        .pop-in    { animation: popIn     0.5s ease forwards; }
        .feat-chip:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(108,99,255,0.12); }
        .cta-btn:hover   { opacity: 0.88; transform: translateY(-1px); }
        .outline-btn:hover { background: #EEF0FF !important; }
        .role-tab:hover  { border-color: #6C63FF !important; }
        .tl-card:hover   { box-shadow: 0 8px 32px rgba(108,99,255,0.1); transform: translateX(4px); }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 300,
        height: '64px',
        background: scrolled ? '#fff' : 'transparent',
        borderBottom: scrolled ? '1px solid #E5E7EB' : 'none',
        boxShadow: scrolled ? '0 2px 16px rgba(0,0,0,0.06)' : 'none',
        padding: '0 2.5rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'all 0.3s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
          <div style={{
            width: '32px', height: '32px',
            background: 'linear-gradient(135deg, #6C63FF, #4B44CC)',
            borderRadius: '9px', display: 'flex',
            alignItems: 'center', justifyContent: 'center', fontSize: '15px',
          }}>💼</div>
          <span style={{
            fontWeight: '700', fontSize: '15px',
            color: scrolled ? '#1E1B4B' : '#fff',
            transition: 'color 0.3s',
          }}>ExpenseTracker</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '7px 18px',
              background: scrolled ? 'transparent' : 'rgba(255,255,255,0.15)',
              border: scrolled ? '1.5px solid #E5E7EB' : '1.5px solid rgba(255,255,255,0.5)',
              borderRadius: '8px',
              color: scrolled ? '#1E1B4B' : '#fff',
              fontSize: '13px', fontWeight: '600',
              cursor: 'pointer', transition: 'all 0.3s',
            }}
          >Sign In</button>
          <button
            onClick={() => navigate('/register')}
            style={{
              padding: '7px 18px',
              background: scrolled
                ? 'linear-gradient(135deg, #6C63FF, #4B44CC)'
                : '#fff',
              border: 'none',
              borderRadius: '8px',
              color: scrolled ? '#fff' : '#1E1B4B',
              fontSize: '13px', fontWeight: '700',
              cursor: 'pointer', transition: 'all 0.3s',
            }}
          >Get Started</button>
        </div>
      </nav>

      {/* ── HERO — split layout ── */}
      <section style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1E1B4B 0%, #6C63FF 100%)',
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        alignItems: 'center', gap: '0',
        padding: '6rem 5rem 4rem',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* blobs */}
        <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '400px', height: '400px', background: 'rgba(255,255,255,0.04)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-60px', left: '30%', width: '300px', height: '300px', background: 'rgba(255,255,255,0.03)', borderRadius: '50%', pointerEvents: 'none' }} />

        {/* left copy */}
        <div className="slide-r" style={{ paddingRight: '3rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '7px',
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '20px', padding: '5px 14px', marginBottom: '1.5rem',
          }}>
            <span style={{ width: '6px', height: '6px', background: '#22C55E', borderRadius: '50%', display: 'inline-block' }} />
            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', fontWeight: '500' }}>Django REST + React · Live</span>
          </div>

          <h1 style={{
            fontSize: 'clamp(32px, 4vw, 54px)', fontWeight: '800',
            color: '#fff', lineHeight: '1.12', letterSpacing: '-1.5px',
            marginBottom: '1.25rem',
          }}>
            Smart Expense<br />
            <span style={{ color: '#A5B4FC' }}>Tracking</span> for<br />
            Modern Teams
          </h1>

          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '16px', lineHeight: '1.75', marginBottom: '2rem', maxWidth: '420px' }}>
            Submit, approve and track business expenses across departments — with real‑time budget alerts and role‑based access control.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => navigate('/register')}
              className="cta-btn"
              style={{
                padding: '13px 28px', background: '#fff',
                border: 'none', borderRadius: '10px',
                color: '#1E1B4B', fontSize: '15px', fontWeight: '700',
                cursor: 'pointer', transition: 'all 0.2s',
              }}
            >Get Started Free →</button>
            <button
              onClick={() => navigate('/login')}
              style={{
                padding: '13px 28px', background: 'transparent',
                border: '1.5px solid rgba(255,255,255,0.3)',
                borderRadius: '10px', color: '#fff',
                fontSize: '15px', fontWeight: '600',
                cursor: 'pointer',
              }}
            >Sign In</button>
          </div>
        </div>

        {/* right — animated role card */}
        <div className="pop-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* stat strip */}
          <div style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '16px', padding: '1.25rem 1.5rem',
            display: 'flex', justifyContent: 'space-around',
            marginBottom: '0.5rem',
          }}>
            {[
              { val: `${counts.tests}+`, label: 'Tests' },
              { val: counts.endpoints, label: 'Endpoints' },
              { val: counts.roles, label: 'Roles' },
              { val: '100%', label: 'REST' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '26px', fontWeight: '800', color: '#fff' }}>{s.val}</p>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* role tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
            {roles.map((r, i) => (
              <button
                key={r.title}
                className="role-tab"
                onClick={() => setActiveRole(i)}
                style={{
                  flex: 1, padding: '8px',
                  background: activeRole === i ? '#fff' : 'rgba(255,255,255,0.07)',
                  border: `1.5px solid ${activeRole === i ? '#fff' : 'rgba(255,255,255,0.15)'}`,
                  borderRadius: '10px', color: activeRole === i ? '#1E1B4B' : 'rgba(255,255,255,0.7)',
                  fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >{r.icon} {r.title}</button>
            ))}
          </div>

          {/* active role card */}
          <div style={{
            background: '#fff', borderRadius: '16px',
            padding: '1.5rem',
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
              <div style={{
                width: '44px', height: '44px',
                background: roles[activeRole].light,
                borderRadius: '12px', display: 'flex',
                alignItems: 'center', justifyContent: 'center', fontSize: '22px',
              }}>{roles[activeRole].icon}</div>
              <div>
                <p style={{ fontWeight: '700', fontSize: '16px', color: '#1E1B4B' }}>{roles[activeRole].title}</p>
                <p style={{ fontSize: '12px', color: '#6B7280' }}>Role permissions</p>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {roles[activeRole].perms.map(p => (
                <div key={p} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '20px', height: '20px', flexShrink: 0,
                    background: roles[activeRole].light,
                    borderRadius: '50%', display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    fontSize: '10px',
                  }}>✓</div>
                  <span style={{ fontSize: '13px', color: '#374151' }}>{p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── DIAGONAL DIVIDER ── */}
      <div style={{
        height: '70px', background: '#F5F6FA',
        clipPath: 'polygon(0 100%, 100% 0, 100% 100%)',
        marginTop: '-70px', position: 'relative', zIndex: 1,
      }} />

      {/* ── FEATURES CHIPS ── */}
      <section style={{ background: '#F5F6FA', padding: '4rem 2rem 5rem' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{
              background: '#EEF0FF', color: '#4B44CC',
              padding: '4px 14px', borderRadius: '20px',
              fontSize: '12px', fontWeight: '700', letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}>What's inside</span>
            <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#1E1B4B', marginTop: '12px', letterSpacing: '-0.5px' }}>
              Built for real business workflows
            </h2>
            <p style={{ color: '#6B7280', marginTop: '8px', fontSize: '15px' }}>
              Every feature your finance team actually needs
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
            {features.map(f => (
              <div
                key={f.label}
                className="feat-chip"
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  background: '#fff', border: '1.5px solid #F3F4F6',
                  borderRadius: '50px', padding: '10px 20px',
                  transition: 'all 0.25s', cursor: 'default',
                }}
              >
                <span style={{
                  width: '32px', height: '32px', background: f.bg,
                  borderRadius: '50%', display: 'flex',
                  alignItems: 'center', justifyContent: 'center', fontSize: '16px',
                }}>{f.icon}</span>
                <span style={{ fontSize: '14px', fontWeight: '600', color: f.color }}>{f.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE HOW IT WORKS ── */}
      <section style={{
        background: '#fff', padding: '5rem 2rem',
        borderTop: '1px solid #F3F4F6',
      }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{
              background: '#DCFCE7', color: '#166534',
              padding: '4px 14px', borderRadius: '20px',
              fontSize: '12px', fontWeight: '700', textTransform: 'uppercase',
            }}>How it works</span>
            <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#1E1B4B', marginTop: '12px', letterSpacing: '-0.5px' }}>
              From submit to approved in 4 steps
            </h2>
          </div>

          <div style={{ position: 'relative', paddingLeft: '2rem' }}>
            {/* vertical line */}
            <div style={{
              position: 'absolute', left: '19px', top: '24px',
              width: '2px', height: 'calc(100% - 48px)',
              background: 'linear-gradient(180deg, #6C63FF, #22C55E)',
              borderRadius: '2px',
            }} />

            {timeline.map((t, i) => (
              <div
                key={t.num}
                className="tl-card"
                style={{
                  display: 'flex', gap: '1.25rem',
                  marginBottom: i < timeline.length - 1 ? '1.75rem' : 0,
                  background: '#F9FAFB', borderRadius: '14px',
                  padding: '1.25rem 1.5rem',
                  border: '1.5px solid #F3F4F6',
                  position: 'relative', zIndex: 1,
                  transition: 'all 0.25s',
                }}
              >
                <div style={{
                  width: '40px', height: '40px', flexShrink: 0,
                  background: t.color, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: '800', fontSize: '15px',
                  boxShadow: `0 4px 14px ${t.color}44`,
                }}>{t.num}</div>
                <div>
                  <p style={{ fontWeight: '700', fontSize: '15px', color: '#1E1B4B', marginBottom: '4px' }}>{t.title}</p>
                  <p style={{ fontSize: '13px', color: '#6B7280', lineHeight: '1.65' }}>{t.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROLES SECTION ── */}
      <section style={{ background: '#F5F6FA', padding: '5rem 2rem', borderTop: '1px solid #F3F4F6' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{
              background: '#DBEAFE', color: '#1D4ED8',
              padding: '4px 14px', borderRadius: '20px',
              fontSize: '12px', fontWeight: '700', textTransform: 'uppercase',
            }}>Roles</span>
            <h2 style={{ fontSize: '32px', fontWeight: '800', color: '#1E1B4B', marginTop: '12px', letterSpacing: '-0.5px' }}>
              Three roles, one platform
            </h2>
            <p style={{ color: '#6B7280', marginTop: '8px', fontSize: '15px' }}>
              Everyone gets exactly the access they need — no more, no less
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
            {roles.map(r => (
              <div key={r.title} style={{
                background: '#fff', borderRadius: '16px',
                padding: '1.5rem', border: '1.5px solid #F3F4F6',
              }}>
                <div style={{
                  width: '48px', height: '48px',
                  background: r.light, borderRadius: '13px',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '22px',
                  marginBottom: '1rem',
                }}>{r.icon}</div>
                <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1E1B4B', marginBottom: '12px' }}>{r.title}</h3>
                {r.perms.map(p => (
                  <div key={p} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '7px' }}>
                    <span style={{
                      width: '18px', height: '18px', background: r.light,
                      borderRadius: '50%', display: 'flex', alignItems: 'center',
                      justifyContent: 'center', fontSize: '10px', color: r.color, flexShrink: 0,
                    }}>✓</span>
                    <span style={{ fontSize: '13px', color: '#374151' }}>{p}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{
        background: 'linear-gradient(135deg, #1E1B4B 0%, #6C63FF 100%)',
        padding: '5rem 2rem', textAlign: 'center',
      }}>
        <h2 style={{ fontSize: '36px', fontWeight: '800', color: '#fff', letterSpacing: '-0.5px', marginBottom: '1rem' }}>
          Ready to take control of expenses?
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '16px', marginBottom: '2rem' }}>
          Create your account in seconds and start managing smarter.
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/register')}
            className="cta-btn"
            style={{
              padding: '13px 32px', background: '#fff',
              border: 'none', borderRadius: '10px',
              color: '#1E1B4B', fontSize: '15px', fontWeight: '700',
              cursor: 'pointer', transition: 'all 0.2s',
            }}
          >Create Free Account →</button>
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '13px 32px', background: 'transparent',
              border: '1.5px solid rgba(255,255,255,0.3)',
              borderRadius: '10px', color: '#fff',
              fontSize: '15px', fontWeight: '600', cursor: 'pointer',
            }}
          >Sign In</button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{
        background: '#1E1B4B', padding: '1.5rem 2rem',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
      }}>
        <span style={{ fontSize: '15px' }}>💼</span>
        <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px' }}>
          ExpenseTracker — Built with Django REST Framework + React
        </span>
      </footer>
    </div>
  );
}
