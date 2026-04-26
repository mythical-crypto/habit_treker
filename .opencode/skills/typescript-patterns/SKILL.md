---
name: typescript-patterns
description: Enforces production-grade TypeScript idioms and strict type-safety patterns across the full stack. Covers strict compiler configs, generic usage, Result types for error handling, React hooks patterns, Zod validation integration, and Node.js server patterns.
license: MIT
compatibility: opencode
metadata:
  category: language
  stack: TypeScript 5.7+, React 19, Node.js
---

## What I do
- Enforce strict TypeScript compiler configuration
- Guide generic usage and advanced type patterns
- Implement Result types and discriminated unions for error handling
- Provide React hooks patterns with proper typing
- Integrate Zod runtime validation with TypeScript inference
- Ensure type-safe API layers and server architecture

## When to use me
Use this skill when writing TypeScript code, refactoring for type safety, implementing error handling, or setting up validation schemas. Prohibits 'any' types and promotes 'satisfies' and branded types.

## Key Patterns
- Derive types from Zod schemas with z.infer
- Use safeParse for graceful error handling
- Implement discriminated unions for exhaustive error handling
- Prefer 'satisfies' over type assertions
- Use strict compiler options: strict, noImplicitAny, strictNullChecks
