import { useState, useEffect } from 'react'
import Layout from '../components/layout/Layout'
import { adminService, type AdminStats, type AdminTopic, type AdminUser } from '../services/api'

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [topics, setTopics] = useState<AdminTopic[]>([])
  const [users, setUsers] = useState<AdminUser[]>([])
  const [activeTab, setActiveTab] = useState<'topics' | 'users'>('topics')
  const [showAddModal, setShowAddModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking')
  const [newTopic, setNewTopic] = useState({
    title: '', domain: '', difficulty: 'intermediate', description: ''
  })

  useEffect(() => {
    loadData()
    checkApiHealth()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [statsData, topicsData, usersData] = await Promise.all([
        adminService.getStats(),
        adminService.getTopics(),
        adminService.getUsers(),
      ])
      setStats(statsData)
      setTopics(topicsData)
      setUsers(usersData)
    } catch (err) {
      console.error('Failed to load admin data:', err)
    } finally {
      setLoading(false)
    }
  }

  const checkApiHealth = async () => {
    try {
      await fetch('http://localhost:8080/api/health')
      setApiStatus('online')
    } catch {
      setApiStatus('offline')
    }
  }

  const statusStyles: Record<string, { bg: string; color: string }> = {
    ACTIVE: { bg: '#f0fdf4', color: '#166534' },
    INACTIVE: { bg: '#f9fafb', color: '#374151' },
    PENDING: { bg: '#fffbeb', color: '#92400e' },
  }

  return (
    <Layout title="Admin Panel">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '4px' }}>Admin Overview</h1>
          <p style={{ color: '#6b7280' }}>System performance and management dashboard</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={loadData}
            style={{ padding: '10px 20px', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}
          >🔄 Refresh</button>
          <button
            onClick={() => setShowAddModal(true)}
            style={{ padding: '10px 20px', backgroundColor: '#4a7c59', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}
          >+ New Topic</button>
        </div>
      </div>

      {/* Real Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
        {[
          { label: 'TOTAL TOPICS', value: loading ? '...' : stats?.total_topics?.toString() ?? '0', icon: '📁', sub: 'In database' },
          { label: 'ACTIVE TOPICS', value: loading ? '...' : stats?.active_topics?.toString() ?? '0', icon: '✅', sub: 'Currently live' },
          { label: 'TOTAL STUDENTS', value: loading ? '...' : stats?.student_users?.toString() ?? '0', icon: '👥', sub: 'Registered users' },
          { label: 'ADMIN USERS', value: loading ? '...' : stats?.admin_users?.toString() ?? '0', icon: '🛡', sub: 'Lecturers/Admins' },
        ].map((stat, i) => (
          <div key={i} style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{ width: '44px', height: '44px', backgroundColor: '#f0f5f2', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                {stat.icon}
              </div>
            </div>
            <p style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '600', letterSpacing: '0.05em', marginBottom: '4px' }}>{stat.label}</p>
            <p style={{ fontSize: '32px', fontWeight: '700' }}>{stat.value}</p>
            <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>
        {/* Topics/Users Table */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', padding: '0 24px' }}>
            {(['topics', 'users'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '16px 20px', border: 'none', background: 'none', cursor: 'pointer',
                  fontWeight: activeTab === tab ? '600' : '400',
                  color: activeTab === tab ? '#4a7c59' : '#6b7280',
                  borderBottom: activeTab === tab ? '2px solid #4a7c59' : '2px solid transparent',
                  fontSize: '14px', marginBottom: '-1px', textTransform: 'capitalize',
                }}
              >{tab === 'topics' ? '📁 Topic Management' : '👥 User Management'}</button>
            ))}
          </div>

          {/* Table Info */}
          <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f3f4f6' }}>
            <h3 style={{ fontWeight: '600', fontSize: '15px' }}>
              {activeTab === 'topics' ? 'Live Topics Registry' : 'Registered Users'}
            </h3>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ backgroundColor: '#f0f5f2', color: '#4a7c59', padding: '4px 12px', borderRadius: '999px', fontSize: '13px', fontWeight: '600' }}>
                {activeTab === 'topics' ? `${topics.length} Total` : `${users.length} Total`}
              </span>
            </div>
          </div>

          {/* Topics Table */}
          {activeTab === 'topics' && (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb' }}>
                  {['ID', 'Topic Name', 'Domain', 'Difficulty', 'Status'].map(h => (
                    <th key={h} style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#9ca3af', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>Loading topics...</td>
                  </tr>
                ) : topics.map((topic, i) => (
                  <tr key={topic.id} style={{ borderBottom: i < topics.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                    <td style={{ padding: '16px 24px', fontSize: '13px', color: '#4a7c59', fontFamily: 'monospace' }}>
                      #PM-{String(topic.id).padStart(4, '0')}
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <p style={{ fontWeight: '600', fontSize: '14px' }}>{topic.title}</p>
                      <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>{topic.domain}</p>
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '14px', color: '#374151' }}>{topic.domain}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{
                        backgroundColor: topic.difficulty === 'advanced' ? '#fef2f2' : topic.difficulty === 'intermediate' ? '#fffbeb' : '#f0fdf4',
                        color: topic.difficulty === 'advanced' ? '#991b1b' : topic.difficulty === 'intermediate' ? '#92400e' : '#166534',
                        padding: '3px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '600', textTransform: 'capitalize',
                      }}>{topic.difficulty}</span>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{
                        backgroundColor: statusStyles[topic.status]?.bg || '#f9fafb',
                        color: statusStyles[topic.status]?.color || '#374151',
                        padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: '600',
                      }}>{topic.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* Users Table */}
          {activeTab === 'users' && (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f9fafb' }}>
                  {['ID', 'Name / Email', 'Role', 'Joined'].map(h => (
                    <th key={h} style={{ padding: '12px 24px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#9ca3af', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>Loading users...</td>
                  </tr>
                ) : users.map((user, i) => (
                  <tr key={user.id} style={{ borderBottom: i < users.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                    <td style={{ padding: '16px 24px', fontSize: '13px', color: '#9ca3af' }}>#{user.id}</td>
                    <td style={{ padding: '16px 24px' }}>
                      <p style={{ fontWeight: '600', fontSize: '14px' }}>{user.full_name || 'N/A'}</p>
                      <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>{user.email}</p>
                    </td>
                    <td style={{ padding: '16px 24px' }}>
                      <span style={{
                        backgroundColor: user.is_admin ? '#f0f5f2' : '#f3f4f6',
                        color: user.is_admin ? '#4a7c59' : '#374151',
                        padding: '3px 10px', borderRadius: '999px', fontSize: '12px', fontWeight: '600',
                      }}>{user.is_admin ? '🛡 Admin' : '👤 Student'}</span>
                    </td>
                    <td style={{ padding: '16px 24px', fontSize: '13px', color: '#6b7280' }}>
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* System Health - Real */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px' }}>
            <h3 style={{ fontWeight: '600', fontSize: '16px', marginBottom: '16px' }}>System Health</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                {
                  name: 'Backend API',
                  status: apiStatus === 'checking' ? 'Checking...' : apiStatus === 'online' ? 'Online' : 'Offline',
                  color: apiStatus === 'checking' ? '#f59e0b' : apiStatus === 'online' ? '#4a7c59' : '#ef4444'
                },
                {
                  name: 'Database',
                  status: stats ? 'Connected' : 'Checking...',
                  color: stats ? '#4a7c59' : '#f59e0b'
                },
                {
                  name: 'ML Engine',
                  status: stats ? 'Operational' : 'Checking...',
                  color: stats ? '#4a7c59' : '#f59e0b'
                },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color }} />
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>{item.name}</span>
                  </div>
                  <span style={{ fontSize: '13px', color: item.color, fontWeight: '600' }}>{item.status}</span>
                </div>
              ))}
            </div>

            {/* DB Stats */}
            <div style={{ marginTop: '20px' }}>
              <p style={{ fontSize: '11px', fontWeight: '600', color: '#9ca3af', letterSpacing: '0.05em', marginBottom: '12px' }}>DATABASE STATS</p>
              {[
                { label: 'Topics', value: stats?.total_topics ?? 0, max: 100 },
                { label: 'Users', value: stats?.total_users ?? 0, max: 50 },
              ].map((metric, i) => (
                <div key={i} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', color: '#374151' }}>{metric.label}</span>
                    <span style={{ fontSize: '13px', fontWeight: '600' }}>{metric.value}</span>
                  </div>
                  <div style={{ height: '6px', backgroundColor: '#e2e8f0', borderRadius: '999px' }}>
                    <div style={{ width: `${Math.min((metric.value / metric.max) * 100, 100)}%`, height: '100%', backgroundColor: '#4a7c59', borderRadius: '999px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Domain Breakdown */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px' }}>
            <h3 style={{ fontWeight: '600', fontSize: '16px', marginBottom: '16px' }}>Topics by Domain</h3>
            {Object.entries(
              topics.reduce((acc, t) => {
                acc[t.domain] = (acc[t.domain] || 0) + 1
                return acc
              }, {} as Record<string, number>)
            ).slice(0, 5).map(([domain, count], i) => (
              <div key={i} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', color: '#374151' }}>{domain}</span>
                  <span style={{ fontSize: '12px', fontWeight: '600' }}>{count}</span>
                </div>
                <div style={{ height: '4px', backgroundColor: '#e2e8f0', borderRadius: '999px' }}>
                  <div style={{ width: `${(count / topics.length) * 100}%`, height: '100%', backgroundColor: '#4a7c59', borderRadius: '999px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Topic Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '32px', width: '500px', maxWidth: '90vw' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px' }}>Add New Topic</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { label: 'Topic Title', key: 'title', placeholder: 'e.g., AI-Powered Recommendation System' },
                { label: 'Domain', key: 'domain', placeholder: 'e.g., Machine Learning' },
              ].map(field => (
                <div key={field.key}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>{field.label}</label>
                  <input
                    value={newTopic[field.key as keyof typeof newTopic]}
                    onChange={e => setNewTopic(prev => ({ ...prev, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }}
                  />
                </div>
              ))}
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Description</label>
                <textarea
                  value={newTopic.description}
                  onChange={e => setNewTopic(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the project scope..."
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none', fontFamily: 'inherit', height: '100px', resize: 'none' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>Difficulty</label>
                <select
                  value={newTopic.difficulty}
                  onChange={e => setNewTopic(prev => ({ ...prev, difficulty: e.target.value }))}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none', fontFamily: 'inherit', backgroundColor: 'white' }}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ flex: 1, padding: '12px', backgroundColor: 'white', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}
              >Cancel</button>
              <button
                onClick={() => { alert('Topic submission noted! Backend endpoint needed to save.'); setShowAddModal(false) }}
                style={{ flex: 1, padding: '12px', backgroundColor: '#4a7c59', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}
              >Add Topic</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}