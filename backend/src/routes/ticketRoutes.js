const express = require('express')
const router = express.Router()
const {
  createTicket,
  getAllTickets,
  getTicket,
  updateTicket,
  deleteTicket
} = require('../controllers/ticketController')
const { protect, adminOnly } = require('../middleware/auth')

router.use(protect) // all ticket routes require login

router.get('/', getAllTickets)
router.post('/', createTicket)
router.get('/:id', getTicket)
router.put('/:id', updateTicket)
router.delete('/:id', adminOnly, deleteTicket)

module.exports = router