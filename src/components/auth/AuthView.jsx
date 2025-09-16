import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'

const AuthView = () => {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const { signIn, signUp, resetPassword } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      if (isSignUp) {
        await signUp({ email, password, fullName })
        setMessage('Check your email for the confirmation link!')
      } else {
        await signIn({ email, password })
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    if (!email) {
      setError('Please enter your email address')
      return
    }

    setLoading(true)
    setError('')

    try {
      await resetPassword(email)
      setMessage('Check your email for the password reset link!')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>🛒 PantryPath</h1>
          <p>Smart grocery & kitchen inventory management</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <h2>{isSignUp ? 'Sign Up' : 'Sign In'}</h2>

          {isSignUp && (
            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="Enter your full name"
              />
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              placeholder="Enter your password"
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {message && <div className="success-message">{message}</div>}

          <button
            type="submit"
            disabled={loading}
            className="auth-button primary"
          >
            {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Sign In')}
          </button>

          <div className="auth-links">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="link-button"
            >
              {isSignUp
                ? 'Already have an account? Sign in'
                : "Don't have an account? Sign up"}
            </button>

            {!isSignUp && (
              <button
                type="button"
                onClick={handleForgotPassword}
                className="link-button"
                disabled={loading}
              >
                Forgot your password?
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default AuthView