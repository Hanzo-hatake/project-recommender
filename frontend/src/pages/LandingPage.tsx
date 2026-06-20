import { useAuth, SignIn, SignUp } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Button } from '../components/common/button'

export default function LandingPage() {
  const { isSignedIn, isLoaded } = useAuth()
  const navigate = useNavigate()
  const [showSignIn, setShowSignIn] = useState(false)
  const [showSignUp, setShowSignUp] = useState(false)

  if (!isLoaded) return <div>Loading...</div>

  if (showSignIn) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <SignIn
            routing="hash"
            signUpUrl="#"
            afterSignInUrl="/dashboard"
          />
          <button
            onClick={() => setShowSignIn(false)}
            className="w-full mt-4 text-center text-primary hover:underline"
          >
            Back to home
          </button>
        </div>
      </div>
    )
  }

  if (showSignUp) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <SignUp
            routing="hash"
            signInUrl="#"
            afterSignUpUrl="/dashboard"
          />
          <button
            onClick={() => setShowSignUp(false)}
            className="w-full mt-4 text-center text-primary hover:underline"
          >
            Back to home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-muted sticky top-0 bg-background z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
              P
            </div>
            <h1 className="text-2xl font-bold text-primary">ProjectMatch</h1>
          </div>
          <nav className="flex items-center gap-4">
            {isSignedIn ? (
              <Button onClick={() => navigate('/dashboard')}>Dashboard</Button>
            ) : (
              <>
                <Button variant="secondary" onClick={() => setShowSignIn(true)}>Login</Button>
                <Button onClick={() => setShowSignUp(true)}>Register</Button>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              Academic Portal 2024/25
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Find Your Perfect Final Year Project
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Our AI-powered engine matches your skills with vetted project topics from top institutions.
            </p>
            <div className="flex gap-4">
              <Button size="lg" onClick={() => isSignedIn ? navigate('/recommendations') : setShowSignUp(true)}>
                Explore Topics
              </Button>
              <Button size="lg" variant="secondary">
                How it works
              </Button>
            </div>
          </div>
          <div className="bg-gradient-to-br from-primary to-primary-700 rounded-lg h-96 flex items-center justify-center text-white">
            <div className="text-center">
              <div className="text-6xl font-bold mb-4">30+</div>
              <p className="text-lg">Topics Ready</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-20 border-t border-muted">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-center mb-16">Engineered for Success</h3>
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 text-2xl">
                🤖
              </div>
              <h4 className="font-bold text-lg mb-2">AI-Powered Matching</h4>
              <p className="text-gray-600">Algorithms analyze your interests to suggest perfect topics</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 text-2xl">
                ✓
              </div>
              <h4 className="font-bold text-lg mb-2">Vetted Topics</h4>
              <p className="text-gray-600">All projects verified by faculty and industry partners</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 text-2xl">
                ⚡
              </div>
              <h4 className="font-bold text-lg mb-2">Quick Matching</h4>
              <p className="text-gray-600">Get recommendations in seconds</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-muted py-8 mt-20">
        <div className="max-w-6xl mx-auto px-6 text-center text-gray-600">
          <p>© 2024 ProjectMatch. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}