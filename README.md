# SaaralCare - AI — Frontend

Parametric income protection platform for delivery workers. Built with Next.js, Tailwind CSS, and Leaflet.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Project Structure

```
gigshield-ai/
├── pages/
│   ├── index.js          # Landing page
│   ├── login.js          # Phone number + OTP login
│   ├── onboarding.js     # 3-step worker registration
│   └── dashboard.js      # Worker dashboard
│
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   ├── landing/
│   │   ├── Hero.jsx
│   │   ├── Features.jsx
│   │   └── HowItWorks.jsx
│   ├── auth/
│   │   └── PhoneLogin.jsx      # OTP login flow
│   ├── onboarding/
│   │   └── OnboardingForm.jsx  # 3-step form
│   ├── dashboard/
│   │   ├── WorkerZoneCard.jsx
│   │   ├── RainfallStationCard.jsx
│   │   ├── WeeklyCoverageCard.jsx
│   │   ├── PremiumCard.jsx
│   │   └── ClaimHistory.jsx
│   └── map/
│       └── RainfallMap.jsx     # Leaflet map (SSR disabled)
│
├── lib/
│   └── api.js                  # All /api/* calls centralised here
│
└── styles/
    └── globals.css
```

---

## API Integration

All calls go to `/api/...`. In production, set up Next.js rewrites in `next.config.js`:

```js
// next.config.js
module.exports = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://your-backend.com/api/:path*",
      },
    ];
  },
};
```

### Endpoints consumed (`lib/api.js`)

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/auth/send-otp` | Send OTP to phone |
| POST | `/api/auth/verify-otp` | Verify OTP → returns `{ token, workerId, isNewUser }` |
| POST | `/api/workers/register` | Register new worker |
| GET | `/api/workers/:id/profile` | Worker profile |
| GET | `/api/workers/:id/zone` | Zone details |
| GET | `/api/workers/:id/rainfall-station` | Mapped station |
| GET | `/api/workers/:id/coverage/weekly` | Weekly coverage |
| GET | `/api/workers/:id/premiums` | Premium history |
| GET | `/api/workers/:id/claims` | Claim history |
| POST | `/api/workers/:id/claims` | Submit claim |
| GET | `/api/rainfall/stations` | All stations (for map) |
| GET | `/api/rainfall/stations/:id/readings` | Station readings |

---

## Design System

- **Colors**: Navy (`#050d1a` base), Rain Blue (`#3a9fd4`), Amber (`#f59e0b`)
- **Fonts**: Fraunces (display/headings), DM Sans (body)
- **Components**: Glassmorphism cards, gradient borders, animated rain drops
- **Map**: Leaflet with CartoDB dark tiles — loaded client-side only via `next/dynamic`

---

## Environment

No env vars needed for the frontend. Auth tokens are stored in `sessionStorage` (upgrade to httpOnly cookies in production).

