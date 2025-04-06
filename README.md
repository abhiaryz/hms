# Next.js Authentication with MongoDB

This project provides a complete authentication system using Next.js, MongoDB, and NextAuth.js.

## Features

- User registration and login
- Protected routes
- MongoDB integration
- TypeScript support
- Tailwind CSS for styling

## Getting Started

### Prerequisites

- Node.js 18.x or later
- MongoDB database (Atlas or local)

### Installation

1. Clone this repository:

```bash
git clone <repository-url>
cd auth
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your MongoDB connection string and NextAuth secret.

4. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `/src/app`: Next.js App Router pages
- `/src/components`: Reusable React components
- `/src/lib`: Utility functions (MongoDB connection)
- `/src/models`: MongoDB/Mongoose models
- `/src/app/api`: API routes

## Authentication Flow

1. User registers via `/register` page
2. User logs in via `/login` page
3. NextAuth.js creates a session
4. Protected pages check session status

## Environment Variables

- `MONGODB_URI`: MongoDB connection string
- `NEXTAUTH_SECRET`: Secret key for NextAuth.js
- `NEXTAUTH_URL`: Base URL of your application (for authentication callbacks)

## License

This project is licensed under the MIT License. 