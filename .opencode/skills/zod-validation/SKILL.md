---
name: zod-validation
description: Implements robust TypeScript runtime validation using Zod schemas for API responses, web forms, and system configurations. Enforces safeParse patterns, data coercion, complex refinements, and integration with React Hook Form.
license: MIT
compatibility: opencode
metadata:
  category: validation
  stack: Zod, TypeScript, React Hook Form, Next.js
---

## What I do
- Define Zod schemas for API inputs, forms, and environment variables
- Derive TypeScript types from schemas with z.infer
- Implement safeParse for graceful error handling
- Create complex cross-field validation with refinements
- Integrate Zod with React Hook Form for form validation
- Handle data coercion and transformation

## When to use me
Use this skill when implementing form validation, API input validation, or environment variable validation. Ensures single source of truth between runtime validation and static types.

## Key Patterns
- Use z.infer to derive types from schemas
- Prefer safeParse over parse for user-facing inputs
- Use refinements for complex cross-field validation
- Coerce data types for URL parameters and form data
- Integrate with React Hook Form via @hookform/resolvers
- Validate environment variables at application startup
