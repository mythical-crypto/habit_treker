---
name: security-review
description: Conducts comprehensive security audits and implements defensive coding patterns to protect applications from vulnerabilities. Covers OWASP Top 10, input validation, secrets management, XSS/CSRF prevention, and secure authentication flows.
license: MIT
compatibility: opencode
metadata:
  category: security
  stack: Next.js, React, TypeScript, PostgreSQL
---

## What I do
- Audit code for OWASP Top 10 vulnerabilities
- Implement input validation and sanitization with Zod
- Prevent XSS, CSRF, and SQL injection attacks
- Enforce secure authentication and authorization patterns
- Manage secrets and prevent hardcoded credentials
- Provide pre-deployment security checklists

## When to use me
Use this skill when reviewing code for security issues, implementing auth flows, handling user input, or before deploying to production. Essential for any code touching sensitive data.

## Key Patterns
- Validate all user inputs with Zod schemas
- Use parameterized queries (Drizzle ORM) to prevent SQL injection
- Implement CSRF protection for state-changing operations
- Sanitize dynamic HTML content to prevent XSS
- Use secure cookie policies (httpOnly, secure, sameSite)
- Never hardcode secrets or API keys
- Implement rate limiting for auth endpoints
