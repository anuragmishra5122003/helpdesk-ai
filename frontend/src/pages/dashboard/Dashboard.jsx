import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../api/axios'
import { Ticket, Users, LogOut, LayoutDashboard, ChevronRight, AlertCircle, Menu, X } from 'lucide-react'
import toast from 'react-hot-toast'

const statusBar = (status) => {
  const colors = { OPEN: '#F5A623', IN_PROGRESS: '#3B82F6', RESOLVED: '#22C55E', CLOSED: '#444' }
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
  const [sidebarOpen, setSidebarOpen] = useState(false)

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

  const handleLogout = () => { logout(); navigate('/login') }

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard', active: true },
    { icon: Ticket, label: 'Tickets', to: '/tickets' },
    ...(user?.role === 'ADMIN' ? [{ icon: Users, label: 'Users', to: '/users' }] : [])
  ]

  const Sidebar = () => (
    <aside style={{
      width: '220px', borderRight: '1px solid #1F1F1F', display: 'flex',
      flexDirection: 'column', padding: '24px 0', flexShrink: 0,
      background: '#0A0A0A', height: '100vh'
    }}>
      <div style={{ padding: '0 20px 32px', borderBottom: '1px solid #1F1F1F' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', background: '#F5A623', borderRadius: '50%' }} />
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: 700, letterSpacing: '0.05em', color: '#fff' }}>HELPDESK</span>
          </div>
          <div style={{ display: 'none' }} className="mobile-close">
            <X size={18} color="#666" style={{ cursor: 'pointer' }} onClick={() => setSidebarOpen(false)} />
          </div>
        </div>
        <div style={{ fontSize: '11px', color: '#444', marginTop: '4px', fontFamily: 'JetBrains Mono, monospace' }}>AI-POWERED</div>
      </div>
      <nav style={{ padding: '16px 12px', flex: 1 }}>
        {navItems.map(({ icon: Icon, label, to, active }) => (
          <Link key={to} to={to} style={{ textDecoration: 'none' }} onClick={() => setSidebarOpen(false)}>
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
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0A0A', color: '#fff', fontFamily: 'Inter, sans-serif' }}>

      {/* Desktop Sidebar */}
      <div style={{ display: 'none' }} className="desktop-sidebar">
        <Sidebar />
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 50, display: 'flex'
        }}>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)' }} onClick={() => setSidebarOpen(false)} />
          <div style={{ position: 'relative', zIndex: 51 }}>
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content */}
      <main style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

        {/* Top navbar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 24px', borderBottom: '1px solid #1F1F1F', background: '#0A0A0A',
          position: 'sticky', top: 0, zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => setSidebarOpen(true)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex' }}>
              <Menu size={20} color="#666" />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '8px', height: '8px', background: '#F5A623', borderRadius: '50%' }} />
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: 700, letterSpacing: '0.05em' }}>HELPDESK</span>
            </div>
          </div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#555' }}>{user?.name?.toUpperCase()}</div>
        </div>

        <div style={{ padding: '24px 20px', flex: 1 }}>
          {/* Header */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#F5A623', letterSpacing: '0.1em', marginBottom: '6px' }}>OVERVIEW</div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>Dashboard</h1>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1px', background: '#1F1F1F', border: '1px solid #1F1F1F', marginBottom: '32px' }}>
            {[
              { label: 'TOTAL', value: stats.total, color: '#fff' },
              { label: 'OPEN', value: stats.open, color: '#F5A623' },
              { label: 'IN PROGRESS', value: stats.inProgress, color: '#3B82F6' },
              { label: 'RESOLVED', value: stats.resolved, color: '#22C55E' },
            ].map(({ label, value, color }) => (
              <div key={label} style={{ background: '#0A0A0A', padding: '20px 24px' }}>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#555', letterSpacing: '0.12em', marginBottom: '10px' }}>{label}</div>
                <div style={{ fontSize: '36px', fontWeight: 800, color, letterSpacing: '-0.03em', lineHeight: 1 }}>{value}</div>
              </div>
            ))}
          </div>

          {/* Recent Tickets */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
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
                        display: 'flex', alignItems: 'center', gap: '12px',
                        padding: '14px 16px',
                        borderBottom: i < recentTickets.length - 1 ? '1px solid #1A1A1A' : 'none',
                        borderLeft: `3px solid ${statusBar(ticket.status)}`,
                        cursor: 'pointer'
                      }}
                        onMouseEnter={e => e.currentTarget.style.background = '#111'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#444', minWidth: '28px' }}>#{ticket.id}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '13px', color: '#fff', fontWeight: 500, marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ticket.title}</div>
                          <div style={{ fontSize: '11px', color: '#555' }}>{ticket.user?.name} · {new Date(ticket.createdAt).toLocaleDateString()}</div>
                        </div>
                        <div style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', color: p.color, flexShrink: 0 }}>{p.label}</div>
                      </div>
                    </Link>
                  )
                })
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}