# VoxOwn — Design Specification

## 1. Concept & Vision

VoxOwn is a **local-first AI media processing platform** — think of it as the privacy-respecting, self-hosted alternative to cloud AI services. The UI should feel like a premium desktop application that happens to run in a browser: powerful, fast, and trustworthy. The aesthetic conveys **control and confidence** — users should feel like they own their data and their tools.

The vibe: **dark, sophisticated, slightly technical** — like a high-end developer tool or creative suite. Not flashy, not playful — refined and capable.

---

## 2. Design Language

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| Background | `#0D0D0D` | Page backgrounds |
| Surface | `#1A1A2E` | Cards, panels, navbars |
| Surface Elevated | `#242442` | Hover states, elevated cards |
| Border | `#2D2D4A` | Subtle borders |
| Primary Accent | `#FF6B35` | CTAs, active states, highlights |
| Secondary Accent | `#7C5CFF` | Secondary buttons, gradients |
| Text Primary | `#F5F5F7` | Headings, primary text |
| Text Secondary | `#9898A6` | Body text, captions |
| Text Muted | `#5C5C6E` | Placeholders, disabled |
| Success | `#4ADE80` | Success states |
| Error | `#F87171` | Error states |
| Warning | `#FBBF24` | Warning states |

### Typography

- **Headings:** Inter (700, 600) — clean, modern, highly legible
- **Body:** Inter (400, 500) — consistent family
- **Mono:** JetBrains Mono — for code snippets, technical details
- **Scale:** 12 / 14 / 16 / 20 / 24 / 32 / 48 / 64px

### Spatial System

- Base unit: 4px
- Component padding: 16px, 24px, 32px
- Section spacing: 64px, 96px, 128px
- Border radius: 8px (cards), 12px (panels), 9999px (pills/buttons)

### Motion Philosophy

- **Micro-interactions:** 150ms ease-out for hover states
- **Page transitions:** 300ms ease-in-out for route changes
- **Entrance animations:** Staggered fade-up (opacity + translateY), 400ms, 80ms delay between items
- **Glass shimmer:** Subtle gradient shift on hover for premium feel
- All animations respect `prefers-reduced-motion`

### Visual Assets

- **Icons:** Lucide React — clean, consistent line icons
- **Decorative:** Gradient orbs (radial gradients with blur), subtle grid patterns on hero
- **Glass morphism:** `backdrop-filter: blur(16px)` + semi-transparent backgrounds on cards

---

## 3. Layout & Structure

### Landing Page (`/`)

```
[Navbar — fixed, glass, blur backdrop]
[Hero — full viewport height, gradient orb background, headline + CTA]
[Feature Grid — 3-column, icon + title + description cards]
[How It Works — 3-step horizontal flow with numbered badges]
[CTA Section — centered, gradient background, large CTA button]
[Footer — minimal, links, copyright]
```

### Dashboard (`/dashboard`)

```
[Sidebar — fixed left, logo + nav items + user avatar]
[Main Content Area — scrollable]
  [Header — page title + action buttons]
  [Quick Actions — horizontal card row for main features]
  [Recent Projects / History — list or grid of past runs]
  [System Status — GPU/RAM usage, model status indicators]
```

### Responsive Strategy

- Desktop: Full sidebar + content (1024px+)
- Tablet: Collapsible sidebar (768px–1023px)
- Mobile: Bottom nav or hamburger menu (<768px)

---

## 4. Features & Interactions

### Navbar
- Logo (left) + nav links (center) + "Get Started" CTA (right)
- On scroll: adds blur backdrop, slight background opacity increase
- Mobile: hamburger menu slides in from right

### Hero Section
- Animated gradient orb in background (slow rotation)
- H1: "Your AI. Your Hardware. Your Data."
- Subheadline: 1-2 lines explaining local-first AI
- Primary CTA: "Get Started Free" → links to dashboard
- Secondary CTA: "See How It Works" → scrolls to How It Works section
- Subtle floating badge: "100% Local • Zero Cloud"

### Feature Grid
- 6 feature cards in 3x2 grid
- Features: Transcription, TTS, Voice Cloning, Video Translation, Screen Recording, Meeting Assistant
- Each card: icon (Lucide), title, 1-line description
- Hover: slight lift (translateY -4px) + border glow

### How It Works
- 3 steps: "Install" → "Configure" → "Create"
- Numbered badges (1, 2, 3) in accent color
- Connecting line between steps
- Brief description per step

### CTA Section
- Gradient background (primary → secondary accent, subtle)
- Large headline: "Ready to Own Your AI?"
- Single CTA button

### Dashboard — Quick Actions
- 6 feature cards as quick-start buttons
- Icon + label + brief status ("Ready" / "Processing")
- Click → navigates to feature page or starts process

### Dashboard — System Status
- GPU usage bar (if available)
- RAM usage bar
- Model download status indicators
- "All systems ready" green badge when idle

### Interactions
- Buttons: scale(0.98) on press, 150ms
- Cards: translateY(-4px) + box-shadow increase on hover
- Loading states: pulsing skeleton with shimmer
- Toast notifications: slide in from bottom-right

---

## 5. Component Inventory

### `<Navbar />`
- **Default:** Transparent background, white text
- **Scrolled:** Glass background (blur + semi-transparent surface color)
- **Mobile:** Hamburger icon → full-screen overlay menu

### `<Button />`
- **Variants:** primary (filled accent), secondary (outlined), ghost (text only)
- **Sizes:** sm (32px), md (40px), lg (48px)
- **States:** default, hover (brightness +10%), active (scale 0.98), disabled (opacity 50%), loading (spinner)

### `<Card />`
- Glass background: `rgba(26, 26, 46, 0.6)` + `backdrop-filter: blur(16px)`
- Border: 1px solid `#2D2D4A`
- Border-radius: 12px
- Hover: border brightens to accent color at 30% opacity

### `<FeatureCard />` (extends Card)
- Icon in accent-colored circle
- Title (text-primary, 18px, 600)
- Description (text-secondary, 14px)

### `<StepBadge />`
- Circle with number, accent background
- Used in How It Works section

### `<ProgressBar />`
- Used for system status (GPU/RAM)
- Animated fill with gradient

### `<Badge />`
- Pill shape, small text
- Variants: success (green), warning (yellow), error (red), info (accent)

---

## 6. Technical Approach

### Stack
- **Framework:** Next.js 15 (App Router)
- **UI:** React 19
- **Styling:** Tailwind CSS v4
- **State:** Zustand (for UI state like sidebar open/closed)
- **Animations:** CSS transitions + Framer Motion for complex sequences
- **Icons:** Lucide React

### Architecture
```
frontend/
├── app/
│   ├── layout.tsx          # Root layout with fonts, globals
│   ├── page.tsx            # Landing page
│   ├── globals.css         # Design tokens, base styles
│   └── dashboard/
│       └── page.tsx        # Dashboard page
├── components/
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── FeatureGrid.tsx
│   ├── HowItWorks.tsx
│   ├── CTASection.tsx
│   ├── Footer.tsx
│   ├── Button.tsx
│   ├── Card.tsx
│   └── (future: feature-specific components)
├── package.json
├── tailwind.config.ts      # Tailwind v4 uses CSS-first config
├── next.config.ts
└── tsconfig.json
```

### Key Implementation Notes
- Use CSS variables for all design tokens (defined in globals.css)
- Tailwind v4 uses `@theme` directive in CSS for customization
- All components are client components (`"use client"`) for interactivity
- Landing page is server component where possible for SEO
- Dashboard is fully client-rendered (interactive)
