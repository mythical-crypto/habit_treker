---
name: backend-patterns
description: Implements scalable backend architectures, API design standards, and database optimizations for Node.js and Next.js applications. Covers clean architecture, Repository/Service layers, RESTful API design, caching, and error handling.
license: MIT
compatibility: opencode
metadata:
  category: backend
  stack: Next.js, Node.js, PostgreSQL, Drizzle ORM
---

## What I do
- Implement clean architecture with Repository and Service layers
- Design RESTful API endpoints with proper status codes and error responses
- Optimize database queries and prevent N+1 issues
- Configure caching strategies (Redis, Next.js cache)
- Implement robust error handling with exponential backoff
- Set up structured logging and monitoring

## When to use me
Use this skill when building API routes, designing database schemas, optimizing queries, or implementing server-side logic. Follows Next.js App Router patterns for API handlers.

## Key Patterns
- Use Drizzle relational queries (with) for joins
- Use raw SQL only for complex operations (e.g., streak calculations)
- Return { success: boolean, error?: string } from Server Actions
- Implement rate limiting for sensitive endpoints
- Use transactions for multi-step operations
- Validate all inputs with Zod schemas
