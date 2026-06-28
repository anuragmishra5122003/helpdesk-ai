# HelpDesk AI

A full-stack AI-powered customer support ticketing system built with Node.js, Express, PostgreSQL, Prisma, React, and Groq AI.

![HelpDesk AI](https://img.shields.io/badge/Stack-PERN-blue) ![AI](https://img.shields.io/badge/AI-Groq%20LLaMA-orange) ![License](https://img.shields.io/badge/License-MIT-green)

## Live Demo

- **Frontend:** https://helpdesk-r64jy4wzc-am364144-4907s-projects.vercel.app
- **Backend API:** https://helpdesk-ai-bt2g.onrender.com
- **GitHub:** https://github.com/anuragmishra5122003/helpdesk-ai

### Test Credentials
- **Email:** anurag@test.com
- **Password:** 123456
- **Role:** Admin (full access)

## Features

- **Authentication** — JWT-based auth with role-based access (Admin, Agent, Customer)
- **Ticket Management** — Full CRUD for support tickets with priority and status tracking
- **AI Summarization** — One-click AI summary of any ticket using Groq LLaMA
- **AI Reply Suggestion** — AI-generated professional reply suggestions for agents
- **Auto-Classification** — AI automatically categorizes and prioritizes tickets on creation
- **Email Notifications** — Automated emails on ticket creation and agent replies
- **Background Jobs** — Auto-close resolved tickets after 24 hours, auto-classify unclassified tickets
- **User Management** — Admin panel to manage users and roles
- **Dark UI** — Sharp, professional dark theme with amber accents

## Tech Stack

### Backend
- Node.js + Express
- PostgreSQL (Neon) + Prisma 7
- JWT Authentication
- Groq AI (LLaMA 3.3 70B)
- Nodemailer + Gmail
- node-cron

### Frontend
- React 19 + Vite
- Tailwind CSS v4
- shadcn/ui
- React Router DOM
- Axios

## Project Structure

```
helpdesk-ai/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── aiController.js
│   │   │   ├── authController.js
│   │   │   ├── messageController.js
│   │   │   ├── ticketController.js
│   │   │   └── userController.js
│   │   ├── lib/
│   │   │   ├── email.js
│   │   │   ├── gemini.js
│   │   │   ├── jobs.js
│   │   │   └── prisma.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── routes/
│   │   │   ├── aiRoutes.js
│   │   │   ├── authRoutes.js
│   │   │   ├── messageRoutes.js
│   │   │   ├── ticketRoutes.js
│   │   │   └── userRoutes.js
│   │   └── index.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── auth/
    │   │   │   ├── Login.jsx
    │   │   │   └── Register.jsx
    │   │   └── dashboard/
    │   │       ├── Dashboard.jsx
    │   │       ├── TicketDetail.jsx
    │   │       ├── Tickets.jsx
    │   │       └── Users.jsx
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

## Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL database (Neon recommended)
- Groq API key
- Gmail account with App Password

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
DATABASE_URL="your-neon-postgresql-url"
JWT_SECRET="your-jwt-secret"
PORT=5000
GROQ_API_KEY="your-groq-api-key"
EMAIL_USER="your-gmail@gmail.com"
EMAIL_PASS="your-gmail-app-password"
```

Run database migrations:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

Start the server:
```bash
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |

### Tickets
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tickets` | Get all tickets |
| POST | `/api/tickets` | Create ticket |
| GET | `/api/tickets/:id` | Get single ticket |
| PUT | `/api/tickets/:id` | Update ticket |
| DELETE | `/api/tickets/:id` | Delete ticket |

### Messages
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tickets/:id/messages` | Get messages |
| POST | `/api/tickets/:id/messages` | Add message |

### AI
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/tickets/:id/summarize` | Summarize ticket |
| POST | `/api/ai/tickets/:id/suggest` | Suggest reply |

### Users (Admin only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get single user |
| PUT | `/api/users/:id/role` | Update user role |
| DELETE | `/api/users/:id` | Delete user |

## Database Schema

```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String
  role      Role     @default(CUSTOMER)
  tickets   Ticket[]
}

model Ticket {
  id        Int      @id @default(autoincrement())
  title     String
  body      String
  status    Status   @default(OPEN)
  priority  Priority @default(MEDIUM)
  category  String?
  summary   String?
  messages  Message[]
  user      User     @relation(fields: [userId], references: [id])
}

model Message {
  id       Int     @id @default(autoincrement())
  body     String
  isAI     Boolean @default(false)
  ticket   Ticket  @relation(fields: [ticketId], references: [id])
}
```

## Roles

| Role | Permissions |
|------|-------------|
| CUSTOMER | Create tickets, view own tickets, send messages |
| AGENT | View all tickets, send messages, use AI features |
| ADMIN | Full access including user management |

## Background Jobs

- **Every 30 minutes** — Auto-classify tickets with no category
- **Every hour** — Auto-close tickets resolved for 24+ hours

## License

MIT
