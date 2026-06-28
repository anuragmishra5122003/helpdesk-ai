const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')

dotenv.config()

const authRoutes = require('./routes/authRoutes')
const ticketRoutes = require('./routes/ticketRoutes')
const userRoutes = require('./routes/userRoutes')
const messageRoutes = require('./routes/messageRoutes')
const aiRoutes = require('./routes/aiRoutes')
const { startJobs } = require('./lib/jobs')

const app = express()

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}))
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'HelpDesk AI API is running 🚀' })
})

app.use('/api/auth', authRoutes)
app.use('/api/tickets', ticketRoutes)
app.use('/api/users', userRoutes)
app.use('/api/tickets/:id/messages', messageRoutes)
app.use('/api/ai', aiRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  startJobs()
})