import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../hooks/useApp';
import { useAuth } from '../hooks/useAuth';

const NAV_ITEMS = [
  {
    path: '/',
    label: 'Dashboard',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    path: '/habits',
    label: 'Habit Tracker',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
      </svg>
    ),
  },
  {
    path: '/recommendations',
    label: 'AI Recommendation',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
  {
    path: '/progress',
    label: 'My Progress',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    path: '/profile',
    label: 'My Profile',
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

export const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userProfile } = useApp();
  const { logout } = useAuth();

  const initials = userProfile?.fullName
    ? userProfile.fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U';

  const isActive = (path) =>
    path === '/'
      ? location.pathname === '/'
      : location.pathname.startsWith(path);

  return (
    <aside
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: '220px',
        background: '#FFFFFF',
        borderRight: '1px solid #F0F0F0',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100,
        overflowY: 'auto',
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: '20px 18px 16px',
          borderBottom: '1px solid #F0F0F0',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <img
            src="/favicon.svg"
            alt="Logo"
            style={{ width: 35, height: 35 }}
          />
        </div>
        <div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: '#1A1A1A',
              lineHeight: 1.2,
            }}
          >
            HealthPlan
          </div>
          <div style={{ fontSize: 10, color: '#9CA3AF', marginTop: 1 }}>
            DBS Foundation
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ padding: '12px 10px', flex: 1 }}>
        {NAV_ITEMS.map(({ path, label, icon }) => {
          const active = isActive(path);
          return (
            <Link
              key={path}
              to={path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 12px',
                borderRadius: 9,
                fontSize: 13,
                fontWeight: active ? 500 : 400,
                color: active ? '#C2410C' : '#6B7280',
                background: active ? '#FFF7ED' : 'transparent',
                textDecoration: 'none',
                marginBottom: 2,
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background = '#F9FAFB';
                  e.currentTarget.style.color = '#374151';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#6B7280';
                }
              }}
            >
              <span
                style={{
                  color: active ? '#F97316' : 'currentColor',
                  flexShrink: 0,
                }}
              >
                {icon}
              </span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div
        style={{ padding: '12px 14px 16px', borderTop: '1px solid #F0F0F0' }}
      >
        <div
          onClick={() => navigate('/profile')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 10,
            cursor: 'pointer',
            padding: '6px 4px',
            borderRadius: 8,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#F9FAFB')}
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = 'transparent')
          }
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#F97316',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 11,
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            {initials}
          </div>
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 500,
                color: '#1A1A1A',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {userProfile?.fullName || 'User'}
            </div>
            <div style={{ fontSize: 10, color: '#9CA3AF' }}>
              {userProfile?.bmiCategory || 'BMI Normal'}
            </div>
          </div>
        </div>
        <button
          onClick={logout}
          style={{
            width: '100%',
            padding: '7px 12px',
            background: '#FEF2F2',
            color: '#DC2626',
            border: '1px solid #FECACA',
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#FEE2E2')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#FEF2F2')}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Logout
        </button>
      </div>
    </aside>
  );
};
