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
  const [loading, setLoading] = useState(false)
  const [recommendations, setRecommendations] = useState<RecommendedTopic[]>([])
  const [searched, setSearched] = useState(false)
  const [selectedTopic, setSelectedTopic] = useState<RecommendedTopic | null>(null)

  const toggleDomain = (domain: string) => {
    setSelectedDomains(prev =>
      prev.includes(domain) ? prev.filter(d => d !== domain) : [...prev, domain]
    )
  }

  const handleGetRecommendations = async () => {
    if (!interests.trim()) return
    setLoading(true)
    try {
      const results = await recommendationService.getRecommendations({
        interests,
        skill_level: skillLevel,
        preferred_domains: selectedDomains.length > 0 ? selectedDomains : undefined,
        available_months: 6,
      })
      setRecommendations(results)
      setSearched(true)
    } catch (error) {
      alert('Failed to get recommendations. Make sure the backend is running!')
    } finally {
      setLoading(false)
    }
  }

  // Topic Detail Modal
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
                fontSize: '12px', fontWeight: '600', marginBottom: '12px', display: 'inline-block'
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
              <div key={i} style={{
                backgroundColor: '#f9fafb', borderRadius: '8px', padding: '16px',
              }}>
                <p style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '600', marginBottom: '4px' }}>{item.label}</p>
                <p style={{ fontWeight: '600', color: '#1a1a1a', textTransform: 'capitalize' }}>{item.value}</p>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: '32px' }}>
            <p style={{ fontWeight: '600', marginBottom: '12px' }}>Tags</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {selectedTopic.tags.map(tag => (
                <span key={tag} style={{
                  backgroundColor: '#fef3c7', color: '#92400e',
                  padding: '6px 14px', borderRadius: '999px', fontSize: '13px', fontWeight: '500'
                }}>{tag}</span>
              ))}
            </div>
          </div>

          <button
            style={{
              backgroundColor: '#4a7c59', color: 'white',
              padding: '14px 32px', borderRadius: '8px',
              border: 'none', cursor: 'pointer',
              fontWeight: '600', fontSize: '16px', width: '100%',
            }}
          >
            Accept Match ✓
          </button>
        </div>
      </Layout>
    )
  }

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
                onClick={() => { setSelectedDomains([]); setInterests(''); }}
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
                      cursor: 'pointer', fontWeight: selectedDomains.includes(domain) ? '600' : '400',
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
            >
              {loading ? '⏳ Finding matches...' : '✦ Get Recommendations'}
            </button>

            {searched && (
              <p style={{ textAlign: 'center', fontSize: '13px', color: '#6b7280', marginTop: '12px', fontStyle: 'italic' }}>
                Showing {recommendations.length} projects matched to your profile
              </p>
            )}
          </div>
        </div>

        {/* Right: Results */}
        <div>
          {!searched ? (
            <div style={{
              backgroundColor: 'white', borderRadius: '12px',
              border: '1px solid #e2e8f0', padding: '60px',
              textAlign: 'center',
            }}>
              <p style={{ fontSize: '48px', marginBottom: '16px' }}>✦</p>
              <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>Find Your Perfect Match</h2>
              <p style={{ color: '#6b7280' }}>Enter your interests and click "Get Recommendations" to see matched topics</p>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '4px' }}>Recommended For You</h2>
                <p style={{ color: '#6b7280' }}>Based on your proficiency in {interests.slice(0, 60)}...</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
                {recommendations.map((topic) => (
                  <div
                    key={topic.id}
                    style={{
                      backgroundColor: 'white', borderRadius: '12px',
                      border: '1px solid #e2e8f0', padding: '24px',
                      cursor: 'pointer', transition: 'all 0.15s',
                      position: 'relative',
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
                      display: 'flex', alignItems: 'center', gap: '4px',
                    }}>
                      ✓ {Math.round(topic.match_score * 100)}% Match
                    </div>

                    <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#1a1a1a', marginBottom: '8px', paddingRight: '100px' }}>
                      {topic.title}
                    </h3>

                    {/* Tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
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

                    {/* Domain & Duration */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', paddingTop: '12px', borderTop: '1px solid #f3f4f6' }}>
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
                      >Accept Match</button>
                      <button style={{
                        width: '40px', height: '40px',
                        border: '1px solid #e2e8f0', borderRadius: '8px',
                        backgroundColor: 'white', cursor: 'pointer', fontSize: '16px',
                      }}>🔖</button>
                      <button style={{
                        width: '40px', height: '40px',
                        border: '1px solid #fecaca', borderRadius: '8px',
                        backgroundColor: 'white', cursor: 'pointer', fontSize: '16px',
                      }}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  )
}