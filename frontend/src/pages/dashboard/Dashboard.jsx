import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'
import { Ticket, Users, LogOut, LayoutDashboard, ChevronRight, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const statusBar = (status) => {
  const colors = {
    OPEN: '#F5A623',
    IN_PROGRESS: '#3B82F6',
    RESOLVED: '#22C55E',
    CLOSED: '#444'
  }
  return colors[status] || '#444'
}

const priorityLabel = (priority) => {
  const map = {
    LOW: { label: 'LOW', color: '#555' },
    MEDIUM: { label: 'MED', color: '#3B82F6' },
    HIGH: { label: 'HIGH', color: '#F5A623' },
    URGENT: { label: 'URGENT', color: '#EF4444' }
  }
  return map[priority] || map.MEDIUM
}

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({ total: 0, open: 0, resolved: 0, inProgress: 0 })
  const [recentTickets, setRecentTickets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/tickets')
        const tickets = res.data
        setStats({
          total: tickets.length,
          open: tickets.filter(t => t.status === 'OPEN').length,
          resolved: tickets.filter(t => t.status === 'RESOLVED').length,
          inProgress: tickets.filter(t => t.status === 'IN_PROGRESS').length
        })
        setRecentTickets(tickets.slice(0, 6))
      } catch {
        toast.error('Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

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
            { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard', active: true },
            { icon: Ticket, label: 'Tickets', to: '/tickets' },
            ...(user?.role === 'ADMIN' ? [{ icon: Users, label: 'Users', to: '/users' }] : [])
          ].map(({ icon: Icon, label, to, active }) => (
            <Link key={to} to={to} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                padding: '9px 12px', borderRadius: '4px', marginBottom: '2px',
                background: active ? '#1A1A1A' : 'transparent',
                borderLeft: active ? '2px solid #F5A623' : '2px solid transparent',
                color: active ? '#fff' : '#666',
                fontSize: '13px', cursor: 'pointer', transition: 'all 0.15s'
              }}>
                <Icon size={15} />
                {label}
              </div>
            </Link>
          ))}
        </nav>

        <div style={{ padding: '16px 12px', borderTop: '1px solid #1F1F1F' }}>
          <div style={{ fontSize: '12px', color: '#555', marginBottom: '8px', padding: '0 12px', fontFamily: 'JetBrains Mono, monospace' }}>
            {user?.name?.toUpperCase()}
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '9px 12px', color: '#666', fontSize: '13px',
            cursor: 'pointer', borderRadius: '4px'
          }} onClick={handleLogout}>
            <LogOut size={15} />
            Sign out
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: '40px 48px', overflowY: 'auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#F5A623', letterSpacing: '0.1em', marginBottom: '8px' }}>OVERVIEW</div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>Dashboard</h1>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: '#1F1F1F', border: '1px solid #1F1F1F', marginBottom: '48px' }}>
          {[
            { label: 'TOTAL', value: stats.total, color: '#fff' },
            { label: 'OPEN', value: stats.open, color: '#F5A623' },
            { label: 'IN PROGRESS', value: stats.inProgress, color: '#3B82F6' },
            { label: 'RESOLVED', value: stats.resolved, color: '#22C55E' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ background: '#0A0A0A', padding: '28px 32px' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#555', letterSpacing: '0.12em', marginBottom: '12px' }}>{label}</div>
              <div style={{ fontSize: '40px', fontWeight: 800, color, letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</div>
            </div>
          ))}
        </div>

        {/* Recent Tickets */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#555', letterSpacing: '0.1em' }}>RECENT TICKETS</div>
            <Link to="/tickets" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#F5A623' }}>
              View all <ChevronRight size={12} />
            </Link>
          </div>

          <div style={{ border: '1px solid #1F1F1F' }}>
            {loading ? (
              <div style={{ padding: '48px', textAlign: 'center', color: '#444', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}>LOADING...</div>
            ) : recentTickets.length === 0 ? (
              <div style={{ padding: '48px', textAlign: 'center', color: '#444' }}>
                <AlertCircle size={24} style={{ marginBottom: '12px', opacity: 0.4 }} />
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}>NO TICKETS YET</div>
              </div>
            ) : (
              recentTickets.map((ticket, i) => {
                const p = priorityLabel(ticket.priority)
                return (
                  <Link to={`/tickets/${ticket.id}`} key={ticket.id} style={{ textDecoration: 'none' }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '16px',
                      padding: '16px 20px',
                      borderBottom: i < recentTickets.length - 1 ? '1px solid #1A1A1A' : 'none',
                      borderLeft: `3px solid ${statusBar(ticket.status)}`,
                      cursor: 'pointer', transition: 'background 0.1s'
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = '#111'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#444', minWidth: '32px' }}>#{ticket.id}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', color: '#fff', fontWeight: 500, marginBottom: '2px' }}>{ticket.title}</div>
                        <div style={{ fontSize: '11px', color: '#555' }}>{ticket.user?.name} · {new Date(ticket.createdAt).toLocaleDateString()}</div>
                      </div>
                      {ticket.category && (
                        <div style={{ fontSize: '10px', color: '#555', fontFamily: 'JetBrains Mono, monospace', background: '#141414', padding: '3px 8px', border: '1px solid #222' }}>
                          {ticket.category.toUpperCase()}
                        </div>
                      )}
                      <div style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', color: p.color, minWidth: '48px', textAlign: 'right' }}>{p.label}</div>
                    </div>
                  </Link>
                )
              })
            )}
          </div>
        </div>
      </main>
    </div>
  )
}