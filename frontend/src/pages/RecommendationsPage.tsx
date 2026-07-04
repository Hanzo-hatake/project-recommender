import { useState } from 'react'
import Layout from '../components/layout/Layout'
import type { RecommendedTopic } from '../services/api'
import { recommendationService } from '../services/api'

const domains = [
  'AI & Machine Learning', 'Backend Development', 'Frontend Development',
  'Full Stack Development', 'Mobile Development', 'Data Science',
  'Cloud & DevOps', 'Cybersecurity'
]

export default function RecommendationsPage() {
  const [interests, setInterests] = useState('')
  const [skillLevel, setSkillLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate')
  const [selectedDomains, setSelectedDomains] = useState<string[]>([])
  const [matchThreshold, setMatchThreshold] = useState(0)
  const [loading, setLoading] = useState(false)
  const [recommendations, setRecommendations] = useState<RecommendedTopic[]>([])
  const [dismissed, setDismissed] = useState<number[]>([])
  const [bookmarked, setBookmarked] = useState<number[]>([])
  const [searched, setSearched] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState<RecommendedTopic | null>(null)
  const [acceptedTopic, setAcceptedTopic] = useState<RecommendedTopic | null>(null)

  const toggleDomain = (domain: string) => {
    setSelectedDomains(prev =>
      prev.includes(domain) ? prev.filter(d => d !== domain) : [...prev, domain]
    )
  }

  const handleGetRecommendations = async () => {
    if (!interests.trim()) return
    setLoading(true)
    setDismissed([])
    try {
      const results = await recommendationService.getRecommendations({
        interests,
        skill_level: skillLevel,
        preferred_domains: selectedDomains.length > 0 ? selectedDomains : undefined,
        available_months: 6,
      })
      setRecommendations(results)
      setSearched(true)
    } catch {
      alert('Failed to get recommendations. Make sure the backend is running!')
    } finally {
      setLoading(false)
    }
  }

  const handleBookmark = (topic: RecommendedTopic) => {
    const existing = JSON.parse(localStorage.getItem('bookmarkedTopics') || '[]')
    const isAlreadyBookmarked = existing.find((t: any) => t.id === topic.id)
    if (isAlreadyBookmarked) {
      const updated = existing.filter((t: any) => t.id !== topic.id)
      localStorage.setItem('bookmarkedTopics', JSON.stringify(updated))
      setBookmarked(prev => prev.filter(id => id !== topic.id))
    } else {
      localStorage.setItem('bookmarkedTopics', JSON.stringify([...existing, topic]))
      setBookmarked(prev => [...prev, topic.id])
    }
  }

  const handleAccept = (topic: RecommendedTopic) => {
    const existing = JSON.parse(localStorage.getItem('acceptedTopics') || '[]')
    const alreadyExists = existing.find((t: any) => t.id === topic.id)
    if (!alreadyExists) {
      localStorage.setItem('acceptedTopics', JSON.stringify([...existing, topic]))
    }
    setAcceptedTopic(topic)
  }

  const filteredRecs = recommendations.filter(t =>
    !dismissed.includes(t.id) &&
    Math.round(t.match_score * 100) >= matchThreshold
  )

  // Accepted confirmation screen
  if (acceptedTopic) {
    return (
      <Layout title="Match Accepted">
        <div style={{ maxWidth: '600px', margin: '60px auto', textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '24px' }}>🎉</div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '12px' }}>Match Accepted!</h1>
          <p style={{ color: '#6b7280', marginBottom: '32px', lineHeight: '1.6' }}>
            You've accepted <strong>"{acceptedTopic.title}"</strong> as your final year project topic.
            Your department coordinator will be notified.
          </p>
          <div style={{
            backgroundColor: 'white', borderRadius: '12px',
            border: '1px solid #e2e8f0', padding: '24px',
            marginBottom: '32px', textAlign: 'left',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: '11px', color: '#9ca3af', fontWeight: '600', marginBottom: '4px' }}>
                  SELECTED TOPIC
                </p>
                <p style={{ fontWeight: '700', fontSize: '18px', marginBottom: '8px' }}>
                  {acceptedTopic.title}
                </p>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>
                  {acceptedTopic.domain} · {acceptedTopic.duration_months} months · {acceptedTopic.difficulty}
                </p>
              </div>
              <span style={{
                backgroundColor: '#f0fdf4', color: '#166534',
                padding: '6px 14px', borderRadius: '999px',
                fontWeight: '700', fontSize: '16px',
              }}>
                {Math.round(acceptedTopic.match_score * 100)}% Match
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={() => { setAcceptedTopic(null); setSelectedTopic(null) }}
              style={{
                padding: '12px 24px', backgroundColor: 'white',
                color: '#374151', border: '1px solid #e2e8f0',
                borderRadius: '8px', fontWeight: '600', cursor: 'pointer',
              }}
            >Back to Recommendations</button>
            <button
              onClick={() => window.location.href = '/history'}
              style={{
                padding: '12px 24px', backgroundColor: '#4a7c59',
                color: 'white', border: 'none',
                borderRadius: '8px', fontWeight: '600', cursor: 'pointer',
              }}
            >View in History →</button>
          </div>
        </div>
      </Layout>
    )
  }

  // Topic Detail View
  if (selectedTopic) {
    return (
      <Layout title="Topic Details">
        <button
          onClick={() => setSelectedTopic(null)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            border: 'none', background: 'none', cursor: 'pointer',
            color: '#4a7c59', fontWeight: '600', fontSize: '14px',
            marginBottom: '24px',
          }}
        >← Back to Recommendations</button>

        <div style={{
          backgroundColor: 'white', borderRadius: '12px',
          border: '1px solid #e2e8f0', padding: '40px', maxWidth: '800px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
            <div>
              <span style={{
                backgroundColor: '#f0f5f2', color: '#4a7c59',
                padding: '4px 12px', borderRadius: '999px',
                fontSize: '12px', fontWeight: '600',
                marginBottom: '12px', display: 'inline-block',
              }}>{selectedTopic.domain}</span>
              <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a1a', marginTop: '8px' }}>
                {selectedTopic.title}
              </h1>
            </div>
            <div style={{
              backgroundColor: '#ccfbf1', color: '#134e4a',
              padding: '8px 16px', borderRadius: '999px',
              fontWeight: '700', fontSize: '18px', whiteSpace: 'nowrap',
            }}>
              {Math.round(selectedTopic.match_score * 100)}% Match
            </div>
          </div>

          <p style={{ color: '#374151', lineHeight: '1.7', fontSize: '16px', marginBottom: '32px' }}>
            {selectedTopic.description}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
            {[
              { label: 'Domain', value: selectedTopic.domain },
              { label: 'Difficulty', value: selectedTopic.difficulty },
              { label: 'Duration', value: `${selectedTopic.duration_months} months` },
            ].map((item, i) => (
              <div key={i} style={{ backgroundColor: '#f9fafb', borderRadius: '8px', padding: '16px' }}>
                <p style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '600', marginBottom: '4px' }}>
                  {item.label}
                </p>
                <p style={{ fontWeight: '600', color: '#1a1a1a', textTransform: 'capitalize' }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: '32px' }}>
            <p style={{ fontWeight: '600', marginBottom: '12px' }}>Tags</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {selectedTopic.tags.map(tag => (
                <span key={tag} style={{
                  backgroundColor: '#fef3c7', color: '#92400e',
                  padding: '6px 14px', borderRadius: '999px',
                  fontSize: '13px', fontWeight: '500',
                }}>{tag}</span>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => handleAccept(selectedTopic)}
              style={{
                flex: 1, backgroundColor: '#4a7c59', color: 'white',
                padding: '14px 32px', borderRadius: '8px',
                border: 'none', cursor: 'pointer',
                fontWeight: '600', fontSize: '16px',
              }}
            >✓ Accept This Match</button>
            <button
              onClick={() => handleBookmark(selectedTopic)}
              style={{
                padding: '14px 20px', borderRadius: '8px',
                border: `1px solid ${bookmarked.includes(selectedTopic.id) ? '#4a7c59' : '#e2e8f0'}`,
                backgroundColor: bookmarked.includes(selectedTopic.id) ? '#f0f5f2' : 'white',
                cursor: 'pointer', fontSize: '18px',
              }}
            >{bookmarked.includes(selectedTopic.id) ? '🔖' : '📄'}</button>
          </div>
        </div>
      </Layout>
    )
  }

  // Main Recommendations View
  return (
    <Layout title="Recommendations">
      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '32px' }}>
        {/* Left: Filters */}
        <div>
          <div style={{
            backgroundColor: 'white', borderRadius: '12px',
            border: '1px solid #e2e8f0', padding: '24px',
            position: 'sticky', top: '24px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontWeight: '600', fontSize: '16px' }}>Filters</h2>
              <button
                onClick={() => { setSelectedDomains([]); setInterests(''); setMatchThreshold(0) }}
                style={{ color: '#4a7c59', fontSize: '13px', border: 'none', background: 'none', cursor: 'pointer', fontWeight: '600' }}
              >Clear All</button>
            </div>

            {/* Interests */}
            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '11px', fontWeight: '600', color: '#9ca3af', letterSpacing: '0.05em', marginBottom: '8px' }}>
                YOUR INTERESTS
              </p>
              <textarea
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                placeholder="e.g., Machine learning, REST APIs, databases..."
                style={{
                  width: '100%', padding: '10px 12px',
                  borderRadius: '8px', border: '1px solid #e2e8f0',
                  fontSize: '13px', resize: 'none', height: '90px',
                  outline: 'none', fontFamily: 'inherit',
                }}
              />
            </div>

            {/* Skill Level */}
            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '11px', fontWeight: '600', color: '#9ca3af', letterSpacing: '0.05em', marginBottom: '8px' }}>
                SKILL LEVEL
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(['beginner', 'intermediate', 'advanced'] as const).map(level => (
                  <label key={level} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <input
                      type="radio" name="skill" value={level}
                      checked={skillLevel === level}
                      onChange={() => setSkillLevel(level)}
                    />
                    <span style={{ fontSize: '14px', textTransform: 'capitalize' }}>{level}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Match Threshold */}
            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '11px', fontWeight: '600', color: '#9ca3af', letterSpacing: '0.05em', marginBottom: '8px' }}>
                MATCH THRESHOLD: <span style={{ color: '#4a7c59' }}>{matchThreshold}%</span>
              </p>
              <input
                type="range" min="0" max="90" step="5"
                value={matchThreshold}
                onChange={(e) => setMatchThreshold(Number(e.target.value))}
                style={{ width: '100%', accentColor: '#4a7c59' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>
                <span>Min 0%</span>
                <span>Min 90%</span>
              </div>
            </div>

            {/* Project Domain */}
            <div style={{ marginBottom: '24px' }}>
              <p style={{ fontSize: '11px', fontWeight: '600', color: '#9ca3af', letterSpacing: '0.05em', marginBottom: '8px' }}>
                PROJECT DOMAIN
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {domains.map(domain => (
                  <button
                    key={domain}
                    onClick={() => toggleDomain(domain)}
                    style={{
                      padding: '6px 12px', borderRadius: '999px', fontSize: '12px',
                      border: selectedDomains.includes(domain) ? '2px solid #4a7c59' : '1px solid #e2e8f0',
                      backgroundColor: selectedDomains.includes(domain) ? '#f0f5f2' : 'white',
                      color: selectedDomains.includes(domain) ? '#4a7c59' : '#374151',
                      cursor: 'pointer',
                      fontWeight: selectedDomains.includes(domain) ? '600' : '400',
                    }}
                  >{domain}</button>
                ))}
              </div>
            </div>

            <button
              onClick={handleGetRecommendations}
              disabled={loading || !interests.trim()}
              style={{
                width: '100%', padding: '12px',
                backgroundColor: '#4a7c59', color: 'white',
                border: 'none', borderRadius: '8px',
                fontWeight: '600', cursor: 'pointer', fontSize: '14px',
                opacity: loading || !interests.trim() ? 0.6 : 1,
              }}
            >{loading ? '⏳ Finding matches...' : '✦ Get Recommendations'}</button>

            {bookmarked.length > 0 && (
              <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f0f5f2', borderRadius: '8px', textAlign: 'center' }}>
                <p style={{ fontSize: '13px', color: '#4a7c59', fontWeight: '600' }}>
                  🔖 {bookmarked.length} topic{bookmarked.length > 1 ? 's' : ''} bookmarked
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Results */}
        <div>
          {!searched ? (
            <div style={{
              backgroundColor: 'white', borderRadius: '12px',
              border: '1px solid #e2e8f0', padding: '60px', textAlign: 'center',
            }}>
              <p style={{ fontSize: '48px', marginBottom: '16px' }}>✦</p>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>Find Your Perfect Match</h2>
              <p style={{ color: '#6b7280' }}>Enter your interests and click "Get Recommendations" to see matched topics</p>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '4px' }}>Recommended For You</h2>
                <p style={{ color: '#6b7280' }}>
                  Showing {filteredRecs.length} of {recommendations.length} topics
                  {matchThreshold > 0 ? ` above ${matchThreshold}% match` : ''}
                </p>
              </div>

              {filteredRecs.length === 0 ? (
                <div style={{
                  backgroundColor: 'white', borderRadius: '12px',
                  border: '1px solid #e2e8f0', padding: '48px', textAlign: 'center',
                }}>
                  <p style={{ fontSize: '32px', marginBottom: '12px' }}>🔍</p>
                  <p style={{ fontWeight: '600', marginBottom: '8px' }}>No topics match your current filters</p>
                  <p style={{ color: '#6b7280', fontSize: '14px' }}>Try lowering the match threshold or clearing domain filters</p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                  {filteredRecs.map((topic) => (
                    <div
                      key={topic.id}
                      style={{
                        backgroundColor: 'white', borderRadius: '12px',
                        border: `1px solid ${bookmarked.includes(topic.id) ? '#4a7c59' : '#e2e8f0'}`,
                        padding: '24px', position: 'relative', transition: 'all 0.15s',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)')}
                      onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
                    >
                      {/* Match Badge */}
                      <div style={{
                        position: 'absolute', top: '16px', right: '16px',
                        backgroundColor: '#ccfbf1', color: '#134e4a',
                        padding: '4px 12px', borderRadius: '999px',
                        fontSize: '13px', fontWeight: '700',
                      }}>
                        ✓ {Math.round(topic.match_score * 100)}% Match
                      </div>

                      {bookmarked.includes(topic.id) && (
                        <div style={{
                          position: 'absolute', top: '16px', left: '16px',
                          backgroundColor: '#4a7c59', color: 'white',
                          padding: '2px 8px', borderRadius: '999px',
                          fontSize: '11px', fontWeight: '600',
                        }}>🔖 Saved</div>
                      )}

                      <h3 style={{
                        fontSize: '16px', fontWeight: '700', color: '#1a1a1a',
                        marginBottom: '8px', paddingRight: '110px',
                        marginTop: bookmarked.includes(topic.id) ? '20px' : '0',
                      }}>
                        {topic.title}
                      </h3>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                        {topic.tags.slice(0, 3).map(tag => (
                          <span key={tag} style={{
                            backgroundColor: '#f3f4f6', color: '#374151',
                            padding: '3px 10px', borderRadius: '999px', fontSize: '12px',
                          }}>{tag}</span>
                        ))}
                      </div>

                      <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '16px', lineHeight: '1.5' }}>
                        {topic.description.slice(0, 100)}...
                      </p>

                      <div style={{
                        display: 'flex', justifyContent: 'space-between',
                        marginBottom: '16px', paddingTop: '12px',
                        borderTop: '1px solid #f3f4f6',
                      }}>
                        <div>
                          <p style={{ fontSize: '12px', color: '#9ca3af' }}>Domain</p>
                          <p style={{ fontSize: '13px', fontWeight: '600' }}>{topic.domain}</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontSize: '12px', color: '#9ca3af' }}>Duration</p>
                          <p style={{ fontSize: '13px', fontWeight: '600' }}>{topic.duration_months} months</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => setSelectedTopic(topic)}
                          style={{
                            flex: 1, padding: '10px',
                            backgroundColor: '#4a7c59', color: 'white',
                            border: 'none', borderRadius: '8px',
                            fontWeight: '600', cursor: 'pointer', fontSize: '13px',
                          }}
                        >View & Accept</button>
                        <button
                          onClick={() => handleBookmark(topic)}
                          style={{
                            width: '40px', height: '40px',
                            border: `1px solid ${bookmarked.includes(topic.id) ? '#4a7c59' : '#e2e8f0'}`,
                            borderRadius: '8px',
                            backgroundColor: bookmarked.includes(topic.id) ? '#f0f5f2' : 'white',
                            cursor: 'pointer', fontSize: '16px',
                          }}
                        >🔖</button>
                        <button
                          onClick={() => setDismissed(prev => [...prev, topic.id])}
                          style={{
                            width: '40px', height: '40px',
                            border: '1px solid #fecaca',
                            borderRadius: '8px', backgroundColor: 'white',
                            cursor: 'pointer', fontSize: '16px',
                          }}
                        >✕</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  )
}