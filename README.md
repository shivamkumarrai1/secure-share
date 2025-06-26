# 🔐 Secure Secret Sharing Platform

> Live App: (https://secure-share-nine.vercel.app)

A full-stack secure platform that enables users to share secrets with features like:
- 🔐 One-time access
- ⏰ Expiry duration
- 🔑 Optional password protection
- 👤 Authenticated user access
- 📜 Searchable dashboard

---

## 🚀 Tech Stack

- **Frontend**: Next.js (TypeScript), React, MUI
- **Backend**: Next.js API Routes, NextAuth.js
- **Database**: PostgreSQL via Prisma ORM (hosted on Render)
- **Authentication**: Credentials-based using NextAuth.js + bcrypt
- **Deployment**: Vercel (frontend), Render (database)

---

## ✨ Features

- Users can create secrets with:
  - Optional password protection
  - One-time access option
  - Expiry settings (e.g., 1 hour, 24 hours, etc.)
- Users can view and delete their secrets from the dashboard
- Secrets become inaccessible after viewing (if one-time) or upon expiry
- Only the owner can manage their secrets
- Fully responsive UI with Material UI

---

## 🔐 Environment Variables

Create a `.env` file in the root:

```env
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db>?schema=public
NEXTAUTH_SECRET=your_super_secret_key
NEXTAUTH_URL=https://secure-share-nine.vercel.app
💡 Use https://generate-secret.vercel.app/32 to generate a strong NEXTAUTH_SECRET.

🧪 Running Locally

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Push DB schema (with optional seed data)
npx prisma db push

# Start dev server
npm run dev
Make sure your .env file is correctly configured with a working PostgreSQL URL (e.g., from Render).

🗄️ PostgreSQL on Render Setup
Go to https://render.com

Create a new PostgreSQL instance

Copy the DATABASE_URL

Add it to your .env and Vercel Environment Variables

☁️ Deployment Instructions
📦 Deploying on Vercel
Push your project to GitHub

Go to https://vercel.com

Import your GitHub repository

Set the following environment variables in Vercel:

DATABASE_URL

NEXTAUTH_SECRET

NEXTAUTH_URL=https://secure-share-nine.vercel.app

Make sure you have run npx prisma generate and npx prisma db push locally before deploying.

📁 Folder Structure Overview

.
├── prisma/
│   └── schema.prisma      # DB schema definition
├── src/
│   ├── pages/
│   │   ├── api/           # Next.js API Routes
│   │   ├── auth/          # Signin and Signup pages
│   │   ├── dashboard.tsx  # Authenticated secrets dashboard
│   │   └── index.tsx      # Landing Page
│   ├── components/
│   │   └── SecretForm.tsx # Form to create secrets
│   ├── server/
│   │   ├── auth/          # NextAuth config
│   │   └── db.ts          # Prisma client
│   └── env.js             # Optional: environment loader
└── .env                   # Environment variables

🛡️ Security Notes
Secrets are hashed and stored securely

Passwords are hashed with bcrypt

One-time and expiry features are strictly enforced

All API routes check authenticated sessions using NextAuth
