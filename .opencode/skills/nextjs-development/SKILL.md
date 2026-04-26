---
name: nextjs-development
description: Builds modern, high-performance web applications using the Next.js App Router, React Server Components, and optimized data fetching patterns. Covers App Router architecture, Server/Client Components balance, nested layouts, Suspense streaming, API route handlers, and SEO optimization.
license: MIT
compatibility: opencode
metadata:
  category: frontend
  stack: Next.js 16, React 19, TypeScript
---

## What I do
- Guide App Router architecture decisions (Server vs Client Components)
- Implement nested layouts, parallel routes, intercepting routes
- Optimize data fetching with caching and revalidation strategies
- Build API route handlers and Server Actions
- Standardize error handling and loading UI with Suspense
- Ensure SEO optimization via Metadata API

## When to use me
Use this skill when working with Next.js App Router, implementing routing patterns, optimizing data fetching, or building API endpoints. Ask clarifying questions if the rendering strategy (SSR/SSG/ISR) is unclear.

## Key Patterns
- Server Components by default; mark 'use client' only for interactivity
- Use Server Actions for form mutations and data updates
- Implement Suspense boundaries for streaming UI
- Optimize images with next/image and fonts with next/font
- Use revalidatePath/revalidateTag for cache invalidation
