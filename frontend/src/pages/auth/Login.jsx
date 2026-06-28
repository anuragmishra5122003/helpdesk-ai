import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      toast.success('Welcome back')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '0 24px' }}>

        {/* Logo */}
        <div style={{ marginBottom: '48px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <div style={{ width: '10px', height: '10px', background: '#F5A623', borderRadius: '50%' }} />
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '14px', fontWeight: 700, letterSpacing: '0.1em', color: '#fff' }}>HELPDESK</span>
          </div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#444', letterSpacing: '0.1em' }}>AI-POWERED SUPPORT</div>
        </div>

        {/* Form box */}
        <div style={{ border: '1px solid #1F1F1F', background: '#0D0D0D', padding: '40px' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#F5A623', letterSpacing: '0.12em', marginBottom: '8px' }}>SIGN IN</div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 32px', letterSpacing: '-0.02em', color: '#fff' }}>Welcome back</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#555', letterSpacing: '0.1em', marginBottom: '8px' }}>EMAIL</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                style={{
                  width: '100%', background: '#111', border: '1px solid #222', color: '#fff',
                  padding: '10px 12px', fontSize: '13px', outline: 'none', boxSizing: 'border-box',
                  fontFamily: 'Inter, sans-serif'
                }}
              />
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={{ display: 'block', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#555', letterSpacing: '0.1em', marginBottom: '8px' }}>PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{
                  width: '100%', background: '#111', border: '1px solid #222', color: '#fff',
                  padding: '10px 12px', fontSize: '13px', outline: 'none', boxSizing: 'border-box',
                  fontFamily: 'Inter, sans-serif'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', background: loading ? '#333' : '#F5A623', color: loading ? '#666' : '#000',
                border: 'none', padding: '12px', fontSize: '13px', fontWeight: 700,
                fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.05em',
                cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.15s'
              }}
            >
              {loading ? 'SIGNING IN...' : 'SIGN IN'}
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#444' }}>
          No account?{' '}
          <Link to="/register" style={{ color: '#F5A623', textDecoration: 'none' }}>Create one</Link>
        </div>
      </div>
    </div>
  )
}