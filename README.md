# Prompt Book 📚

A production-ready web application for securely storing, searching, and managing AI prompts. Built with Next.js 14, MongoDB, and AES-256 encryption.

## 🚀 Features

- **Secure Authentication**: JWT-based auth with HTTP-only cookies.
- **AES-256 Encryption**: Sensitive prompt content is encrypted before saving to the database.
- **Search & Filter**: Find prompts by title, category, or favorites.
- **Clean Architecture**: Modular code organization with clear separation of concerns.
- **Responsive UI**: Modern, minimal interface built with TailwindCSS and Lucide-React.
- **Validation**: Strict input validation using Zod.

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router) + TailwindCSS
- **Backend**: Next.js API Routes (Serverless)
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT stored in HTTP-only cookies
- **Password Security**: Bcrypt hashing
- **Encryption**: AES-256-CBC (Node.js `crypto` module)
- **Validation**: Zod

## 📂 Project Structure

```text
prompt-book/
├── app/                  # App Router pages and API routes
├── components/           # Reusable React components
├── lib/                  # Core utilities (DB, JWT, Crypto)
├── models/               # Mongoose database models
├── middleware/           # Auth utilities
├── utils/                # Validation and error handling
├── .env.example          # Environment variables template
└── README.md             # Project documentation
```

## 🔐 Security Practices

1. **Sensitive Data Encryption**: All prompt contents are encrypted using AES-256-CBC with a unique IV for each entry.
2. **Secure Auth**: Passwords are never stored in plain text (Bcrypt). JWTs are stored in `httpOnly`, `secure`, `sameSite: strict` cookies to prevent XSS and CSRF.
3. **Ownership Checks**: Every API request validates that the user owns the prompt they are trying to access/modify.
4. **Input Sanitization**: Zod schemas ensure only valid data enters the system.

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd prompt-book
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env` and fill in your values.
   ```bash
   cp .env.example .env
   ```
   **Important**: `ENCRYPTION_KEY` must be exactly 32 characters long.

4. Run the development server:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📄 API Endpoints

### Auth
- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Login and receive an HTTP-only cookie.

### Prompts
- `GET /api/prompts`: List all user prompts (with pagination, search, filters).
- `POST /api/prompts`: Create a new prompt.
- `GET /api/prompts/:id`: Get a single prompt by ID.
- `PUT /api/prompts/:id`: Update a prompt.
- `DELETE /api/prompts/:id`: Delete a prompt.

## 🚢 Deployment

The easiest way to deploy this app is using [Vercel](https://vercel.com/new).

1. Connect your GitHub repository.
2. Add the environment variables from your `.env` file to the Vercel project settings.
3. Deploy!

## 📜 License

This project is licensed under the MIT License.
