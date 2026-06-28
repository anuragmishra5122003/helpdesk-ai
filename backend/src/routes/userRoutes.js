const express = require('express')
const router = express.Router()
const {
  getAllUsers,
  getUser,
  updateUserRole,
  deleteUser
} = require('../controllers/userController')
const { protect, adminOnly } = require('../middleware/auth')

router.use(protect)
router.use(adminOnly)

router.get('/', getAllUsers)
router.get('/:id', getUser)
router.put('/:id/role', updateUserRole)
router.delete('/:id', deleteUser)

module.exports = router