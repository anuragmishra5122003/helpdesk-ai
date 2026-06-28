import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'
import { LayoutDashboard, Ticket, Users, LogOut, ArrowLeft, Sparkles, FileText } from 'lucide-react'
import toast from 'react-hot-toast'

const statusColor = (status) => {
  const colors = { OPEN: '#F5A623', IN_PROGRESS: '#3B82F6', RESOLVED: '#22C55E', CLOSED: '#444' }
  return colors[status] || '#444'
}

const priorityColor = (priority) => {
  const colors = { LOW: '#555', MEDIUM: '#3B82F6', HIGH: '#F5A623', URGENT: '#EF4444' }
  return colors[priority] || '#555'
}

export default function TicketDetail() {
  const { id } = useParams()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [ticket, setTicket] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [summarizing, setSummarizing] = useState(false)
  const [suggesting, setSuggesting] = useState(false)
  const [summary, setSummary] = useState('')

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const [ticketRes, msgRes] = await Promise.all([
          api.get(`/tickets/${id}`),
          api.get(`/tickets/${id}/messages`)
        ])
        setTicket(ticketRes.data)
        setMessages(msgRes.data)
        if (ticketRes.data.summary) setSummary(ticketRes.data.summary)
      } catch {
        toast.error('Failed to load ticket')
        navigate('/tickets')
      } finally {
        setLoading(false)
      }
    }
    fetchTicket()
  }, [id])

  const sendMessage = async () => {
    if (!newMessage.trim()) return
    setSending(true)
    try {
      const res = await api.post(`/tickets/${id}/messages`, { body: newMessage })
      setMessages([...messages, res.data])
      setNewMessage('')
      toast.success('Message sent')
    } catch {
      toast.error('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const handleSummarize = async () => {
    setSummarizing(true)
    try {
      const res = await api.post(`/ai/tickets/${id}/summarize`)
      setSummary(res.data.summary)
      toast.success('Summary generated')
    } catch {
      toast.error('Failed to summarize')
    } finally {
      setSummarizing(false)
    }
  }

  const handleSuggestReply = async () => {
    setSuggesting(true)
    try {
      const res = await api.post(`/ai/tickets/${id}/suggest`)
      setNewMessage(res.data.reply)
      toast.success('AI reply ready')
    } catch {
      toast.error('Failed to suggest reply')
    } finally {
      setSuggesting(false)
    }
  }

  const handleLogout = () => { logout(); navigate('/login') }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: '#444' }}>
      LOADING...
    </div>
  )

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

        <Link to="/tickets" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#555', textDecoration: 'none', fontSize: '12px', marginBottom: '32px', fontFamily: 'JetBrains Mono, monospace' }}>
          <ArrowLeft size={12} /> BACK TO TICKETS
        </Link>

        {/* Ticket header */}
        <div style={{ border: '1px solid #1F1F1F', borderLeft: `3px solid ${statusColor(ticket?.status)}`, background: '#0D0D0D', padding: '28px 32px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#444', marginBottom: '8px' }}>#{ticket?.id}</div>
              <h1 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 16px', letterSpacing: '-0.02em' }}>{ticket?.title}</h1>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: statusColor(ticket?.status) }}>{ticket?.status?.replace('_', ' ')}</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: priorityColor(ticket?.priority) }}>{ticket?.priority}</span>
                {ticket?.category && <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#555' }}>{ticket?.category?.toUpperCase()}</span>}
              </div>
              <p style={{ fontSize: '14px', color: '#999', lineHeight: 1.6, margin: '0 0 12px' }}>{ticket?.body}</p>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#444' }}>BY {ticket?.user?.name?.toUpperCase()} · {new Date(ticket?.createdAt).toLocaleDateString()}</div>
            </div>
            <button onClick={handleSummarize} disabled={summarizing} style={{
              display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent',
              border: '1px solid #2A2A2A', color: summarizing ? '#444' : '#888', padding: '8px 14px',
              fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', cursor: summarizing ? 'not-allowed' : 'pointer',
              letterSpacing: '0.05em', flexShrink: 0
            }}>
              <FileText size={12} />
              {summarizing ? 'ANALYZING...' : 'SUMMARIZE'}
            </button>
          </div>

          {summary && (
            <div style={{ marginTop: '20px', padding: '16px', background: '#111', borderLeft: '2px solid #F5A623' }}>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#F5A623', letterSpacing: '0.1em', marginBottom: '8px' }}>AI SUMMARY</div>
              <p style={{ fontSize: '13px', color: '#999', lineHeight: 1.6, margin: 0 }}>{summary}</p>
            </div>
          )}
        </div>

        {/* Messages */}
        <div style={{ border: '1px solid #1F1F1F', background: '#0D0D0D', marginBottom: '24px' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid #1F1F1F' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#555', letterSpacing: '0.1em' }}>MESSAGES · {messages.length}</div>
          </div>
          {messages.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#444', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px' }}>NO MESSAGES YET</div>
          ) : (
            <div style={{ padding: '16px 24px' }}>
              {messages.map((msg, i) => (
                <div key={msg.id} style={{
                  padding: '16px', marginBottom: i < messages.length - 1 ? '12px' : 0,
                  background: msg.isAI ? '#0F0F18' : '#111',
                  borderLeft: `2px solid ${msg.isAI ? '#7C3AED' : '#1F1F1F'}`
                }}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: msg.isAI ? '#7C3AED' : '#444', letterSpacing: '0.1em', marginBottom: '8px' }}>
                    {msg.isAI ? '✦ AI ASSISTANT' : '→ AGENT'} · {new Date(msg.createdAt).toLocaleTimeString()}
                  </div>
                  <p style={{ fontSize: '13px', color: '#ccc', lineHeight: 1.6, margin: 0 }}>{msg.body}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reply */}
        <div style={{ border: '1px solid #1F1F1F', background: '#0D0D0D', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: '#555', letterSpacing: '0.1em' }}>REPLY</div>
            <button onClick={handleSuggestReply} disabled={suggesting} style={{
              display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent',
              border: '1px solid #2A2A2A', color: suggesting ? '#444' : '#7C3AED',
              padding: '6px 12px', fontSize: '10px', fontFamily: 'JetBrains Mono, monospace',
              cursor: suggesting ? 'not-allowed' : 'pointer', letterSpacing: '0.05em'
            }}>
              <Sparkles size={11} />
              {suggesting ? 'THINKING...' : 'AI SUGGEST'}
            </button>
          </div>
          <textarea
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
            placeholder="Type your reply or use AI to suggest one..."
            rows={4}
            style={{
              width: '100%', background: '#111', border: '1px solid #222', color: '#fff',
              padding: '12px', fontSize: '13px', outline: 'none', resize: 'vertical',
              fontFamily: 'Inter, sans-serif', boxSizing: 'border-box', marginBottom: '12px'
            }}
          />
          <button onClick={sendMessage} disabled={sending} style={{
            background: sending ? '#333' : '#F5A623', color: sending ? '#666' : '#000',
            border: 'none', padding: '10px 20px', fontSize: '12px', fontWeight: 700,
            fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.05em', cursor: sending ? 'not-allowed' : 'pointer'
          }}>
            {sending ? 'SENDING...' : 'SEND MESSAGE'}
          </button>
        </div>
      </main>
    </div>
  )
}