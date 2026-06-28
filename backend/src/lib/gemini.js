const Groq = require('groq-sdk')

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

// CLASSIFY TICKET
const classifyTicket = async (title, body) => {
  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'user',
        content: `You are a customer support AI. Analyze this support ticket and respond ONLY with a JSON object, no extra text.

Title: ${title}
Body: ${body}

Respond with this exact JSON format:
{
  "category": "one of: Billing, Technical, Account, General, Bug Report, Feature Request",
  "priority": "one of: LOW, MEDIUM, HIGH, URGENT",
  "reasoning": "one sentence explanation"
}`
      }
    ],
    temperature: 0.3
  })

  const text = completion.choices[0].message.content
  const clean = text.replace(/```json|```/g, '').trim()
  return JSON.parse(clean)
}

// SUMMARIZE TICKET
const summarizeTicket = async (title, body, messages) => {
  const messageText = messages.map(m => `${m.isAI ? 'AI' : 'Agent'}: ${m.body}`).join('\n')

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'user',
        content: `Summarize this customer support ticket in 2-3 sentences. Be concise and factual. Provide only the summary, no extra text.

Title: ${title}
Description: ${body}
Messages: ${messageText || 'No messages yet'}`
      }
    ],
    temperature: 0.3
  })

  return completion.choices[0].message.content.trim()
}

// SUGGEST REPLY
const suggestReply = async (title, body, messages) => {
  const messageText = messages.map(m => `${m.isAI ? 'AI' : 'Human'}: ${m.body}`).join('\n')

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'user',
        content: `You are a helpful customer support agent. Write a professional and empathetic reply to this support ticket. Write only the reply message, no extra text.

Title: ${title}
Description: ${body}
Previous messages: ${messageText || 'None'}`
      }
    ],
    temperature: 0.5
  })

  return completion.choices[0].message.content.trim()
}

module.exports = { classifyTicket, summarizeTicket, suggestReply }