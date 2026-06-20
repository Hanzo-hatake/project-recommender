import { useState } from 'react'
import Layout from '../components/layout/Layout'

interface Topic {
  id: string
  title: string
  department: string
  difficulty: string
  status: 'ACTIVE' | 'PENDING' | 'ARCHIVED'
  domain: string
}

const mockTopics: Topic[] = [
  { id: '#PM-1024', title: 'Neural Network Optimization for Edge Devices', department: 'Computer Science', difficulty: 'advanced', status: 'ACTIVE', domain: 'Machine Learning' },
  { id: '#PM-1025', title: 'Sustainable Smart-Grid Architecture', department: 'Electrical Engineering', difficulty: 'intermediate', status: 'PENDING', domain: 'Cloud & DevOps' },
  { id: '#PM-1026', title: 'Biometric Authentication System', department: 'Cybersecurity', difficulty: 'intermediate', status: 'ACTIVE', domain: 'Backend Development' },
  { id: '#PM-1027', title: 'Real-time Collaborative Editor', department: 'Computer Science', difficulty: 'advanced', status: 'ACTIVE', domain: 'Full Stack Development' },
  { id: '#PM-1028', title: 'E-Learning Platform with AI Tutor', department: 'Computer Science', difficulty: 'intermediate', status: 'PENDING', domain: 'Machine Learning' },
]

const statusStyles: Record<string, { bg: string; color: string }> = {
  ACTIVE: { bg: '#f0fdf4', color: '#166534' },
  PENDING: { bg: '#fffbeb', color: '#92400e' },
  ARCHIVED: { bg: '#f9fafb', color: '#374151' },
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'topics' | 'engagement'>('topics')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newTopic, setNewTopic] = useState({ title: '', domain: '', difficulty: 'intermediate', description: '' })

  return (
    <Layout title="Admin Panel">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '4px' }}>Admin Overview</h1>
          <p style={{ color: '#6b7280' }}>System performance and management dashboard</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{
            padding: '10px 20px', backgroundColor: 'white',
            border: '1px solid #e2e8f0', borderRadius: '8px',
            cursor: 'pointer', fontWeight: '600', fontSize: '14px',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}>⬇ Export</button>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              padding: '10px 20px', backgroundColor: '#4a7c59',
              border: 'none', borderRadius: '8px', color: 'white',
              cursor: 'pointer', fontWeight: '600', fontSize: '14px',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}
          >+ New Project</button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
        {[
          { label: 'Total Matches', value: '1,284', change: '+12%', icon: '👥' },
          { label: 'Active Topics', value: '30', change: '+5.2%', icon: '📁' },
          { label: 'Engagement Rate', value: '84.2%', change: '-2.1%', icon: '📈' },
          { label: 'Avg. Match Time', value: '3.4 Days', change: '+18m', icon: '⏱' },
        ].map((stat, i) => (
          <div key={i} style={{
            backgroundColor: 'white', borderRadius: '12px',
            border: '1px solid #e2e8f0', padding: '24px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{
                width: '44px', height: '44px', backgroundColor: '#f0f5f2',
                borderRadius: '10px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '20px',
              }}>{stat.icon}</div>
              <span style={{
                fontSize: '12px', fontWeight: '600', color: '#4a7c59',
                backgroundColor: '#f0f5f2', padding: '2px 8px', borderRadius: '999px',
              }}>{stat.change}</span>
            </div>
            <p style={{ fontSize: '28px', fontWeight: '700' }}>{stat.value}</p>
            <p style={{ fontSize: '13px', color: '#9ca3af' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px' }}>
        {/* Topics Table */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', padding: '0 24px' }}>
            {(['topics', 'engagement'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '16px 20px', border: 'none', background: 'none',
                  cursor: 'pointer', fontWeight: activeTab === tab ? '600' : '400',
                  color: activeTab === tab ? '#4a7c59' : '#6b7280',
                  borderBottom: activeTab === tab ? '2px solid #4a7c59' : '2px solid transparent',
                  fontSize: '14px', textTransform: 'capitalize',
                  marginBottom: '-1px',
                }}
              >{tab === 'topics' ? 'Topic Management' : 'Engagement Analytics'}</button>
            ))}
          </div>

          {/* Table Header */}
          <div style={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontWeight: '600', fontSize: '16px' }}>Live Topics Registry</h3>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{
                backgroundColor: '#f0f5f2', color: '#4a7c59',
                padding: '4px 12px', borderRadius: '999px', fontSize: '13px', fontWeight: '600'
              }}>30 Total</span>
              <span style={{
                backgroundColor: '#fffbeb', color: '#92400e',
                padding: '4px 12px', borderRadius: '999px', fontSize: '13px', fontWeight: '600'
              }}>5 Pending Approval</span>
            </div>
          </div>

          {/* Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f9fafb', borderTop: '1px solid #f3f4f6', borderBottom: '1px solid #f3f4f6' }}>
                {['ID', 'Topic Name', 'Department', 'Status'].map(h => (
                  <th key={h} style={{
                    padding: '12px 24px', textAlign: 'left',
                    fontSize: '12px', fontWeight: '600', color: '#9ca3af', letterSpacing: '0.05em',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockTopics.map((topic, i) => (
                <tr key={topic.id} style={{ borderBottom: i < mockTopics.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                  <td style={{ padding: '16px 24px', fontSize: '13px', color: '#4a7c59', fontFamily: 'monospace' }}>
                    {topic.id}
                  </td>
                  <td style={{ padding: '16px 24px' }}>
                    <p style={{ fontWeight: '600', fontSize: '14px' }}>{topic.title}</p>
                    <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>{topic.domain}</p>
                  </td>
                  <td style={{ padding: '16px 24px', fontSize: '14px', color: '#374151' }}>{topic.department}</td>
                  <td style={{ padding: '16px 24px' }}>
                    <span style={{
                      backgroundColor: statusStyles[topic.status].bg,
                      color: statusStyles[topic.status].color,
                      padding: '4px 12px', borderRadius: '999px',
                      fontSize: '12px', fontWeight: '600',
                    }}>{topic.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* System Health */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px' }}>
            <h3 style={{ fontWeight: '600', fontSize: '16px', marginBottom: '16px' }}>System Health</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { name: 'Matching Engine', status: 'Stable', color: '#4a7c59' },
                { name: 'Database API', status: 'Stable', color: '#4a7c59' },
                { name: 'Cache Layer', status: 'Degraded', color: '#ef4444' },
              ].map((item, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px 16px', backgroundColor: '#f9fafb', borderRadius: '8px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color }} />
                    <span style={{ fontSize: '14px', fontWeight: '500' }}>{item.name}</span>
                  </div>
                  <span style={{ fontSize: '13px', color: item.color, fontWeight: '600' }}>{item.status}</span>
                </div>
              ))}
            </div>

            {/* Server Metrics */}
            <div style={{ marginTop: '20px' }}>
              <p style={{ fontSize: '11px', fontWeight: '600', color: '#9ca3af', letterSpacing: '0.05em', marginBottom: '12px' }}>
                SERVER METRICS
              </p>
              {[
                { label: 'CPU Load', value: 34 },
                { label: 'RAM Usage', value: 62 },
              ].map((metric, i) => (
                <div key={i} style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', color: '#374151' }}>{metric.label}</span>
                    <span style={{ fontSize: '13px', fontWeight: '600' }}>{metric.value}%</span>
                  </div>
                  <div style={{ height: '6px', backgroundColor: '#e2e8f0', borderRadius: '999px' }}>
                    <div style={{ width: `${metric.value}%`, height: '100%', backgroundColor: '#4a7c59', borderRadius: '999px' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Log */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px' }}>
            <h3 style={{ fontWeight: '600', fontSize: '16px', marginBottom: '16px' }}>Audit Log</h3>
            {[
              { title: 'Topic Updated', desc: 'Supervisor #042 changed requirements for Neural Net topic.', time: '2 mins ago', color: '#4a7c59' },
              { title: 'New Match Found', desc: "User #9102 matched with 'Digital Forensics'.", time: '14 mins ago', color: '#4a7c59' },
              { title: 'Backup Completed', desc: 'Daily database redundancy successful.', time: '1 hr ago', color: '#9ca3af' },
            ].map((log, i) => (
              <div key={i} style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: log.color, marginTop: '5px', minWidth: '8px' }} />
                <div>
                  <p style={{ fontWeight: '600', fontSize: '13px' }}>{log.title}</p>
                  <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>{log.desc}</p>
                  <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>{log.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Topic Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
        }}>
          <div style={{
            backgroundColor: 'white', borderRadius: '12px',
            padding: '32px', width: '500px', maxWidth: '90vw',
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '24px' }}>Add New Topic</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { label: 'Topic Title', key: 'title', placeholder: 'e.g., AI-Powered Recommendation System' },
                { label: 'Domain', key: 'domain', placeholder: 'e.g., Machine Learning' },
              ].map(field => (
                <div key={field.key}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>
                    {field.label}
                  </label>
                  <input
                    value={newTopic[field.key as keyof typeof newTopic]}
                    onChange={e => setNewTopic(prev => ({ ...prev, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    style={{
                      width: '100%', padding: '10px 14px', borderRadius: '8px',
                      border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>
              ))}
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>
                  Description
                </label>
                <textarea
                  value={newTopic.description}
                  onChange={e => setNewTopic(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the project scope and objectives..."
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '8px',
                    border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none',
                    fontFamily: 'inherit', height: '100px', resize: 'none',
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#374151', display: 'block', marginBottom: '6px' }}>
                  Difficulty
                </label>
                <select
                  value={newTopic.difficulty}
                  onChange={e => setNewTopic(prev => ({ ...prev, difficulty: e.target.value }))}
                  style={{
                    width: '100%', padding: '10px 14px', borderRadius: '8px',
                    border: '1px solid #e2e8f0', fontSize: '14px', outline: 'none',
                    fontFamily: 'inherit', backgroundColor: 'white',
                  }}
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
                style={{
                  flex: 1, padding: '12px', backgroundColor: 'white',
                  border: '1px solid #e2e8f0', borderRadius: '8px',
                  cursor: 'pointer', fontWeight: '600', fontSize: '14px',
                }}
              >Cancel</button>
              <button
                onClick={() => setShowAddModal(false)}
                style={{
                  flex: 1, padding: '12px', backgroundColor: '#4a7c59',
                  border: 'none', borderRadius: '8px', color: 'white',
                  cursor: 'pointer', fontWeight: '600', fontSize: '14px',
                }}
              >Add Topic</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}