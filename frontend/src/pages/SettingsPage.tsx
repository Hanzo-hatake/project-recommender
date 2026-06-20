import { useUser, useAuth } from '@clerk/clerk-react'
import Layout from '../components/layout/Layout'

export default function SettingsPage() {
  const { user } = useUser()
  const { signOut } = useAuth()

  return (
    <Layout title="Settings">
      <div style={{ maxWidth: '600px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '8px' }}>Profile & Settings</h1>
        <p style={{ color: '#6b7280', marginBottom: '32px' }}>Manage your account and preferences</p>

        {/* Profile Card */}
        <div style={{
          backgroundColor: 'white', borderRadius: '12px',
          border: '1px solid #e2e8f0', padding: '32px', marginBottom: '24px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
            <div style={{
              width: '72px', height: '72px',
              backgroundColor: '#4a7c59', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontSize: '28px', fontWeight: '700',
            }}>
              {user?.firstName?.[0] || user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase()}
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '700' }}>
                {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Student'}
              </h2>
              <p style={{ color: '#6b7280' }}>{user?.emailAddresses?.[0]?.emailAddress}</p>
              <span style={{
                backgroundColor: '#f0f5f2', color: '#4a7c59',
                padding: '2px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '600'
              }}>Academic Portal 2024/25</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[
              { label: 'First Name', value: user?.firstName || '-' },
              { label: 'Last Name', value: user?.lastName || '-' },
              { label: 'Email', value: user?.emailAddresses?.[0]?.emailAddress || '-' },
              { label: 'Member Since', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-' },
            ].map((field, i) => (
              <div key={i}>
                <p style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '600', marginBottom: '4px' }}>{field.label}</p>
                <p style={{ fontSize: '15px', fontWeight: '500' }}>{field.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sign Out */}
        <button
          onClick={() => signOut()}
          style={{
            width: '100%', padding: '14px',
            backgroundColor: '#fef2f2', color: '#ef4444',
            border: '1px solid #fecaca', borderRadius: '8px',
            fontWeight: '600', cursor: 'pointer', fontSize: '15px',
          }}
        >Sign Out</button>
      </div>
    </Layout>
  )
}