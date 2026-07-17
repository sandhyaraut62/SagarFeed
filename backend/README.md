# SagarFeeds Backend

Express + MySQL backend for the SagarFeeds dealer/farmer network app.

## Setup

1. Install dependencies:

npm install

2. Copy `.env.example` to `.env` and fill in your own values.
3. Run the dev server:

npm run dev

Server starts on `http://localhost:5000` (or whatever `PORT` you set).

## API Endpoints

### Auth — `/api/auth`

| Method | Route | Auth required? | Description |
|---|---|---|---|
| POST | `/register` | No | Create a new account. Body: `fullName, email, phone, role, password` |
| POST | `/login` | No | Log in. Body: `email, password`. Returns a JWT `token` + user info |
| GET | `/me` | Yes | Returns the currently logged-in user's info |

To call a protected route, send the token from login as a header:

Authorization: Bearer <token>

### Contact — `/api/contact`

| Method | Route | Auth required? | Description |
|---|---|---|---|
| POST | `/` | No | Submit a contact form message. Body: `name, email, phone, category, subject, message` |

## Tech stack

- Express 5
- MySQL (via `mysql2`)
- `bcryptjs` for password hashing
- `jsonwebtoken` for login sessions
- `express-validator` for input validation