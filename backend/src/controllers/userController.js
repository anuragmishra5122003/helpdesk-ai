const prisma = require('../lib/prisma')
const bcrypt = require('bcryptjs')

// GET ALL USERS (admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { tickets: true } }
      },
      orderBy: { createdAt: 'desc' }
    })
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// GET SINGLE USER (admin only)
const getUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.id) },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        tickets: {
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
            createdAt: true
          }
        }
      }
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json(user)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// UPDATE USER ROLE (admin only)
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body

    const user = await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: { role },
      select: { id: true, name: true, email: true, role: true }
    })

    res.json(user)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

// DELETE USER (admin only)
const deleteUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.id) }
    })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    await prisma.user.delete({ where: { id: parseInt(req.params.id) } })

    res.json({ message: 'User deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
}

module.exports = { getAllUsers, getUser, updateUserRole, deleteUser }