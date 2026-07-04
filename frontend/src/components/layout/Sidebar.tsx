import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth, useUser } from '@clerk/clerk-react'
import { useRole } from '../../store/useRole'

const studentNavItems = [
  { label: 'Dashboard', path: '/dashboard', icon: '⊞' },
  { label: 'Recommendations', path: '/recommendations', icon: '✦' },
  { label: 'Project History', path: '/history', icon: '◷' },
  { label: 'Analytics', path: '/analytics', icon: '▣' },
  { label: 'Settings', path: '/settings', icon: '⚙' },
]

const adminNavItems = [
  { label: 'Admin Panel', path: '/admin', icon: '🛡' },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { signOut } = useAuth()
  const { user } = useUser()
  const { isAdmin } = useRole()

  const navItems = isAdmin ? adminNavItems : studentNavItems

  return (
    <div style={{
      width: '280px',
      minHeight: '100vh',
      backgroundColor: '#ffffff',
      borderRight: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      position: 'fixed',
      left: 0, top: 0, bottom: 0,
    }}>
      {/* Logo */}
      <div
        onClick={() => navigate(isAdmin ? '/admin' : '/dashboard')}
        style={{
          padding: '24px', borderBottom: '1px solid #e2e8f0',
          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
        }}
      >
        <div style={{
          width: '36px', height: '36px', backgroundColor: '#4a7c59',
          borderRadius: '8px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '16px',
        }}>P</div>
        <span style={{ fontSize: '20px', fontWeight: '700', color: '#4a7c59' }}>ProjectMatch</span>
      </div>

      {/* User Info */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px', height: '40px', backgroundColor: '#4a7c59',
            borderRadius: '50%', display: 'flex', alignItems: 'center',
            justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '16px',
          }}>
            {user?.firstName?.[0] || user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase()}
          </div>
          <div>
            <p style={{ fontWeight: '600', color: '#1a1a1a', fontSize: '14px' }}>
              {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.emailAddresses?.[0]?.emailAddress}
            </p>
            <p style={{ color: '#6b7280', fontSize: '12px' }}>
              {isAdmin ? '🛡 Admin · Lecturer' : 'Academic Portal 2024/25'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '16px 12px' }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center',
                gap: '12px', padding: '12px 16px', borderRadius: '8px',
                border: 'none', cursor: 'pointer',
                backgroundColor: isActive ? '#4a7c59' : 'transparent',
                color: isActive ? 'white' : '#374151',
                fontWeight: isActive ? '600' : '400',
                fontSize: '15px', marginBottom: '4px',
                textAlign: 'left', transition: 'all 0.15s',
              }}
            >
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              {item.label}
            </button>
          )
        })}
      </nav>

      {/* Sign Out */}
      <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0' }}>
        <button
          onClick={() => signOut()}
          style={{
            width: '100%', padding: '10px', backgroundColor: 'transparent',
            border: '1px solid #e2e8f0', borderRadius: '8px',
            cursor: 'pointer', color: '#6b7280', fontSize: '14px',
          }}
        >Sign Out</button>
      </div>
    </div>
  )
}