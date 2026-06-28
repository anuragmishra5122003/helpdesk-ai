import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'CUSTOMER' })
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await register(form.name, form.email, form.password, form.role)
      toast.success('Account created')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', background: '#111', border: '1px solid #222', color: '#fff',
    padding: '10px 12px', fontSize: '13px', outline: 'none', boxSizing: 'border-box',
    fontFamily: 'Inter, sans-serif'
  }

  const labelStyle = {
    display: 'block', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px',
    color: '#555', letterSpacing: '0.1em', marginBottom: '8px'
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

        <div style={{ border: '1px solid #1F1F1F', background: '#0D0D0D', padding: '40px' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#F5A623', letterSpacing: '0.12em', marginBottom: '8px' }}>CREATE ACCOUNT</div>
          <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 32px', letterSpacing: '-0.02em' }}>Get started</h2>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>FULL NAME</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
                placeholder="Anurag Mishra"
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>EMAIL</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
                placeholder="you@example.com"
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={labelStyle}>PASSWORD</label>
              <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
                placeholder="••••••••"
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: '32px' }}>
              <label style={labelStyle}>ROLE</label>
              <select
                value={form.role}
                onChange={e => setForm({ ...form, role: e.target.value })}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                <option value="CUSTOMER">Customer</option>
                <option value="AGENT">Agent</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', background: loading ? '#333' : '#F5A623', color: loading ? '#666' : '#000',
                border: 'none', padding: '12px', fontSize: '13px', fontWeight: 700,
                fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.05em',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'CREATING...' : 'CREATE ACCOUNT'}
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: '#444' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#F5A623', textDecoration: 'none' }}>Sign in</Link>
        </div>
      </div>
    </div>
  )
}