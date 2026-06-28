import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import { LayoutDashboard, Ticket, Users as UsersIcon, LogOut, Trash2, Menu } from 'lucide-react'
import toast from 'react-hot-toast'

const roleColor = (role) => {
  const colors = { ADMIN: '#EF4444', AGENT: '#7C3AED', CUSTOMER: '#555' }
  return colors[role] || '#555'
}

export default function Users() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => { fetchUsers() }, [])

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users')
      setUsers(res.data)
    } catch {
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const updateRole = async (id, role) => {
    try {
      await api.put(`/users/${id}/role`, { role })
      toast.success('Role updated')
      fetchUsers()
    } catch {
      toast.error('Failed to update role')
    }
  }

  const deleteUser = async (id) => {
    if (!confirm('Delete this user?')) return
    try {
      await api.delete(`/users/${id}`)
      toast.success('User deleted')
      fetchUsers()
    } catch {
      toast.error('Failed to delete user')
    }
  }

  const handleLogout = () => { logout(); navigate('/login') }

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', to: '/dashboard' },
    { icon: Ticket, label: 'Tickets', to: '/tickets' },
    { icon: UsersIcon, label: 'Users', to: '/users', active: true }
  ]

  const Sidebar = () => (
    <aside style={{
      width: '220px', borderRight: '1px solid #1F1F1F', display: 'flex',
      flexDirection: 'column', padding: '24px 0', flexShrink: 0,
      background: '#0A0A0A', height: '100vh'
    }}>
      <div style={{ padding: '0 20px 32px', borderBottom: '1px solid #1F1F1F' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '8px', height: '8px', background: '#F5A623', borderRadius: '50%' }} />
          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: 700, letterSpacing: '0.05em', color: '#fff' }}>HELPDESK</span>
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

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex' }}>
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)' }} onClick={() => setSidebarOpen(false)} />
          <div style={{ position: 'relative', zIndex: 51 }}>
            <Sidebar />
          </div>
        </div>
      )}

      <main style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

        {/* Top navbar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 24px', borderBottom: '1px solid #1F1F1F',
          background: '#0A0A0A', position: 'sticky', top: 0, zIndex: 10
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
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#555' }}>ADMIN</div>
        </div>

        <div style={{ padding: '24px 16px', flex: 1 }}>
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#F5A623', letterSpacing: '0.1em', marginBottom: '6px' }}>ADMIN</div>
            <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0, letterSpacing: '-0.02em' }}>Users</h1>
          </div>

          <div style={{ border: '1px solid #1F1F1F' }}>
            {loading ? (
              <div style={{ padding: '48px', textAlign: 'center', color: '#444', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}>LOADING...</div>
            ) : (
              users.map((u, i) => (
                <div key={u.id} style={{
                  padding: '16px', borderBottom: i < users.length - 1 ? '1px solid #141414' : 'none',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = '#0D0D0D'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 500, marginBottom: '2px' }}>{u.name}</div>
                      <div style={{ fontSize: '12px', color: '#555' }}>{u.email}</div>
                    </div>
                    <button onClick={() => deleteUser(u.id)} style={{
                      background: 'transparent', border: '1px solid #1F1F1F', color: '#444',
                      padding: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center'
                    }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#EF4444'; e.currentTarget.style.color = '#EF4444' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#1F1F1F'; e.currentTarget.style.color = '#444' }}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: roleColor(u.role) }}>{u.role}</span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#444' }}>{u._count?.tickets} tickets</span>
                    <select
                      value={u.role}
                      onChange={e => updateRole(u.id, e.target.value)}
                      style={{
                        background: '#111', border: '1px solid #222', color: '#fff',
                        padding: '5px 8px', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace',
                        cursor: 'pointer', outline: 'none', marginLeft: 'auto'
                      }}
                    >
                      <option value="CUSTOMER">CUSTOMER</option>
                      <option value="AGENT">AGENT</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}