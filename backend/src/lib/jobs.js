const cron = require('node-cron')
const prisma = require('./prisma')

const startJobs = () => {

  // JOB 1: Auto-close tickets that have been RESOLVED for more than 24 hours
  // Runs every hour
  cron.schedule('0 * * * *', async () => {
    console.log('Running job: Auto-close resolved tickets...')
    try {
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

      const result = await prisma.ticket.updateMany({
        where: {
          status: 'RESOLVED',
          updatedAt: { lt: twentyFourHoursAgo }
        },
        data: { status: 'CLOSED' }
      })

      console.log(`Auto-closed ${result.count} tickets`)
    } catch (error) {
      console.error('Auto-close job error:', error.message)
    }
  })

  // JOB 2: Auto-classify tickets that have no category
  // Runs every 30 minutes
  cron.schedule('*/30 * * * *', async () => {
    console.log('Running job: Auto-classify unclassified tickets...')
    try {
      const { classifyTicket } = require('./gemini')

      const unclassified = await prisma.ticket.findMany({
        where: { category: null, status: { not: 'CLOSED' } },
        take: 5 // process 5 at a time to avoid rate limits
      })

      for (const ticket of unclassified) {
        try {
          const classification = await classifyTicket(ticket.title, ticket.body)
          await prisma.ticket.update({
            where: { id: ticket.id },
            data: {
              category: classification.category,
              priority: classification.priority
            }
          })
          console.log(`Classified ticket #${ticket.id} as ${classification.category}`)
        } catch (err) {
          console.error(`Failed to classify ticket #${ticket.id}:`, err.message)
        }
      }
    } catch (error) {
      console.error('Classification job error:', error.message)
    }
  })

  console.log('Background jobs started ✅')
}

module.exports = { startJobs }