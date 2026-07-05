import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from '../components/layout/Layout'

type Status = 'Accepted' | 'Pending' | 'Archived'

interface HistoryItem {
  id: number
  date: string
  title: string
  domain: string
  tags: string[]
  matchScore: number
  status: Status
  difficulty: string
  duration_months: number
}

const statusStyles: Record<Status, { bg: string; color: string; dot: string }> = {
  Accepted: { bg: '#f0fdf4', color: '#166534', dot: '#22c55e' },
  Pending: { bg: '#fffbeb', color: '#92400e', dot: '#f59e0b' },
  Archived: { bg: '#f9fafb', color: '#374151', dot: '#9ca3af' },
}

const filterTabs = ['All', 'Accepted', 'Pending', 'Archived', 'Bookmarked']

export default function HistoryPage() {
  const navigate = useNavigate()
  const [activeFilter, setActiveFilter] = useState('All')
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [bookmarked, setBookmarked] = useState<HistoryItem[]>([])

  useEffect(() => {
    // Load accepted topics from localStorage
    const accepted = JSON.parse(localStorage.getItem('acceptedTopics') || '[]')
    const bookmarks = JSON.parse(localStorage.getItem('bookmarkedTopics') || '[]')

    const acceptedItems: HistoryItem[] = accepted.map((t: any) => ({
      id: t.id,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      title: t.title,
      domain: t.domain,
      tags: t.tags?.slice(0, 2) || [],
      matchScore: Math.round(t.match_score * 100),
      status: 'Accepted' as Status,
      difficulty: t.difficulty,
      duration_months: t.duration_months,
    }))

    setHistory(acceptedItems)
    setBookmarked(bookmarks)
  }, [])

  const filtered = activeFilter === 'All'
    ? history
    : activeFilter === 'Bookmarked'
    ? bookmarked.map((t: any) => ({
        id: t.id,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        title: t.title,
        domain: t.domain,
        tags: t.tags?.slice(0, 2) || [],
        matchScore: Math.round(t.match_score * 100),
        status: 'Pending' as Status,
        difficulty: t.difficulty,
        duration_months: t.duration_months,
      }))
    : history.filter(h => h.status === activeFilter)

  const exportCSV = () => {
    const headers = ['ID', 'Date', 'Title', 'Domain', 'Match Score', 'Status', 'Difficulty', 'Duration']
    const rows = filtered.map(h => [
      h.id, h.date, `"${h.title}"`, h.domain,
      `${h.matchScore}%`, h.status, h.difficulty, `${h.duration_months} months`
    ])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'projectmatch_history.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Layout title="Project History">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '4px' }}>Project History</h1>
          <p style={{ color: '#6b7280' }}>Track all your accepted and bookmarked project topics</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={exportCSV}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 20px', backgroundColor: 'white',
              border: '1px solid #e2e8f0', borderRadius: '8px',
              cursor: 'pointer', fontWeight: '600', fontSize: '14px',
            }}
          >⬇ Export CSV</button>
          <button
            onClick={() => navigate('/recommendations')}
            style={{
              padding: '10px 20px', backgroundColor: '#4a7c59',
              border: 'none', borderRadius: '8px', color: 'white',
              cursor: 'pointer', fontWeight: '600', fontSize: '14px',
            }}
          >+ New Application</button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div style={{
        display: 'flex', gap: '4px',
        backgroundColor: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '10px', padding: '4px',
        marginBottom: '24px', width: 'fit-content',
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

      {/* Empty State */}
      {filtered.length === 0 ? (
        <div style={{
          backgroundColor: 'white', borderRadius: '12px',
          border: '1px solid #e2e8f0', padding: '60px',
          textAlign: 'center',
        }}>
          <p style={{ fontSize: '48px', marginBottom: '16px' }}>
            {activeFilter === 'Bookmarked' ? '🔖' : '📋'}
          </p>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>
            {activeFilter === 'Bookmarked' ? 'No bookmarked topics yet' : 'No history yet'}
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>
            {activeFilter === 'Bookmarked'
              ? 'Bookmark topics from the Recommendations page to save them here'
              : 'Accept a topic from the Recommendations page to see it here'}
          </p>
          <button
            onClick={() => navigate('/recommendations')}
            style={{ padding: '12px 24px', backgroundColor: '#4a7c59', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
          >Go to Recommendations</button>
        </div>
      ) : (
        <>
          {/* Table */}
          <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', marginBottom: '24px' }}>
            {/* Table Header */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px 120px 140px 80px', padding: '12px 24px', backgroundColor: '#f9fafb', borderBottom: '1px solid #e2e8f0' }}>
              {['Project Title', 'Domain Tags', 'Match Score', 'Status', 'Actions'].map(h => (
                <p key={h} style={{ fontSize: '12px', fontWeight: '600', color: '#9ca3af', letterSpacing: '0.05em' }}>{h}</p>
              ))}
            </div>

            {/* Rows */}
            {filtered.map((item, i) => (
              <div
                key={item.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 160px 120px 140px 80px',
                  padding: '20px 24px',
                  borderBottom: i < filtered.length - 1 ? '1px solid #f3f4f6' : 'none',
                  alignItems: 'center',
                }}
              >
                {/* Title */}
                <div>
                  <p style={{ fontWeight: '600', fontSize: '15px', color: '#1a1a1a' }}>{item.title}</p>
                  <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>{item.date} · {item.difficulty} · {item.duration_months} months</p>
                </div>

                {/* Tags */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {item.tags.map((tag: string) => (
                    <span key={tag} style={{ backgroundColor: '#f3f4f6', color: '#374151', padding: '3px 10px', borderRadius: '999px', fontSize: '12px' }}>{tag}</span>
                  ))}
                </div>

                {/* Match Score */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '50px', height: '4px', backgroundColor: '#e2e8f0', borderRadius: '999px' }}>
                    <div style={{ width: `${item.matchScore}%`, height: '100%', backgroundColor: '#4a7c59', borderRadius: '999px' }} />
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
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: statusStyles[item.status].dot }} />
                    {item.status}
                  </span>
                </div>

                {/* Actions */}
                <div>
                  <button
                    onClick={() => {
                      const updated = history.filter(h => h.id !== item.id)
                      setHistory(updated)
                      localStorage.setItem('acceptedTopics', JSON.stringify(updated))
                    }}
                    style={{ border: '1px solid #fecaca', borderRadius: '6px', padding: '6px 10px', backgroundColor: 'white', cursor: 'pointer', fontSize: '14px', color: '#ef4444' }}
                  >✕</button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {[
              { icon: '⊞', value: history.length.toString(), label: 'Total Applied' },
              { icon: '✓', value: history.filter(h => h.status === 'Accepted').length.toString(), label: 'Accepted' },
              { icon: '🔖', value: bookmarked.length.toString(), label: 'Bookmarked' },
              { icon: '📊', value: history.length > 0 ? `${Math.round(history.reduce((a, b) => a + b.matchScore, 0) / history.length)}%` : '0%', label: 'Avg Match Score' },
            ].map((stat, i) => (
              <div key={i} style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '44px', height: '44px', backgroundColor: '#f0f5f2', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>{stat.icon}</div>
                <div>
                  <p style={{ fontSize: '24px', fontWeight: '700' }}>{stat.value}</p>
                  <p style={{ fontSize: '13px', color: '#6b7280' }}>{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </Layout>
  )
}