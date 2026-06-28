const prisma = require('../lib/prisma')
const { summarizeTicket, suggestReply } = require('../lib/gemini')

// SUMMARIZE TICKET
const summarize = async (req, res) => {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { messages: true }
    })

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' })
    }

    const summary = await summarizeTicket(ticket.title, ticket.body, ticket.messages)

    await prisma.ticket.update({
      where: { id: ticket.id },
      data: { summary }
    })

    res.json({ summary })
  } catch (error) {
    console.error('SUMMARIZE ERROR:', error)
    res.status(500).json({ message: 'AI error', error: error.message })
  }
}

// SUGGEST REPLY
const suggest = async (req, res) => {
  try {
    const ticket = await prisma.ticket.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { messages: true }
    })

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' })
    }

    const reply = await suggestReply(ticket.title, ticket.body, ticket.messages)

    res.json({ reply })
  } catch (error) {
    console.error('SUGGEST ERROR:', error)
    res.status(500).json({ message: 'AI error', error: error.message })
  }
}

module.exports = { summarize, suggest }