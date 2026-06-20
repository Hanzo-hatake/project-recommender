import { useEffect, useState } from 'react'
import Layout from '../components/layout/Layout'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import { analyticsService, type AnalyticsData } from '../services/api'

const COLORS = ['#4a7c59', '#705c30', '#6b7280', '#3d6448', '#92400e', '#134e4a', '#374151', '#166534']

const difficultyColors: Record<string, string> = {
  beginner: '#4a7c59',
  intermediate: '#f59e0b',
  advanced: '#ef4444',
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    analyticsService.getAnalytics()
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <Layout title="Analytics">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '32px', marginBottom: '12px' }}>📊</p>
          <p style={{ color: '#6b7280' }}>Loading real data from your system...</p>
        </div>
      </div>
    </Layout>
  )

  if (error) return (
    <Layout title="Analytics">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '400px' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '32px', marginBottom: '12px' }}>⚠️</p>
          <p style={{ color: '#ef4444', fontWeight: '600' }}>Could not connect to backend</p>
          <p style={{ color: '#6b7280', marginTop: '8px' }}>Make sure your Rust backend is running on port 8080</p>
        </div>
      </div>
    </Layout>
  )

  const pieData = data?.difficulty_distribution.map(d => ({
    name: d.difficulty.charAt(0).toUpperCase() + d.difficulty.slice(1),
    value: Number(d.count),
    color: difficultyColors[d.difficulty] || '#9ca3af',
  })) || []

  return (
    <Layout title="Analytics">
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '4px' }}>Analytics</h1>
        <p style={{ color: '#6b7280' }}>Real-time data from your ProjectMatch system</p>
      </div>

      {/* Top Stats - REAL DATA */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
        <div style={{
          backgroundColor: 'white', borderRadius: '12px',
          border: '1px solid #e2e8f0', padding: '24px',
        }}>
          <div style={{
            width: '44px', height: '44px', backgroundColor: '#f0f5f2',
            borderRadius: '10px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '20px', marginBottom: '12px',
          }}>📁</div>
          <p style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '600', letterSpacing: '0.05em', marginBottom: '4px' }}>
            TOTAL ACTIVE TOPICS
          </p>
          <p style={{ fontSize: '36px', fontWeight: '700', color: '#1a1a1a' }}>
            {data?.total_topics ?? '—'}
          </p>
          <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>In your database</p>
        </div>

        <div style={{
          backgroundColor: 'white', borderRadius: '12px',
          border: '1px solid #e2e8f0', padding: '24px',
        }}>
          <div style={{
            width: '44px', height: '44px', backgroundColor: '#f0f5f2',
            borderRadius: '10px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '20px', marginBottom: '12px',
          }}>🏷️</div>
          <p style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '600', letterSpacing: '0.05em', marginBottom: '4px' }}>
            UNIQUE DOMAINS
          </p>
          <p style={{ fontSize: '36px', fontWeight: '700', color: '#1a1a1a' }}>
            {data?.domain_distribution.length ?? '—'}
          </p>
          <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>Across all topics</p>
        </div>

        <div style={{
          backgroundColor: 'white', borderRadius: '12px',
          border: '1px solid #e2e8f0', padding: '24px',
        }}>
          <div style={{
            width: '44px', height: '44px', backgroundColor: '#f0f5f2',
            borderRadius: '10px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '20px', marginBottom: '12px',
          }}>⚡</div>
          <p style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '600', letterSpacing: '0.05em', marginBottom: '4px' }}>
            TOP DOMAIN
          </p>
          <p style={{ fontSize: '22px', fontWeight: '700', color: '#1a1a1a' }}>
            {data?.domain_distribution[0]?.domain ?? '—'}
          </p>
          <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
            {data?.domain_distribution[0]?.count ?? 0} topics
          </p>
        </div>
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Domain Distribution - REAL */}
        <div style={{
          backgroundColor: 'white', borderRadius: '12px',
          border: '1px solid #e2e8f0', padding: '24px',
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>Topics by Domain</h2>
          <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '20px' }}>
            Real distribution from your database
          </p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data?.domain_distribution} layout="vertical" margin={{ left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} />
              <YAxis
                dataKey="domain" type="category"
                tick={{ fontSize: 11, fill: '#374151' }}
                width={120}
              />
              <Tooltip
                formatter={(value) => [`${value} topics`, 'Count']}
                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
              />
              <Bar dataKey="count" fill="#4a7c59" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Difficulty Breakdown - REAL */}
        <div style={{
          backgroundColor: 'white', borderRadius: '12px',
          border: '1px solid #e2e8f0', padding: '24px',
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>Topics by Difficulty</h2>
          <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '20px' }}>
            Skill level distribution of all topics
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <ResponsiveContainer width="55%" height={240}>
              <PieChart>
                <Pie
                  data={pieData} cx="50%" cy="50%"
                  innerRadius={55} outerRadius={90} dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} topics`]} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{ flex: 1 }}>
              {pieData.map((item, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center', marginBottom: '16px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: item.color }} />
                    <span style={{ fontSize: '14px', color: '#374151' }}>{item.name}</span>
                  </div>
                  <span style={{ fontWeight: '700', fontSize: '16px' }}>{item.value}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', fontWeight: '600' }}>Total</span>
                  <span style={{ fontSize: '16px', fontWeight: '700' }}>{data?.total_topics}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Domain Table - REAL */}
      <div style={{
        backgroundColor: 'white', borderRadius: '12px',
        border: '1px solid #e2e8f0', padding: '24px',
      }}>
        <h2 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '20px' }}>
          Full Domain Breakdown
        </h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb' }}>
              {['Rank', 'Domain', 'Topics', 'Share'].map(h => (
                <th key={h} style={{
                  padding: '12px 16px', textAlign: 'left',
                  fontSize: '12px', fontWeight: '600', color: '#9ca3af',
                  letterSpacing: '0.05em',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.domain_distribution.map((row, i) => {
              const share = ((Number(row.count) / (data?.total_topics || 1)) * 100).toFixed(1)
              return (
                <tr key={i} style={{ borderTop: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '14px 16px', color: '#9ca3af', fontSize: '14px' }}>#{i + 1}</td>
                  <td style={{ padding: '14px 16px', fontWeight: '600', fontSize: '14px' }}>{row.domain}</td>
                  <td style={{ padding: '14px 16px', fontSize: '14px' }}>{row.count}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ flex: 1, height: '6px', backgroundColor: '#f3f4f6', borderRadius: '999px' }}>
                        <div style={{
                          width: `${share}%`, height: '100%',
                          backgroundColor: COLORS[i % COLORS.length],
                          borderRadius: '999px',
                        }} />
                      </div>
                      <span style={{ fontSize: '13px', color: '#6b7280', minWidth: '40px' }}>{share}%</span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}