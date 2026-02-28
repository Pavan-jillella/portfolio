# Personal Portfolio — Next.js 14 + Framer Motion

A cinematic, Apple-inspired personal brand platform.

## Stack
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** — glassmorphism, custom animations
- **Framer Motion** — scroll animations, hover lifts, page transitions
- **Lenis** — buttery smooth scrolling
- **Syne + DM Sans + JetBrains Mono** — premium typography

## Features
- 🌑 Dark mode default with deep charcoal background
- 🪟 Glassmorphism UI (blur panels, soft transparency)
- ✨ Animated floating background blobs
- 🌟 Grain noise texture overlay
- 🖱️ Custom cursor glow tracking
- 📜 Smooth scrolling via Lenis
- 🎭 Page transition fade animations
- 📊 Animated stat counters
- 📱 Fully responsive / mobile optimized
- 🔍 SEO metadata included
- 🚀 Production-ready folder structure

## Getting Started

```bash
npm install
npm run dev
```

## Customization
- Update `src/lib/utils.ts` — replace BLOG_POSTS and PROJECTS with your real data
- Update `src/app/api/stats/route.ts` — connect real GitHub/LeetCode APIs
- Replace `YN` in Navbar/Footer with your initials
- Update all metadata in `src/app/layout.tsx`

## Folder Structure
```
src/
├── app/
│   ├── api/stats/route.ts     # GitHub + LeetCode stats API
│   ├── globals.css            # Base styles, glass utilities
│   ├── layout.tsx             # Root layout + SEO metadata
│   └── page.tsx               # Home page
├── components/
│   ├── sections/              # Full-page sections
│   │   ├── BlogSection.tsx
│   │   ├── Footer.tsx
│   │   ├── HeroSection.tsx
│   │   ├── PhilosophySection.tsx
│   │   ├── ProjectsSection.tsx
│   │   ├── StatsSection.tsx
│   │   └── VlogSection.tsx
│   └── ui/                    # Reusable UI primitives
│       ├── AnimatedCounter.tsx
│       ├── CursorGlow.tsx
│       ├── FadeIn.tsx
│       ├── FloatingBackground.tsx
│       ├── GrainOverlay.tsx
│       ├── Navbar.tsx
│       ├── ProjectCard.tsx
│       ├── SmoothScroll.tsx
│       └── StatsClient.tsx
├── lib/
│   └── utils.ts               # Data + cn() helper
└── types/
    └── index.ts               # TypeScript interfaces
```
