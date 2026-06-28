const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

// Send email when ticket is created
const sendTicketCreatedEmail = async (ticket, user) => {
  try {
    await transporter.sendMail({
      from: `"HelpDesk AI" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `[Ticket #${ticket.id}] ${ticket.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #0A0A0A; padding: 24px; text-align: center;">
            <h1 style="color: #F5A623; margin: 0; font-size: 20px;">● HELPDESK AI</h1>
          </div>
          <div style="padding: 32px; background: #f9f9f9;">
            <h2 style="color: #111; margin-top: 0;">Ticket Created Successfully</h2>
            <p style="color: #555;">Your support ticket has been received and will be reviewed shortly.</p>
            <div style="background: #fff; border-left: 4px solid #F5A623; padding: 16px; margin: 24px 0;">
              <p style="margin: 0 0 8px;"><strong>Ticket ID:</strong> #${ticket.id}</p>
              <p style="margin: 0 0 8px;"><strong>Title:</strong> ${ticket.title}</p>
              <p style="margin: 0 0 8px;"><strong>Priority:</strong> ${ticket.priority}</p>
              <p style="margin: 0 0 8px;"><strong>Category:</strong> ${ticket.category || 'General'}</p>
              <p style="margin: 0;"><strong>Status:</strong> ${ticket.status}</p>
            </div>
            <p style="color: #555;"><strong>Your message:</strong></p>
            <p style="color: #333;">${ticket.body}</p>
          </div>
          <div style="background: #0A0A0A; padding: 16px; text-align: center;">
            <p style="color: #555; margin: 0; font-size: 12px;">HelpDesk AI — Powered by Groq</p>
          </div>
        </div>
      `
    })
    console.log(`Email sent to ${user.email} for ticket #${ticket.id}`)
  } catch (error) {
    console.error('Email error:', error.message)
  }
}

// Send email when agent replies
const sendReplyEmail = async (ticket, message, recipientEmail) => {
  try {
    await transporter.sendMail({
      from: `"HelpDesk AI" <${process.env.EMAIL_USER}>`,
      to: recipientEmail,
      subject: `[Ticket #${ticket.id}] New Reply — ${ticket.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #0A0A0A; padding: 24px; text-align: center;">
            <h1 style="color: #F5A623; margin: 0; font-size: 20px;">● HELPDESK AI</h1>
          </div>
          <div style="padding: 32px; background: #f9f9f9;">
            <h2 style="color: #111; margin-top: 0;">New Reply on Your Ticket</h2>
            <p style="color: #555;">Ticket <strong>#${ticket.id}: ${ticket.title}</strong></p>
            <div style="background: #fff; border-left: 4px solid ${message.isAI ? '#7C3AED' : '#F5A623'}; padding: 16px; margin: 24px 0;">
              <p style="margin: 0 0 8px; font-size: 12px; color: #999;">${message.isAI ? '🤖 AI Assistant' : '👤 Support Agent'}</p>
              <p style="margin: 0; color: #333;">${message.body}</p>
            </div>
          </div>
          <div style="background: #0A0A0A; padding: 16px; text-align: center;">
            <p style="color: #555; margin: 0; font-size: 12px;">HelpDesk AI — Powered by Groq</p>
          </div>
        </div>
      `
    })
    console.log(`Reply email sent to ${recipientEmail}`)
  } catch (error) {
    console.error('Email error:', error.message)
  }
}

module.exports = { sendTicketCreatedEmail, sendReplyEmail }