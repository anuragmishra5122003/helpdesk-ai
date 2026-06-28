const express = require('express')
const router = express.Router()
const { summarize, suggest } = require('../controllers/aiController')
const { protect } = require('../middleware/auth')

router.use(protect)

router.post('/tickets/:id/summarize', summarize)
router.post('/tickets/:id/suggest', suggest)

module.exports = router