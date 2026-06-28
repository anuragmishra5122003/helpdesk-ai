const prisma = require('../lib/prisma')
const { sendReplyEmail } = require('../lib/email')

// ADD MESSAGE TO TICKET
const addMessage = async (req, res) => {
  try {
    const { body } = req.body
    const ticketId = parseInt(req.params.id)

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: { user: { select: { id: true, name: true, email: true } } }
    })

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' })
    }

    if (req.user.role === 'CUSTOMER' && ticket.userId !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' })
    }

    const message = await prisma.message.create({
      data: {
        body,
        ticketId,
        isAI: false
      }
    })

    // Send reply email to ticket owner
    sendReplyEmail(ticket, message, ticket.user.email)

    res.status(201).json(message)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// GET ALL MESSAGES FOR A TICKET
const getMessages = async (req, res) => {
  try {
    const ticketId = parseInt(req.params.id)

    const ticket = await prisma.ticket.findUnique({ where: { id: ticketId } })

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' })
    }

    if (req.user.role === 'CUSTOMER' && ticket.userId !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' })
    }

    const messages = await prisma.message.findMany({
      where: { ticketId },
      orderBy: { createdAt: 'asc' }
    })

    res.json(messages)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = { addMessage, getMessages }