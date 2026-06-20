import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/layout/Layout'

type Status = 'Accepted' | 'Pending' | 'Archived'

interface HistoryItem {
  id: string
  date: string
  title: string
  tags: string[]
  matchScore: number
  status: Status
}

const mockHistory: HistoryItem[] = [
  {
    id: '#PM-1024',
    date: 'Oct 24, 2024',
    title: 'Neural-Symbolic AI Architectures',
    tags: ['AI/ML', 'Python'],
    matchScore: 94,
    status: 'Accepted',
  },
  {
    id: '#PM-1025',
    date: 'Oct 22, 2024',
    title: 'Blockchain-Based Voting System',
    tags: ['Security', 'Solidity'],
    matchScore: 72,
    status: 'Pending',
  },
  {
    id: '#PM-1026',
    date: 'Oct 18, 2024',
    title: 'Real-time Traffic Mesh Network',
    tags: ['IoT', 'C++'],
    matchScore: 58,
    status: 'Archived',
  },
  {
    id: '#PM-1027',
    date: 'Oct 15, 2024',
    title: 'Autonomous Underwater Vehicle Control',
    tags: ['Robotics', 'ROS'],
    matchScore: 89,
    status: 'Accepted',
  },
]

const statusStyles: Record<Status, { bg: string; color: string; dot: string }> = {
  Accepted: { bg: '#f0fdf4', color: '#166534', dot: '#22c55e' },
  Pending: { bg: '#fffbeb', color: '#92400e', dot: '#f59e0b' },
  Archived: { bg: '#f9fafb', color: '#374151', dot: '#9ca3af' },
}

const filterTabs = ['All Matches', 'Accepted', 'Pending', 'Archived']

export default function HistoryPage() {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState('All Matches')

  const filtered = activeFilter === 'All Matches'
    ? mockHistory
    : mockHistory.filter(h => h.status === activeFilter)

  return (
    <Layout title="Project History">
      {/* Header Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '4px' }}>Project History</h1>
          <p style={{ color: '#6b7280' }}>Track all your project applications and matches</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px', backgroundColor: 'white',
            border: '1px solid #e2e8f0', borderRadius: '8px',
            cursor: 'pointer', fontWeight: '600', fontSize: '14px',
          }}>
            ⬇ Export CSV
          </button>
          <button
            onClick={() => navigate('/recommendations')}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 20px', backgroundColor: '#4a7c59',
              border: 'none', borderRadius: '8px', color: 'white',
              cursor: 'pointer', fontWeight: '600', fontSize: '14px',
            }}
          >
            + New Application
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex', gap: '4px',
        backgroundColor: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '10px',
        padding: '4px',
        marginBottom: '24px',
        width: 'fit-content',
      }}>
        {filterTabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            style={{
              padding: '8px 20px', borderRadius: '8px', border: 'none',
              cursor: 'pointer', fontWeight: activeFilter === tab ? '600' : '400',
              backgroundColor: activeFilter === tab ? '#4a7c59' : 'transparent',
              color: activeFilter === tab ? 'white' : '#374151',
              fontSize: '14px', transition: 'all 0.15s',
            }}
          >{tab}</button>
        ))}
      </div>

      {/* Table */}
      <div style={{
        backgroundColor: 'white', borderRadius: '12px',
        border: '1px solid #e2e8f0', overflow: 'hidden', marginBottom: '24px',
      }}>
        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '140px 1fr 160px 120px 140px 80px',
          padding: '12px 24px',
          backgroundColor: '#f9fafb',
          borderBottom: '1px solid #e2e8f0',
        }}>
          {['Date', 'Project Title', 'Domain Tags', 'Match Score', 'Status', 'Actions'].map(h => (
            <p key={h} style={{ fontSize: '12px', fontWeight: '600', color: '#9ca3af', letterSpacing: '0.05em' }}>
              {h}
            </p>
          ))}
        </div>

        {/* Table Rows */}
        {filtered.map((item, i) => (
          <div
            key={item.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '140px 1fr 160px 120px 140px 80px',
              padding: '20px 24px',
              borderBottom: i < filtered.length - 1 ? '1px solid #f3f4f6' : 'none',
              alignItems: 'center',
            }}
          >
            {/* Date */}
            <div>
              <p style={{ fontSize: '13px', color: '#9ca3af', fontFamily: 'monospace' }}>{item.id}</p>
              <p style={{ fontSize: '13px', color: '#374151', marginTop: '2px' }}>{item.date}</p>
            </div>

            {/* Title */}
            <div>
              <p style={{ fontWeight: '600', fontSize: '15px', color: '#1a1a1a' }}>{item.title}</p>
            </div>

            {/* Tags */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {item.tags.map(tag => (
                <span key={tag} style={{
                  backgroundColor: '#f3f4f6', color: '#374151',
                  padding: '3px 10px', borderRadius: '999px', fontSize: '12px',
                }}>{tag}</span>
              ))}
            </div>

            {/* Match Score */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '60px', height: '4px',
                backgroundColor: '#e2e8f0', borderRadius: '999px',
              }}>
                <div style={{
                  width: `${item.matchScore}%`, height: '100%',
                  backgroundColor: '#4a7c59', borderRadius: '999px',
                }} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: '600' }}>{item.matchScore}%</span>
            </div>

            {/* Status */}
            <div>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                backgroundColor: statusStyles[item.status].bg,
                color: statusStyles[item.status].color,
                padding: '4px 12px', borderRadius: '999px', fontSize: '13px', fontWeight: '500',
              }}>
                <span style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  backgroundColor: statusStyles[item.status].dot,
                }} />
                {item.status}
              </span>
            </div>

            {/* Actions */}
            <div>
              <button style={{
                border: '1px solid #e2e8f0', borderRadius: '6px',
                padding: '6px 10px', backgroundColor: 'white', cursor: 'pointer',
                fontSize: '16px',
              }}>⋯</button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <p style={{ fontSize: '14px', color: '#6b7280' }}>
          Showing {filtered.length} of {mockHistory.length} applications
        </p>
        <div style={{ display: 'flex', gap: '4px' }}>
          {[1, 2, 3].map(page => (
            <button key={page} style={{
              width: '36px', height: '36px', borderRadius: '8px', border: '1px solid #e2e8f0',
              backgroundColor: page === 1 ? '#4a7c59' : 'white',
              color: page === 1 ? 'white' : '#374151',
              cursor: 'pointer', fontWeight: '600', fontSize: '14px',
            }}>{page}</button>
          ))}
        </div>
      </div>

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {[
          { icon: '⊞', value: '24', label: 'Total Applied' },
          { icon: '✓', value: '3', label: 'Matches Found' },
          { icon: '📋', value: '12', label: 'Under Review' },
          { icon: '📊', value: '82%', label: 'Avg Match Score' },
        ].map((stat, i) => (
          <div key={i} style={{
            backgroundColor: 'white', borderRadius: '12px',
            border: '1px solid #e2e8f0', padding: '20px',
            display: 'flex', alignItems: 'center', gap: '16px',
          }}>
            <div style={{
              width: '44px', height: '44px',
              backgroundColor: '#f0f5f2', borderRadius: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px',
            }}>{stat.icon}</div>
            <div>
              <p style={{ fontSize: '24px', fontWeight: '700' }}>{stat.value}</p>
              <p style={{ fontSize: '13px', color: '#6b7280' }}>{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  )
}