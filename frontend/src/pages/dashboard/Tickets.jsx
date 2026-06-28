import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import { LayoutDashboard, Ticket, Users, LogOut, Plus, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const priorityLabel = (priority) => {
  const map = {
    LOW: { label: 'LOW', color: '#555' },
    MEDIUM: { label: 'MED', color: '#3B82F6' },
    HIGH: { label: 'HIGH', color: '#F5A623' },
    URGENT: { label: 'URGENT', color: '#EF4444' }
  }
  return map[priority] || map.MEDIUM
}

const statusColor = (status) => {
  const colors = {
    OPEN: '#F5A623',
    IN_PROGRESS: '#3B82F6',
    RESOLVED: '#22C55E',
    CLOSED: '#444'
  }
  return colors[status] || '#444'
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

export default function Tickets() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', body: '', priority: 'MEDIUM' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => { fetchTickets() }, [])

  const fetchTickets = async () => {
    try {
      const res = await api.get('/tickets')
      setTickets(res.data)
    } catch {
      toast.error('Failed to load tickets')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.post('/tickets', form)
      toast.success('Ticket created')
      setShowForm(false)
      setForm({ title: '', body: '', priority: 'MEDIUM' })
      fetchTickets()
    } catch {
      toast.error('Failed to create ticket')
    } finally {
      setSubmitting(false)
    }
  }

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0A0A', color: '#fff', fontFamily: 'Inter, sans-serif' }}>

      {/* Sidebar */}
      <aside style={{ width: '220px', borderRight: '1px solid #1F1F1F', display: 'flex', flexDirection: 'column', padding: '24px 0', flexShrink: 0 }}>
        <div style={{ padding: '0 20px 32px', borderBottom: '1px solid #1F1F1F' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', background: '#F5A623', borderRadius: '50%' }} />
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: 700, letterSpacing: '0.05em', color: '#fff' }}>HELPDESK</span>
          </div>
          <div style={{ fontSize: '11px', color: '#444', marginTop: '4px', fontFamily: 'JetBrains Mono, monospace' }}>AI-POWERED</div>
        </div>
        <nav style={{ padding: '16px 12px', flex: 1 }}>
          {[
            { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
            { icon: Ticket, label: 'Tickets', to: '/tickets', active: true },
            ...(user?.role === 'ADMIN' ? [{ icon: Users, label: 'Users', to: '/users' }] : [])
          ].map(({ icon: Icon, label, to, active }) => (
            <Link key={to} to={to} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px',
                borderRadius: '4px', marginBottom: '2px',
                background: active ? '#1A1A1A' : 'transparent',
                borderLeft: active ? '2px solid #F5A623' : '2px solid transparent',
                color: active ? '#fff' : '#666', fontSize: '13px', cursor: 'pointer'
              }}>
                <Icon size={15} />{label}
              </div>
            </Link>
          ))}
        </nav>
        <div style={{ padding: '16px 12px', borderTop: '1px solid #1F1F1F' }}>
          <div style={{ fontSize: '12px', color: '#555', marginBottom: '8px', padding: '0 12px', fontFamily: 'JetBrains Mono, monospace' }}>{user?.name?.toUpperCase()}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', color: '#666', fontSize: '13px', cursor: 'pointer' }} onClick={handleLogout}>
            <LogOut size={15} />Sign out
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: '40px 48px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '40px' }}>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#F5A623', letterSpacing: '0.1em', marginBottom: '8px' }}>SUPPORT</div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>Tickets</h1>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: showForm ? '#1A1A1A' : '#F5A623',
              color: showForm ? '#666' : '#000',
              border: showForm ? '1px solid #333' : 'none',
              padding: '10px 18px', fontSize: '12px', fontWeight: 700,
              fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.05em',
              cursor: 'pointer'
            }}
          >
            {showForm ? <><X size={14} /> CANCEL</> : <><Plus size={14} /> NEW TICKET</>}
          </button>
        </div>

        {/* Create Form */}
        {showForm && (
          <div style={{ border: '1px solid #1F1F1F', background: '#0D0D0D', padding: '32px', marginBottom: '32px' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#F5A623', letterSpacing: '0.12em', marginBottom: '24px' }}>NEW TICKET</div>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>TITLE</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required placeholder="Brief description of the issue" style={inputStyle} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>DESCRIPTION</label>
                <textarea value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} required placeholder="Detailed description..." rows={4}
                  style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
              <div style={{ marginBottom: '28px' }}>
                <label style={labelStyle}>PRIORITY</label>
                <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })} style={{ ...inputStyle, cursor: 'pointer' }}>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                  <option value="URGENT">Urgent</option>
                </select>
              </div>
              <button type="submit" disabled={submitting} style={{
                background: submitting ? '#333' : '#F5A623', color: submitting ? '#666' : '#000',
                border: 'none', padding: '11px 24px', fontSize: '12px', fontWeight: 700,
                fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.05em', cursor: submitting ? 'not-allowed' : 'pointer'
              }}>
                {submitting ? 'CREATING...' : 'CREATE TICKET'}
              </button>
            </form>
          </div>
        )}

        {/* Tickets List */}
        <div style={{ border: '1px solid #1F1F1F' }}>
          {/* Table header */}
          <div style={{ display: 'grid', gridTemplateColumns: '48px 1fr 80px 80px 100px', gap: '16px', padding: '10px 20px', borderBottom: '1px solid #1F1F1F' }}>
            {['ID', 'TITLE', 'CATEGORY', 'PRIORITY', 'STATUS'].map(h => (
              <div key={h} style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#444', letterSpacing: '0.1em' }}>{h}</div>
            ))}
          </div>

          {loading ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#444', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}>LOADING...</div>
          ) : tickets.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center', color: '#444', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}>NO TICKETS — CREATE YOUR FIRST ONE</div>
          ) : (
            tickets.map((ticket, i) => {
              const p = priorityLabel(ticket.priority)
              return (
                <Link to={`/tickets/${ticket.id}`} key={ticket.id} style={{ textDecoration: 'none' }}>
                  <div
                    style={{
                      display: 'grid', gridTemplateColumns: '48px 1fr 80px 80px 100px', gap: '16px',
                      padding: '14px 20px', borderBottom: i < tickets.length - 1 ? '1px solid #141414' : 'none',
                      borderLeft: `3px solid ${statusColor(ticket.status)}`, cursor: 'pointer', alignItems: 'center'
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#111'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#444' }}>#{ticket.id}</div>
                    <div>
                      <div style={{ fontSize: '13px', color: '#fff', fontWeight: 500, marginBottom: '2px' }}>{ticket.title}</div>
                      <div style={{ fontSize: '11px', color: '#555' }}>{ticket.user?.name} · {new Date(ticket.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div style={{ fontSize: '10px', color: '#555', fontFamily: 'JetBrains Mono, monospace' }}>{ticket.category || '—'}</div>
                    <div style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', color: p.color }}>{p.label}</div>
                    <div style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', color: statusColor(ticket.status) }}>{ticket.status.replace('_', ' ')}</div>
                  </div>
                </Link>
              )
            })
          )}
        </div>
      </main>
    </div>
  )
}