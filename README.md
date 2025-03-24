# Productivity Dashboard

A comprehensive productivity dashboard with task management, habit tracking, and health monitoring.

## Features

- Task Management
- Pomodoro Timer
- Habit Tracking
- Calendar
- Quick Notes
- Work Mode
- Position Tracking
- Mood Tracking
- And more!

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- NextAuth.js
- Drizzle ORM
- Neon PostgreSQL (Serverless)
- Upstash Redis (Serverless)

## Security Features

- Row-Level Security (RLS) for data isolation
- Rate limiting for API endpoints
- Input validation and sanitization
- Password strength validation
- Two-factor authentication
- API key management
- Comprehensive logging
- CSRF protection
- Security headers

## Getting Started

### Prerequisites

- Node.js 18+
- Neon PostgreSQL account
- Upstash Redis account

### Installation

1. Clone the repository:

\`\`\`bash
git clone https://github.com/yourusername/productivity-dashboard.git
cd productivity-dashboard
\`\`\`

2. Install dependencies:

\`\`\`bash
npm install
\`\`\`

3. Set up environment variables:

Create a `.env` file in the root directory with the following variables:

\`\`\`
DATABASE_URL=your_neon_postgres_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
UPSTASH_REDIS_REST_URL=your_upstash_redis_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_redis_token
\`\`\`

4. Push the database schema:

\`\`\`bash
npx drizzle-kit push
\`\`\`

5. Set up Row-Level Security:

\`\`\`bash
npm run setup-rls
\`\`\`

6. Start the development server:

\`\`\`bash
npm run dev
\`\`\`

## Database Management

### Migrations

Generate migrations:

\`\`\`bash
npx drizzle-kit generate
\`\`\`

Apply migrations:

\`\`\`bash
npx drizzle-kit migrate
\`\`\`

### Row-Level Security

The application uses PostgreSQL's Row-Level Security (RLS) to ensure that users can only access their own data. This is enforced at the database level for maximum security.

To set up RLS:

\`\`\`bash
npm run setup-rls
\`\`\`

## API Documentation

### Authentication

The API supports two authentication methods:

1. Session-based authentication (for web app)
2. API key authentication (for external integrations)

### API Keys

You can manage API keys through the web interface or via the API:

- `GET /api/user/api-keys` - List all API keys
- `POST /api/user/api-keys` - Create a new API key
- `DELETE /api/user/api-keys/:id` - Revoke an API key

### Rate Limiting

API endpoints are rate-limited to prevent abuse. The limits vary by endpoint:

- Authentication endpoints: 10 requests per minute
- Regular API endpoints: 100 requests per minute

## Security Best Practices

1. **Data Isolation**: Each user's data is isolated using Row-Level Security at the database level.
2. **Password Security**: Passwords are hashed using bcrypt and validated for strength.
3. **Two-Factor Authentication**: Users can enable 2FA for additional security.
4. **API Security**: Rate limiting, input validation, and proper error handling.
5. **Logging**: Comprehensive logging for security events and errors.

