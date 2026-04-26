---
name: better-auth-setup
description: Configures a complete, secure authentication system using better-auth with social login, RBAC, and Drizzle ORM integration. Automates auth routes, client-side hooks, server-side guards, and UI scaffolding for sign-in, sign-up, and account management.
license: MIT
compatibility: opencode
metadata:
  category: auth
  stack: Better Auth, Next.js, Drizzle ORM, PostgreSQL
---

## What I do
- Set up better-auth with email/password and OAuth providers (Google, GitHub)
- Generate database schema for auth tables using Drizzle ORM
- Create secure server-side auth guards and client-side session hooks
- Scaffold UI components for sign-in, sign-up, and account management
- Configure role-based access control (RBAC) and email verification
- Implement middleware for route protection

## When to use me
Use this skill when implementing or modifying authentication flows, adding OAuth providers, setting up RBAC, or creating auth-related UI components. Ensure PostgreSQL and Drizzle ORM are configured first.

## Key Patterns
- Use getUser() from src/lib/auth.ts for session checks
- Implement middleware for redirecting unauthenticated users
- Return { success: boolean, error?: string } from Server Actions
- Never throw errors in UI components
- Store auth data in PostgreSQL (no managed auth services)
