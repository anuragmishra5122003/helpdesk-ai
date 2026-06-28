const express = require('express')
const router = express.Router({ mergeParams: true })
const { addMessage, getMessages } = require('../controllers/messageController')
const { protect } = require('../middleware/auth')

router.use(protect)

router.get('/', getMessages)
router.post('/', addMessage)

module.exports = router