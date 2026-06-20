import { useUser } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'

interface TopBarProps {
  title?: string
}

export default function TopBar({ title }: TopBarProps) {
  const { user } = useUser()
  const navigate = useNavigate()

  return (
    <div style={{
      height: '64px',
      backgroundColor: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 40px',
    }}>
      <h1 style={{ fontSize: '18px', fontWeight: '600', color: '#1a1a1a' }}>
        {title || 'Dashboard'}
      </h1>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {/* Search */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          backgroundColor: '#f9fafb',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '8px 16px',
          width: '240px',
        }}>
          <span style={{ color: '#9ca3af' }}>🔍</span>
          <input
            placeholder="Search..."
            style={{
              border: 'none', background: 'transparent',
              outline: 'none', fontSize: '14px', color: '#374151', width: '100%'
            }}
          />
        </div>

        {/* Notification */}
        <button style={{
          width: '36px', height: '36px',
          borderRadius: '50%',
          border: '1px solid #e2e8f0',
          backgroundColor: 'white',
          cursor: 'pointer',
          fontSize: '16px',
        }}>🔔</button>

        {/* Avatar */}
        <div
          onClick={() => navigate('/settings')}
          style={{
            width: '36px', height: '36px',
            backgroundColor: '#4a7c59',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 'bold', cursor: 'pointer',
          }}
        >
          {user?.firstName?.[0] || user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase()}
        </div>
      </div>
    </div>
  )
}