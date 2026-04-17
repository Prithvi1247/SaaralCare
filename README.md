<div align="center">

```
███████╗ █████╗  █████╗ ██████╗  █████╗ ██╗      ██████╗ █████╗ ██████╗ ███████╗
██╔════╝██╔══██╗██╔══██╗██╔══██╗██╔══██╗██║     ██╔════╝██╔══██╗██╔══██╗██╔════╝
███████╗███████║███████║██████╔╝███████║██║     ██║     ███████║██████╔╝█████╗  
╚════██║██╔══██║██╔══██║██╔══██╗██╔══██║██║     ██║     ██╔══██║██╔══██╗██╔══╝  
███████║██║  ██║██║  ██║██║  ██║██║  ██║███████╗╚██████╗██║  ██║██║  ██║███████╗
╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝ ╚═════╝╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝
                                                                                  AI
```

### _If rainfall stops gig workers from working — SaaralCare AI detects it, and pays them. Automatically. No claims. Ever._

<br/>

[![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React Native](https://img.shields.io/badge/React_Native-Mobile-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactnative.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Python](https://img.shields.io/badge/Python-ML_Model-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org/)
[![Open-Meteo](https://img.shields.io/badge/Open--Meteo-Weather_API-00B4D8?style=for-the-badge&logo=cloudflare&logoColor=white)](https://open-meteo.com/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Payments-02042B?style=for-the-badge&logo=razorpay&logoColor=white)](https://razorpay.com/)

<br/>

> 🏆 **Built for Guidewire DEVTrails 2026**  
> _AI-enabled parametric insurance for India's gig economy_

</div>

---

## 📋 Table of Contents

- [The Problem](#-the-problem)
- [Our Persona — One City, One Disruption, Perfection](#-our-persona--one-city-one-disruption-perfection)
- [Zero-Touch Claim System](#-zero-touch-claim-system)
- [What Makes Us Different](#-what-makes-us-different)
- [Parametric Trigger Engine](#-parametric-trigger-engine)
- [Advanced Fraud Prevention Architecture](#-advanced-fraud-prevention-architecture)
- [AI / ML Weather Risk Model](#-ai--ml-weather-risk-model)
- [Financial Model](#-financial-model)
- [Admin Monitoring Dashboard](#-admin-monitoring-dashboard)
- [Multilingual Support](#-multilingual-support)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [How to Run](#-how-to-run)
- [Demo Values](#-demo-values)

---

## 🌧️ The Problem

India has **8 million+ gig delivery workers**. Every monsoon season, they face a brutal reality:

> _"It's raining. I can't work. I earn nothing today."_

Traditional insurance fails them completely:
- ❌ Long claim submission forms
- ❌ Evidence uploads and waiting periods
- ❌ Days or weeks for verification
- ❌ Human gatekeepers who can reject

**SaaralCare AI eliminates this entirely.**

---

## 🎯 Our Persona — One City, One Disruption, Perfection

> **"One city. One disruption parameter. Perfection."**

We didn't try to solve insurance for everyone. We laser-focused:

| Dimension | Our Bet |
|-----------|---------|
| 👤 **Who** | Swiggy & Zomato food delivery workers |
| 📍 **Where** | Chennai, Tamil Nadu |
| ⚡ **What disrupts them** | Rainfall during delivery hours |
| 💸 **What they lose** | Income from missed peak-hour deliveries |

By going deep instead of wide, we built something that actually works for the people who need it most — not a generic insurance product watered down for everyone.

---

## ⚡ Zero-Touch Claim System

> _Workers never submit a single claim. Ever._

Traditional insurance forces workers through a gauntlet of steps before they see a rupee. SaaralCare throws that playbook away entirely.

```
🌧️  Rainfall Event Detected
         │
         ▼
📡  Open-Meteo API Fetches Hour-by-Hour Data
         │
         ▼
🔍  Trigger Engine Evaluates Intensity × Duration
         │
         ▼
✅  Worker Eligibility Verified (Zone + Active Plan)
         │
         ▼
💸  Automatic Payout Processed via Razorpay
```

**No forms. No uploads. No waiting. No gatekeepers.**

Payouts are determined purely by verified, immutable weather data. If the rain was real, the payout is real.

---

## 🔬 What Makes Us Different

### Intensity × Duration — Not Just Rainfall

Most parametric insurance systems look at a single number: total rainfall in mm. We looked deeper.

> **Other teams:** `Total Rainfall (mm)` → trigger
> 
> **SaaralCare:** `Rainfall Intensity (mm/hr) × Duration (hrs)` → trigger

This distinction matters enormously. A 10mm drizzle spread over 5 hours is very different from a 10mm downpour in 20 minutes. Our model captures *both* dimensions.

---

### Peak-Hour Intelligence — The Secret Weapon

Here's what no one else thought about: **not all rain is equally damaging.**

Rain at 3 AM doesn't hurt a delivery worker's income. Rain at 1 PM during the lunch rush absolutely destroys it.

We identified **zone-specific peak delivery hours** through rigorous research:

- 🍽️ **Lunch peak:** 1:00 PM – 3:00 PM
- 🌙 **Dinner peak:** 8:00 PM – 10:00 PM *(varies by zone)*

We systematically sampled restaurants across Chennai's zones, identified true peak ordering windows, and built those patterns into our trigger engine. The result: our system weights rainfall disruption based on *when* it actually hurts workers' income.

```
☔ Rainfall during PEAK hours:
   Trigger = 1.5 × Intensity (mm/hr) × Duration (hrs)

🌂 Rainfall during NON-PEAK hours:
   Trigger = Intensity (mm/hr) × Duration (hrs)
```

The `1.5×` multiplier reflects a fundamental truth: **losing peak-hour earnings is 50% more damaging than losing off-peak earnings.** Our model respects that.

---

### Multi-Point Spatial Averaging

For each zone, we don't just take one weather reading. We query Open-Meteo at:
- The zone center
- 1 km North, South, East, West

Then we **average all five readings** to get a robust, spoof-resistant rainfall estimate for that zone — every single hour.

---

## 🎚️ Parametric Trigger Engine

### Payout Tiers

| Condition | Trigger Type | Outcome |
|-----------|-------------|---------|
| Rainfall > **45 mm** during peak hours | Peak | 💰 **Full Payout** |
| Rainfall > **75 mm** during non-peak hours | Non-peak | 💰 **Full Payout** |
| Rainfall > **95 mm** total (any hour) | Total | 💰 **Full Payout** |
| Rainfall > **15 mm** during peak hours | Peak | 💛 **Partial Payout** |
| Rainfall > **35 mm** during non-peak hours | Non-peak | 💛 **Partial Payout** |
| Rainfall > **40 mm** total (any hour) | Total | 💛 **Partial Payout** |
| Below all thresholds | — | ❌ No Payout |

### Coverage Model

```
Max Weekly Coverage = 1.5 × Worker's Average Daily Income

Example:
  Daily Income  = ₹800
  Weekly Cover  = ₹1,200
```

Workers receive meaningful protection — not symbolic amounts.

---

## 🔒 Advanced Fraud Prevention Architecture

> _SaaralCare doesn't detect fraud. It makes fraud architecturally impossible._

This is our core philosophy: **remove every entry point for fraud instead of trying to catch it after the fact.**

### 1 — No-Claim System
Workers **cannot**:
- Submit claims
- Upload evidence
- Request payouts manually

→ **Eliminates:** Fake claims, inflated loss reporting, manual manipulation

### 2 — Immutable External Data Source
Payouts depend *only* on **Open-Meteo API** data — an external, trusted source with zero user influence.

→ **Eliminates:** Data tampering, internal manipulation of triggers

### 3 — No GPS (Kills Location Spoofing)
We made a deliberate architectural choice: **no mobile GPS, ever**.

Other systems that rely on GPS location tracking open themselves to spoofing apps, VPN-based location fraud, and geolocation manipulation. We removed the attack surface entirely.

→ **Eliminates:** GPS spoofing, VPN-based location fraud

### 4 — Fixed Worker → Zone → Station Mapping
Every worker is permanently assigned to a **home zone** (fetched from the platform API during onboarding). Rainfall is evaluated using **only that zone's data**.

Workers cannot:
- Change assigned zone
- Select favorable locations
- Switch to high-rainfall zones before storms

→ **Eliminates:** Location switching fraud, cherry-picking high-rainfall zones

### 5 — Satellite Cross-Validation (Advanced Fraud Validation)

> _"We don't trust a single data source. We validate against the sky itself."_

Our fraud validation layer cross-references ground station data against **satellite rainfall grids**:

| Layer | Source |
|-------|--------|
| Ground Data | Open-Meteo weather stations |
| Satellite Data | IMERG + TRMM rainfall grids |
| Anomaly Detection | Large mismatches flagged as suspicious |

```
If ground rainfall ≠ satellite rainfall → System flags anomaly for review
```

**Multi-source validation = Impossible to spoof**

### 6 — Human-in-the-Loop Admin Review
When the system detects anomalies between ground and satellite data, it surfaces an **anomaly score** on the Admin Portal. Administrators can review flagged events and intervene — combining algorithmic rigor with human judgment for edge cases.

### 7 — Policy Activation Delay (T + 7)
Coverage begins **7 days** after premium payment.

→ **Eliminates:** Buying insurance right before a heavy rain forecast

### 8 — Platform Worker Verification
Onboarding includes verification against the delivery platform's worker API (mock simulation).

→ **Eliminates:** Fake identities, duplicate accounts, unauthorized payout access

---

## 🤖 AI / ML Weather Risk Model

> _Not the payout engine — the pricing intelligence layer._

The ML model's job is risk-aware premium pricing. It runs offline, classifies stations by risk level, and feeds those scores into the financial model. It does **not** trigger payouts — that's the parametric engine's job.

### Model Overview

| Property | Value |
|----------|-------|
| Type | Rainfall Risk Classifier |
| Output | Low / Moderate / High risk |
| Accuracy | **0.98** |
| Validation | Stratified cross-validation |
| Calibration | Isotonic Regression |

### Dataset

```
📊 161,593 rainfall observations
📡 145 weather stations
🗺️  36 districts across Tamil Nadu
📅 Jan 2022 – Sep 2025
```

### Key Features

| Feature | What it captures |
|---------|-----------------|
| `avg_rain` | Baseline rainfall intensity |
| `heavy_rate` | Frequency of heavy rainfall events |
| `max_24h` | Worst-case 24-hour rainfall |
| `extreme_rate` | Frequency of extreme events |
| `p95_24h` | 95th percentile — tail risk distribution |

### Pipeline

```
Weather Data → Feature Aggregation → ML Risk Classifier
     → Station Risk Score → Premium Calculation → Financial Model
```

---

## 📊 Financial Model

A mathematically rigorous, actuarially-sound parametric pricing engine — rare at the hackathon level.

### Dual Poisson Risk Framework

Rainfall events are modeled as two **independent Poisson processes**:

| Process | Rate (Base) | Trigger |
|---------|------------|---------|
| Severe rainfall | λ_F = 0.20/week | Full payout |
| Moderate rainfall | λ_P = 0.30/week | Partial payout |
| Total | λ_total = 0.50/week | — |

### Personalized Risk Adjustment

```
λ_F     = 0.20 × s × β
λ_P     = 0.30 × s × β
λ_total = 0.50 × s × β

Where:
  s → Station risk score (from ML model)
  β → Seasonal multiplier
```

### Seasonality Multipliers

| Season | β | Effect |
|--------|---|--------|
| Dry | 0.5 | Reduced risk |
| Pre-monsoon | 0.8 | Moderate risk |
| SW Monsoon | 1.2 | Elevated risk |
| NE Monsoon | 1.8 | Peak risk |

### Expected Payout Formula

```
E[Payout] = c_day × w × E[min(N, 3)]

Where:
  c_day = 0.5 × daily income
  w     = 0.70 (weighting factor)
  N     ~ Poisson(λ_total)
  Cap   = max 3 payout days/week

Closed form:
  E[min(N,3)] = 3 − e^(−λ)(3 + 2λ + λ²/2)
```

### Premium Structure

```
P_weekly  = 1.325 × E[Payout]
P_monthly = 4.33  × P_weekly

Loading Breakdown:
  12.5% → Operations
  10.0% → Reserve Fund
  10.0% → Reinsurance
  ─────────────────────
  32.5%   Total Loading

Target Loss Ratio ≈ 75.5%
```

---

## 🖥️ Admin Monitoring Dashboard

> 🔗 **Live:** [saaralcareadmin.vercel.app](https://saaralcareadmin.vercel.app/)

The admin portal gives operators full operational oversight of the platform with real-time data across:

### Key Metrics at a Glance
- 👷 Total registered workers
- 📡 Active weather stations
- 🗺️ Operational rain zones
- 💰 Total premiums collected
- 💸 Total payouts disbursed
- 📉 Live loss ratio

### Zone Analytics
- Premium vs claims breakdown per zone
- Previous day rainfall recorded per zone
- Payout type expected per zone (full / partial / none)
- Worker distribution heatmap across zones

### Fraud Validation Interface
- **Anomaly Score** surfaced for each zone event
- Side-by-side comparison: Open-Meteo vs satellite (IMERG/TRMM) data
- Human-in-the-loop review: administrators can override or approve flagged events
- Suspicious event log with mismatch severity rating

### 🌧️ Rain Simulation
Administrators can **simulate rainfall events** on any zone to:
- Test trigger engine thresholds
- Preview payout calculations before live deployment
- Validate new zone configurations

---

## 🌐 Multilingual Support

> _Every worker deserves to understand their own insurance._

SaaralCare is built for India's linguistic diversity. The entire platform — onboarding, dashboard, policy details, payout notifications — is available in:

| Language | Script |
|----------|--------|
| 🇬🇧 English | Latin |
| 🇮🇳 Tamil | தமிழ் |
| 🇮🇳 Hindi | हिंदी |

No delivery worker is locked out because of language. That's not optional — it's a design principle.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Web Frontend** | [Next.js 15](https://nextjs.org/) | Landing page, onboarding, web dashboard |
| **Mobile App** | [React Native](https://reactnative.dev/) | Worker mobile dashboard |
| **Backend & DB** | [Supabase](https://supabase.com/) (PostgreSQL + Auth) | Database, authentication, real-time |
| **ML Model** | [Python](https://python.org/) (scikit-learn) | Rainfall risk classification |
| **Weather API** | [Open-Meteo](https://open-meteo.com/) | Real-time hourly rainfall data |
| **Payments** | [Razorpay](https://razorpay.com/) Sandbox | Simulated premium collection & payouts |
| **Platform API** | Mock Delivery Platform API | Worker identity verification |
| **Hosting** | [Vercel](https://vercel.com/) | Frontend + admin dashboard deployment |

### Database Tables

```
workers              → Worker profiles and zone assignments
zone_station_map     → Zone → Weather station mapping
stations             → Weather station metadata
premium_payments     → Payment records
coverage_payout      → Payout history
active_plans         → Active insurance plan states
rainfall_events      → Processed rainfall trigger log
```

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    WORKER INTERFACE                          │
│              React Native Mobile Dashboard                   │
└─────────────────────┬───────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  SUPABASE BACKEND                            │
│          PostgreSQL + Auth + Real-time Subscriptions         │
└──────┬──────────────────────────────────┬───────────────────┘
       │                                  │
       ▼                                  ▼
┌──────────────┐                 ┌────────────────────┐
│  OPEN-METEO  │                 │    RAZORPAY        │
│  Weather API │                 │  Payment Gateway   │
│  (24hr poll) │                 │  (Sandbox Mode)    │
└──────┬───────┘                 └────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────┐
│              PARAMETRIC TRIGGER ENGINE                       │
│                                                             │
│  Zone Rainfall Data (5-point spatial average)               │
│       ↓                                                     │
│  Peak Hour Classification                                   │
│       ↓                                                     │
│  Trigger = (1.5×) Intensity (mm/hr) × Duration (hrs)        │
│       ↓                                                     │
│  Threshold Evaluation → Full / Partial / No Payout          │
└──────────────────────────┬──────────────────────────────────┘
                            │
            ┌───────────────┼───────────────┐
            ▼               ▼               ▼
     Worker Eligible   Anomaly Check    ML Risk Model
     → Payout Queued   → Admin Flag     → Premium Price
```

---

## 🚀 How to Run

### Prerequisites

- Node.js v18+
- Python 3.9+
- Supabase account
- Razorpay account (test mode)

---

### 1 — Clone the Repository

```bash
git clone https://github.com/Prithvi1247/SaaralCare.git
cd SaaralCare
```

---

### 2 — Install Dependencies

```bash
npm install
```

---

### 3 — Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
# ─── Supabase ────────────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# ─── Razorpay ────────────────────────────────────────────────
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

> ⚠️ **Security Note:** `NEXT_PUBLIC_*` variables are exposed to the browser — only use public keys here. **Never** expose `RAZORPAY_KEY_SECRET` or `SUPABASE_SERVICE_ROLE_KEY` on the client side.

---

### 4 — Set Up the Database

Ensure the following tables exist in your Supabase project:

```
✅ workers              ✅ zone_station_map
✅ stations             ✅ premium_payments
✅ coverage_payout      ✅ active_plans
✅ rainfall_events
```

Refer to the schema diagram in the repository for full table definitions.

---

### 5 — Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### 6 — Test the Full Flow

```
1. Login with a demo phone number
2. Complete worker onboarding
3. Purchase a plan (Razorpay test mode)
4. Verify:
   ├── Payment recorded in premium_payments
   ├── Plan status updated in workers table
   └── Dashboard reflects active coverage
```

---

### 7 — Run the ML Weather Risk Model

```bash
# Navigate to model directory
cd Model

# Create and activate a virtual environment (recommended)
python -m venv venv
source venv/bin/activate        # macOS / Linux
# venv\Scripts\activate         # Windows

# Install dependencies
pip install -r requirements.txt

# Run the risk classifier
python weather_risk_predictor.py
```

---

## 🎭 Demo Values

Use these phone numbers for instant demo onboarding:

| Phone Number | Worker Name |
|-------------|-------------|
| `1231231231` | Sahana (inactive) |
| `4444444444` | Kanaga (active) |

---

<div align="center">

---

```
Built with ☔ and ❤️ for the gig workers of India
```

**SaaralCare AI** — _Rain can't stop us from paying you._

[![Admin Dashboard](https://img.shields.io/badge/Admin_Dashboard-Live-success?style=for-the-badge)](https://saaralcareadmin.vercel.app/)

</div>