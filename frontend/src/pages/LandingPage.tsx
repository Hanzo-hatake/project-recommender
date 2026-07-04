import { useAuth, SignIn, SignUp } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export default function LandingPage() {
  const { isSignedIn, isLoaded } = useAuth()
  const navigate = useNavigate()
  const [showSignIn, setShowSignIn] = useState(false)
  const [showSignUp, setShowSignUp] = useState(false)

  if (!isLoaded) return <div>Loading...</div>

  if (isSignedIn) {
    navigate('/dashboard')
    return null
  }

  if (showSignIn) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#faf6f0' }}>
        {/* Header */}
        <header style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#faf6f0', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setShowSignIn(false)}>
            <div style={{ width: '36px', height: '36px', backgroundColor: '#4a7c59', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>P</div>
            <span style={{ fontSize: '20px', fontWeight: '700', color: '#4a7c59' }}>ProjectMatch</span>
          </div>
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 70px)', padding: '40px 20px' }}>
          {/* Welcome text above Clerk */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ width: '56px', height: '56px', backgroundColor: '#4a7c59', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '24px', margin: '0 auto 16px' }}>P</div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a', marginBottom: '6px' }}>Welcome back to ProjectMatch</h1>
            <p style={{ color: '#6b7280', fontSize: '15px' }}>University Academic Portal — Session 2024/25</p>
          </div>
          <SignIn routing="hash" afterSignInUrl="/dashboard" />
          <button onClick={() => setShowSignIn(false)} style={{ marginTop: '16px', color: '#4a7c59', fontWeight: '600', border: 'none', background: 'none', cursor: 'pointer', fontSize: '14px' }}>
            ← Back to home
          </button>
        </div>

        <footer style={{ textAlign: 'center', padding: '20px', color: '#9ca3af', fontSize: '13px', borderTop: '1px solid #e2e8f0' }}>
          © 2024 University ProjectMatch Portal. All rights reserved. &nbsp;·&nbsp;
          <a href="#" style={{ color: '#9ca3af' }}>Privacy Policy</a> &nbsp;·&nbsp;
          <a href="#" style={{ color: '#9ca3af' }}>Help Desk</a>
        </footer>
      </div>
    )
  }

  if (showSignUp) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#faf6f0' }}>
        <header style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#faf6f0', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => setShowSignUp(false)}>
            <div style={{ width: '36px', height: '36px', backgroundColor: '#4a7c59', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>P</div>
            <span style={{ fontSize: '20px', fontWeight: '700', color: '#4a7c59' }}>ProjectMatch</span>
          </div>
        </header>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 70px)', padding: '40px 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ width: '56px', height: '56px', backgroundColor: '#4a7c59', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '24px', margin: '0 auto 16px' }}>P</div>
            <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1a1a1a', marginBottom: '6px' }}>Create your ProjectMatch account</h1>
            <p style={{ color: '#6b7280', fontSize: '15px' }}>University Academic Portal — Session 2024/25</p>
          </div>
          <SignUp routing="hash" afterSignUpUrl="/dashboard" />
          <button onClick={() => setShowSignUp(false)} style={{ marginTop: '16px', color: '#4a7c59', fontWeight: '600', border: 'none', background: 'none', cursor: 'pointer', fontSize: '14px' }}>
            ← Back to home
          </button>
        </div>

        <footer style={{ textAlign: 'center', padding: '20px', color: '#9ca3af', fontSize: '13px', borderTop: '1px solid #e2e8f0' }}>
          © 2024 University ProjectMatch Portal. All rights reserved. &nbsp;·&nbsp;
          <a href="#" style={{ color: '#9ca3af' }}>Privacy Policy</a> &nbsp;·&nbsp;
          <a href="#" style={{ color: '#9ca3af' }}>Help Desk</a>
        </footer>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#faf6f0' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: '#faf6f0', padding: '16px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '36px', height: '36px', backgroundColor: '#4a7c59', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>P</div>
          <span style={{ fontSize: '20px', fontWeight: '700', color: '#4a7c59' }}>ProjectMatch</span>
        </div>
        <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <a href="#how-it-works" style={{ color: '#374151', textDecoration: 'none', fontWeight: '500', fontSize: '15px' }}>How it works</a>
          <a href="#features" style={{ color: '#374151', textDecoration: 'none', fontWeight: '500', fontSize: '15px' }}>Features</a>
          <button onClick={() => setShowSignIn(true)} style={{ padding: '8px 20px', backgroundColor: 'white', border: '1px solid #4a7c59', borderRadius: '8px', color: '#4a7c59', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>Login</button>
          <button onClick={() => setShowSignUp(true)} style={{ padding: '8px 20px', backgroundColor: '#4a7c59', border: 'none', borderRadius: '8px', color: 'white', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}>Register</button>
        </nav>
      </header>

      {/* Hero */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 40px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#f0f5f2', color: '#4a7c59', padding: '6px 14px', borderRadius: '999px', fontSize: '13px', fontWeight: '600', marginBottom: '24px' }}>
              🎓 Academic Portal 2024/25
            </div>
            <h1 style={{ fontSize: '48px', fontWeight: '800', color: '#1a1a1a', lineHeight: '1.15', marginBottom: '20px' }}>
              Find the Perfect Final Year Project Topic
            </h1>
            <p style={{ fontSize: '18px', color: '#6b7280', lineHeight: '1.7', marginBottom: '36px' }}>
              Streamlining the bridge between academic curiosity and industry relevance. Our AI-driven engine matches your skills with vetted project scopes.
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button
                onClick={() => setShowSignUp(true)}
                style={{ padding: '14px 28px', backgroundColor: '#4a7c59', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', fontSize: '16px', cursor: 'pointer' }}
              >Explore Topics</button>
                <a
                href="#how-it-works"
                style={{ padding: '14px 28px', backgroundColor: 'white', color: '#374151', border: '1px solid #e2e8f0', borderRadius: '8px', fontWeight: '600', fontSize: '16px', cursor: 'pointer', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
              >How it works</a>
            </div>
          </div>

          {/* Hero Card */}
          <div style={{ position: 'relative' }}>
            <div style={{ backgroundColor: '#1a2e1a', borderRadius: '16px', padding: '40px', color: 'white', minHeight: '340px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ fontSize: '14px', color: '#a0c4a0', marginBottom: '8px', letterSpacing: '0.1em' }}>MATCH STRENGTH</div>
              <div style={{ fontSize: '64px', fontWeight: '800', color: 'white', marginBottom: '16px' }}>98%</div>
              <div style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '999px', marginBottom: '32px' }}>
                <div style={{ width: '98%', height: '100%', backgroundColor: '#4a7c59', borderRadius: '999px' }} />
              </div>
              <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '10px', padding: '16px' }}>
                <p style={{ fontWeight: '600', marginBottom: '4px' }}>AI-Powered Recommendation System</p>
                <p style={{ fontSize: '13px', color: '#a0c4a0' }}>Backend Development · 6 months</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" style={{ backgroundColor: 'white', padding: '80px 40px', borderTop: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '12px' }}>How It Works</h2>
            <p style={{ color: '#6b7280', fontSize: '16px' }}>Three simple steps to find your perfect project</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' }}>
            {[
              { step: '01', title: 'Tell Us Your Interests', desc: 'Enter your skills, interests, and preferred domains. The more detail you provide, the better the match.' },
              { step: '02', title: 'AI Finds Your Match', desc: 'Our embedding-based engine compares your profile against 30+ vetted project topics using semantic similarity.' },
              { step: '03', title: 'Accept Your Topic', desc: 'Review your ranked recommendations with match scores, pick the best fit, and start your final year project journey.' },
            ].map((item, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ width: '56px', height: '56px', backgroundColor: '#4a7c59', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '18px', margin: '0 auto 20px' }}>{item.step}</div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px' }}>{item.title}</h3>
                <p style={{ color: '#6b7280', lineHeight: '1.6', fontSize: '15px' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '80px 40px', backgroundColor: '#faf6f0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontSize: '36px', fontWeight: '700', marginBottom: '12px' }}>Engineered for Success</h2>
            <p style={{ color: '#6b7280', fontSize: '16px' }}>Professional tools to help students find high-impact research projects</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {[
              { icon: '🤖', title: 'AI-Powered Matching', desc: 'Our proprietary algorithm analyzes your academic history, skill set, and interests to suggest topics where you\'ll excel.' },
              { icon: '✅', title: 'Vetted Topics', desc: 'All project topics are verified and relevant to current industry needs and academic requirements.' },
              { icon: '⚡', title: 'Centralized Workflow', desc: 'From initial recommendation to final selection, manage your entire project lifecycle in one secure workspace.' },
            ].map((item, i) => (
              <div key={i} style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '32px' }}>
                <div style={{ fontSize: '32px', marginBottom: '16px' }}>{item.icon}</div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '10px' }}>{item.title}</h3>
                <p style={{ color: '#6b7280', lineHeight: '1.6', fontSize: '15px' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ backgroundColor: '#4a7c59', padding: '60px 40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '40px', textAlign: 'center' }}>
          {[
            { value: '30+', label: 'PROJECTS LISTED' },
            { value: '8', label: 'DOMAINS COVERED' },
            { value: '95%', label: 'STUDENT MATCH RATE' },
            { value: '<1s', label: 'AVG MATCH TIME' },
          ].map((stat, i) => (
            <div key={i}>
              <p style={{ fontSize: '40px', fontWeight: '800', color: 'white', marginBottom: '8px' }}>{stat.value}</p>
              <p style={{ fontSize: '12px', color: '#a0c4a0', letterSpacing: '0.1em', fontWeight: '600' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ backgroundColor: 'white', borderTop: '1px solid #e2e8f0', padding: '40px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', backgroundColor: '#4a7c59', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px' }}>P</div>
            <div>
              <p style={{ fontWeight: '700', color: '#1a1a1a', fontSize: '14px' }}>ProjectMatch</p>
              <p style={{ color: '#9ca3af', fontSize: '12px' }}>© 2024 University ProjectMatch Portal. All rights reserved.</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '24px' }}>
            {['Privacy Policy', 'Terms of Service', 'Help Desk', 'Department Contact'].map(link => (
              <a key={link} href="#" style={{ color: '#6b7280', fontSize: '13px', textDecoration: 'none' }}>{link}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  )
}