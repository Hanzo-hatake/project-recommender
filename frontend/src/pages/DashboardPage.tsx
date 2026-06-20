import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import Layout from '../components/layout/Layout'

const recentActivity = [
  { icon: '✓', title: 'Topic Approved', desc: '"Predictive Analytics for Urban Traffic" has been vetted for your selection pool.', time: '2h ago', color: '#4a7c59' },
  { icon: '👥', title: 'New Potential Match', desc: 'A new project that matches 95% of your skill profile is available.', time: '5h ago', color: '#4a7c59' },
  { icon: 'ℹ', title: 'System Update', desc: 'The matching algorithm was updated to version 2.4 for better precision.', time: 'Yesterday', color: '#9ca3af' },
]

const deadlines = [
  { label: 'Topic Selection', date: 'October 24, 2025' },
  { label: 'Supervisor Meeting', date: 'November 02, 2025' },
  { label: 'Draft Proposal', date: 'November 15, 2025' },
]

export default function DashboardPage() {
  const navigate = useNavigate()
  const { user } = useUser()
  const name = user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'Student'

  return (
    <Layout title="Dashboard">
      {/* Alert Banner */}
      <div style={{
        backgroundColor: '#fef2f2',
        border: '1px solid #fecaca',
        borderRadius: '12px',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '32px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px', height: '40px',
            backgroundColor: '#ef4444',
            borderRadius: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '20px'
          }}>⚠</div>
          <div>
            <p style={{ fontWeight: '600', color: '#991b1b', fontSize: '16px' }}>Unselected Project Topic</p>
            <p style={{ color: '#dc2626', fontSize: '14px' }}>The deadline for topic selection is approaching. Your current selection is empty.</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/recommendations')}
          style={{
            backgroundColor: 'white',
            border: '2px solid #ef4444',
            borderRadius: '8px',
            padding: '10px 20px',
            color: '#ef4444',
            fontWeight: '600',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >Select Topic Now</button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
        {[
          { label: 'PROFILE STATUS', value: '85%', sub: 'Ready to Match', progress: 85 },
          { label: 'RECOMMENDATION POOL', value: '148', sub: 'Curated based on your interests', badge: '12 New' },
          { label: 'SAVED TOPICS', value: '06', sub: '2 marked as high priority' },
        ].map((stat, i) => (
          <div key={i} style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '24px',
          }}>
            <p style={{ fontSize: '11px', fontWeight: '600', color: '#9ca3af', letterSpacing: '0.05em', marginBottom: '8px' }}>
              {stat.label}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p style={{ fontSize: '36px', fontWeight: '700', color: '#1a1a1a' }}>{stat.value}</p>
              {stat.badge && (
                <span style={{
                  backgroundColor: '#fef3c7', color: '#92400e',
                  padding: '4px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '600'
                }}>{stat.badge}</span>
              )}
            </div>
            <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>{stat.sub}</p>
            {stat.progress && (
              <div style={{ marginTop: '12px', height: '6px', backgroundColor: '#e2e8f0', borderRadius: '999px' }}>
                <div style={{ width: `${stat.progress}%`, height: '100%', backgroundColor: '#4a7c59', borderRadius: '999px' }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px' }}>
        {/* Recent Activity */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          padding: '24px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Recent Activity</h2>
            <button style={{ color: '#4a7c59', fontWeight: '600', fontSize: '14px', border: 'none', background: 'none', cursor: 'pointer' }}>
              View All
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {recentActivity.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '40px', height: '40px', minWidth: '40px',
                  backgroundColor: '#f0f5f2',
                  borderRadius: '8px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '16px',
                }}>
                  {item.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <p style={{ fontWeight: '600', fontSize: '14px' }}>{item.title}</p>
                    <p style={{ fontSize: '12px', color: '#9ca3af' }}>{item.time}</p>
                  </div>
                  <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Upcoming Deadlines */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #e2e8f0',
            padding: '24px',
          }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '16px' }}>📅 Upcoming Deadlines</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {deadlines.map((d, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div style={{ width: '3px', height: '40px', backgroundColor: '#4a7c59', borderRadius: '2px' }} />
                  <div>
                    <p style={{ fontWeight: '600', fontSize: '14px' }}>{d.label}</p>
                    <p style={{ fontSize: '12px', color: '#9ca3af' }}>{d.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Need Help */}
          <div style={{
            backgroundColor: '#4a7c59',
            borderRadius: '12px',
            padding: '24px',
            color: 'white',
          }}>
            <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Need Help?</h2>
            <p style={{ fontSize: '13px', opacity: 0.85, marginBottom: '16px' }}>
              Contact your Department Head if you're having trouble finding a supervisor.
            </p>
            <button style={{
              width: '100%',
              padding: '10px',
              backgroundColor: 'rgba(255,255,255,0.15)',
              border: '1px solid rgba(255,255,255,0.3)',
              borderRadius: '8px',
              color: 'white',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '14px',
            }}>
              Contact Department
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}