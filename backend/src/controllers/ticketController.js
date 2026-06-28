const prisma = require('../lib/prisma')
const { sendTicketCreatedEmail } = require('../lib/email')

// CREATE TICKET
const createTicket = async (req, res) => {
  try {
    const { title, body, priority } = req.body
    const { classifyTicket } = require('../lib/gemini')

    let category = null
    let aiPriority = priority || 'MEDIUM'

    try {
      const classification = await classifyTicket(title, body)
      category = classification.category
      aiPriority = priority || classification.priority
    } catch (aiError) {
      console.log('AI classification failed, using defaults')
    }

    const ticket = await prisma.ticket.create({
      data: {
        title,
        body,
        priority: aiPriority,
        category,
        userId: req.user.userId
      },
      include: { user: { select: { id: true, name: true, email: true } } }
    })

    // Send confirmation email
    sendTicketCreatedEmail(ticket, ticket.user)

    res.status(201).json(ticket)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// GET ALL TICKETS
const getAllTickets = async (req, res) => {
  try {
    const { status, priority } = req.query

    const where = {}
    if (status) where.status = status
    if (priority) where.priority = priority

    if (req.user.role === 'CUSTOMER') {
      where.userId = req.user.userId
    }

    const tickets = await prisma.ticket.findMany({
      where,
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    })

    res.json(tickets)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// GET SINGLE TICKET
const getTicket = async (req, res) => {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        user: { select: { id: true, name: true, email: true } },
        messages: true
      }
    })

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' })
    }

    if (req.user.role === 'CUSTOMER' && ticket.userId !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' })
    }

    res.json(ticket)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// UPDATE TICKET
const updateTicket = async (req, res) => {
  try {
    const { title, body, status, priority } = req.body

    const ticket = await prisma.ticket.findUnique({
      where: { id: parseInt(req.params.id) }
    })

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' })
    }

    const updated = await prisma.ticket.update({
      where: { id: parseInt(req.params.id) },
      data: { title, body, status, priority },
      include: { user: { select: { id: true, name: true, email: true } } }
    })

    res.json(updated)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// DELETE TICKET
const deleteTicket = async (req, res) => {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: parseInt(req.params.id) }
    })

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' })
    }

    await prisma.ticket.delete({ where: { id: parseInt(req.params.id) } })

    res.json({ message: 'Ticket deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = { createTicket, getAllTickets, getTicket, updateTicket, deleteTicket }