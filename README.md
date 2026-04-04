# SaaralCare AI

## AI-Powered Parametric Insurance for Gig Delivery Workers

SaaralCare AI is a mobile-first parametric insurance platform designed
to protect gig delivery workers from income loss caused by environmental
disruptions such as heavy rainfall.

The system replaces traditional claim-based insurance with automated
trigger-based payouts, ensuring workers receive compensation quickly and
transparently when work disruptions occur.

This solution is built as part of **Guidewire DEVTrails 2026 Phase 2**,
addressing the challenge of building an AI-enabled parametric insurance
system for India's gig economy.

------------------------------------------------------------------------

# Zero-Touch Payout System

Traditional insurance requires workers to:

-   file claims
-   upload proof
-   wait for verification
-   wait days or weeks for payout

SaaralCare removes this process completely.

## Zero-Touch Workflow

Rainfall Event Detected\
↓\
Trigger Engine Evaluates Rainfall\
↓\
Worker Eligibility Verified\
↓\
Automatic Payout Processed

Workers **never submit claims**.

All payouts are determined purely from **verified weather data**,
ensuring transparency and speed.

------------------------------------------------------------------------

# How to Run

Follow these steps to set up and run the project on your machine.

---

### 1. Clone the Repository

bash
git clone https://github.com/Prithvi1247/SaaralCare.git
cd SaaralCare


---

### 2. Install Dependencies

bash
npm install


---

### 3. Set Up Environment Variables

Create a .env.local file in the root directory and add:

env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Razorpay
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret


⚠️ *Important:*

* NEXT_PUBLIC_* variables are exposed to the frontend (safe for public keys only)
* Never expose RAZORPAY_KEY_SECRET or SUPABASE_SERVICE_ROLE_KEY

---

### 4. Set Up Database (Supabase)

Ensure the following tables exist:

* workers
* zone_station_map
* stations
* premium_payments
* coverage_payout
* active_plans
* rainfall_events

You can refer to the schema diagram in the repo (if included).

---

### 5. Run the Development Server

bash
npm run dev


Open:

text
http://localhost:3000


---

### 6. Test the Flow

1. Login with a phone number
2. Complete onboarding
3. Buy a plan (Razorpay test mode)
4. Verify:

   * Payment recorded in premium_payments
   * Plan status updated in workers
   * Dashboard reflects changes

---

### 7. Run the Weather Risk Model
The Weather Risk Model classifies rainfall risk for weather stations and is used for risk-aware premium pricing.

If you want to locally:

1. Navigate to the Model Directory
cd Model

2. Create Python Environment (Recommended)
python -m venv venv
source venv/bin/activate
Windows:
venv\Scripts\activate

3. Install Python Dependencies
pip install -r requirements.txt

4. Run the Risk Model
python weather_risk_predictor.py

------------------------------------------------------------------------

# Demo Values

Enter the phone numbers for demo onboarding:

1. 5555555555 - Pradeep
2. 9999999999 - Ravi

------------------------------------------------------------------------

# Admin Monitoring Dashboard

SaaralCare also includes an **administrative monitoring interface** that
provides operational oversight of the system.

Admin Dashboard:\
https://saaralcareadmin.vercel.app/

The admin panel allows system operators to monitor the platform in real
time through key statistics such as:

-   **Number of registered workers**
-   **Number of weather stations**
-   **Number of operational zones**

This dashboard enables administrators to observe platform activity,
track system coverage, and monitor how the parametric insurance network
is deployed across regions.

The admin side complements the **fully automated payout system** by
providing transparency into system scale and operational status.

------------------------------------------------------------------------

# Fraud Prevention Architecture

Fraud prevention is a **core design principle** of SaaralCare.

Instead of detecting fraud after claims, SaaralCare **prevents fraud by
design**.

## No Claim Submission

Workers cannot:

-   submit claims
-   upload evidence
-   request payouts manually

Payouts are triggered **only by the data which is received from the Open-Meteo API**.

------------------------------------------------------------------------

## No GPS Usage (Prevents GPS Spoofing)

Many parametric insurance systems rely on **mobile GPS tracking**, which
introduces vulnerabilities such as:

-   GPS spoofing
-   location manipulation
-   VPN-based fraud

SaaralCare **does not use GPS at all**.

Workers are mapped to a **fixed weather station during onboarding**.

Rainfall triggers depend **only on that station's telemetry data**.

This completely eliminates **GPS spoofing attacks**.

------------------------------------------------------------------------

## Fixed Zone → Weather Station Mapping

Each worker is mapped to a specific rainfall monitoring station.

Example:

Worker → Zone → Assigned Weather Station

Rainfall triggers are evaluated **only using that station's rainfall
data**.

Workers cannot:

-   change stations
-   manipulate rainfall readings
-   artificially trigger payouts

------------------------------------------------------------------------

# Supported Languages

The SaaralCare platform is designed to support gig workers across India
with multilingual accessibility.

Supported languages include:

-   **English**
-   **Tamil**
-   **Hindi**

------------------------------------------------------------------------

# Policy Activation Delay (T + 7)

Policies **do not activate immediately**.

If:

T = time when the worker pays the premium

then coverage begins at:

T + 7 days

This delay prevents workers from:

-   purchasing policies right before heavy rainfall
-   exploiting weather forecasts

------------------------------------------------------------------------

# Phase 2 Implementation Overview

Our system directly implements the **core evaluation expectations
described in the DEVTrails Phase-2 webinar and use-case document**.

  -----------------------------------------------------------------------
  Requirement                         SaaralCare Implementation
  ----------------------------------- -----------------------------------
  Worker onboarding                   Platform worker verification (Mock
                                      API simulation) + mobile onboarding

  Policy management                   Weekly subscription lifecycle with
                                      activation delay (T + 7)

  Dynamic premium calculation         Risk-based pricing using rainfall
                                      risk model

  Parametric trigger automation       Rainfall intensity × duration
                                      trigger engine

  Fraud detection                     Station-based triggers + platform
                                      worker validation

  Automatic payout                    Fully automated zero-touch claim
                                      system

  External data integration           Weather APIs + rainfall telemetry

  Analytics                           Worker dashboard + risk model
                                      outputs
  -----------------------------------------------------------------------

------------------------------------------------------------------------

# External Data Integration

SaaralCare AI integrates **external data sources** to power the
parametric trigger engine.

## Weather APIs

The system uses Open-Meteo Weather API to monitor rainfall conditions.

### Open-Meteo API

Features:

-   real-time rainfall monitoring
-   periodic polling every **24 hours**
-   payouts processed **next day after trigger detection**

Rainfall intensity and duration data feed directly into the **parametric
trigger evaluation engine**.

------------------------------------------------------------------------

# Parametric Insurance Engine

Rainfall disruption is evaluated using an **intensity-duration model**.

Trigger = Rainfall Intensity (mm/hr) × Duration (hours)

  Trigger Value        Outcome
  -------------------- ----------------
  Trigger ≥ 50         Full payout
  30 ≤ Trigger \< 50   Partial payout
  Trigger \< 30        No payout

Because the trigger threshold is relatively low, SaaralCare uses
**higher premiums than traditional parametric insurance systems** to
maintain sustainability.

------------------------------------------------------------------------

# Financial Model

The pricing model uses a **Poisson-based rainfall risk framework**.

Rainfall events are modeled as two processes:

-   severe rainfall → full payout
-   moderate rainfall → partial payout

Premiums are calculated based on:

-   worker income
-   station risk score
-   seasonal rainfall variation

The model maintains a target:

Loss Ratio ≈ 75.5%

Full explanation available in:

FINANCIAL_MODEL.md

------------------------------------------------------------------------

# Weekly Coverage Model

Gig workers operate on **weekly earning cycles**.

Max Coverage amount:

1.5 × worker's average daily income per week

Example:

Daily income = ₹800\
Weekly coverage = ₹1200

This ensures workers receive **meaningful protection against lost
working days caused by rainfall**.

------------------------------------------------------------------------

# Weekly Premium Model

Premium pricing depends on:

-   Worker average daily income
-   Rainfall risk score of the mapped weather station
-   Seasonal rainfall variation

Higher-risk stations result in **higher premiums**.

Because the trigger threshold is **30--50**, payouts are **more likely
than traditional parametric insurance systems**, which is why the
premium is intentionally set slightly higher.

------------------------------------------------------------------------

# AI-Based Rainfall Risk Model

To support risk-aware pricing, SaaralCare integrates a **machine
learning rainfall risk classifier**.

The model categorizes weather stations into:

-   Low risk
-   Moderate risk
-   High risk zones

## Dataset

-   **161,593 rainfall observations**
-   **145 weather stations**
-   **36 districts across Tamil Nadu**
-   Coverage: **Jan 2022 -- Sep 2025**

## Model Accuracy

Accuracy: **0.95**

Cross-validated using **stratified sampling**.

Probability calibration using **isotonic regression**.

Important predictive features:

-   avg_rain
-   heavy_rate
-   max_24h
-   extreme_rate
-   p95_24h

Full explanation available in:

Model/README.md

------------------------------------------------------------------------

# Worker Experience

The mobile dashboard provides workers with:

-   policy status
-   coverage window
-   assigned weather station
-   rainfall trigger monitoring
-   payout history

------------------------------------------------------------------------

# Technology Stack

## Mobile App

React

## Backend

Supabase (PostgreSQL + Auth)

## APIs

-   Open-Meteo -- rainfall monitoring
-   Razorpay Sandbox -- simulated payouts
-   Mock platform API -- delivery worker verification

------------------------------------------------------------------------

# System Architecture

App\
↓\
Supabase Backend\
↓\
Weather API Integration\
↓\
Parametric Trigger Engine\
↓\
Automated Payout System

------------------------------------------------------------------------

# Conclusion

SaaralCare AI transforms insurance for gig workers by replacing **slow
manual claims with automatic rainfall-triggered payouts**.

By combining:

-   rainfall telemetry
-   machine learning risk modeling
-   parametric insurance design
-   fraud-resistant architecture

the system delivers a **scalable financial safety net for gig workers**.

------------------------------------------------------------------------

# One-Line Summary

If rainfall prevents gig workers from working, **SaaralCare AI
automatically detects the disruption and compensates them without
requiring any claims.**