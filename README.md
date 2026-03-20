# SaaralCare AI  
Parametric Rainfall Insurance for Gig Workers (Mobile-First)

---

## 1. Problem Statement

Gig workers (Zomato, Swiggy, etc.) experience direct income loss during adverse weather conditions, especially heavy rainfall.

- No fixed salary or safety net  
- Reduced orders during rain  
- Increased safety risks while working  

Traditional insurance systems are unsuitable because:

- Claims are manual and slow  
- Verification is complex  
- Trust and accessibility are low  

---

## 2. Solution Overview

SaaralCare AI is a parametric insurance platform that automatically compensates swiggy and zomato food delivery (gig workers) when rainfall disrupts their ability to work.

- No claims process  
- No manual verification  
- Fully automated payouts  
- Data-driven and transparent  

---

## 3. User Workflow

Login → Onboarding → Zone Mapping → Buy Plan → Activation Delay (T+7) → Active Coverage → Automatic Payout

### Flow Details

- Login  
  - Users authenticate via phone number  
  - Verified against platform_workers (Swiggy / Zomato mock API) database  

- Onboarding  
  - Collect user details (name, platform)  
  - delivery zone collected automatically from platform_workers (Swiggy / Zomato mock API) database
  - Map user to nearest rainfall station  

- Plan Purchase  
  - Weekly subscription model  

- Activation Delay  
  - Coverage starts 7 days after payment  
  - Prevents opportunistic misuse  

- Trigger Monitoring  
  - Rainfall data continuously tracked  

- Payout  
  - Automatically credited when conditions are met at respective weather station.

---

## 4. Platform Worker Verification (Mock API)

To prevent fraudulent enrollments and location spoofing:

- A mock platform_workers database simulates Swiggy/Zomato APIs  
- Only pre-registered workers are allowed to log in  
- Ensures:
  - Authentic gig worker identity  
  - No fake user creation  
  - Reduced attack surface  

This acts as a controlled verification layer in absence of real platform APIs.

---

## 5. Zone and Station Mapping

Each user is mapped to a fixed delivery zone and corresponding weather station.

- Zone collected from mock api  
- Nearest station computed using geospatial mapping  
- Stored permanently in database  

### Purpose

- Ensures consistent and tamper-proof data source  
- Eliminates dependency on user-provided location  

---

## 6. Parametric Trigger System

The system uses an intensity-duration rainfall model:

Trigger = Rainfall Intensity (mm/hr) × Duration (hours)

### Two-Tier Trigger Design

- Full payout  
  - Trigger ≥ 50  

- Partial payout  
  - 30 ≤ Trigger < 50  

- No payout  
  - Trigger < 30  

### Key Characteristics

- Based on objective weather data  
- No manual claim required  
- Reflects real work disruption conditions  

---

## 7. Station-Based Trigger (Fraud Prevention)

Payout decisions are based strictly on weather station data.

- Not user input  
- Not GPS-based  
- Not device-dependent  

Rainfall is measured from mapped stations only.

### Benefit

- Completely eliminates GPS spoofing  
- Prevents user manipulation  
- Ensures fairness and auditability  

---

## 8. Weather Data Pipeline

- Weather data is collected using APIs (e.g., OpenWeatherMap)  
- Data is fetched at regular intervals (e.g., every 15–30 minutes)  
- Used to compute:
  - Rainfall intensity  
  - Duration of rainfall events  

### Processing

- Continuous monitoring of station data  
- Aggregation over time windows  
- Trigger evaluation based on intensity × duration  

---

## 9. Plan Lifecycle System

Each insurance plan follows a strict lifecycle:

- Payment Date → +7 days → Coverage Start  
- Coverage Duration → 7 days  

### Plan States

- No Active Plan  
- Activating (waiting period)  
- Active Coverage  
- Expired  

### Purpose

- Prevents buying insurance right before known rainfall  
- Ensures fairness across users  

---

## 10. Fraud Prevention Strategy

The system is designed to minimize all major fraud vectors.

### Built-in Protections

- No claim-based system  
- T+7 activation delay  
- Platform worker verification  
- Fixed zone-to-station mapping  
- Station-based trigger (not user-controlled)  

### Result

- No GPS spoofing attacks  
- No fake claim submissions  
- Resistant to coordinated fraud attempts  

---
## Adversarial Defense & Anti-Spoofing Strategy

SaaralCare AI is designed as a **claim-free, parametric system**, which fundamentally reduces fraud compared to traditional insurance. Instead of validating user-reported claims, payouts are triggered purely by verified weather data.

However, we explicitly design for adversarial scenarios such as coordinated fraud attempts.

---

### 1. Differentiation: Genuine Worker vs Bad Actor

Our system avoids relying on user-controlled signals like GPS. Instead, it differentiates based on **structural eligibility and non-manipulable data sources**:

- Workers must exist in the `platform_workers` database (mock Swiggy/Zomato API)
- Minimum **2-month work history** required
- Each worker is permanently mapped to a **fixed delivery zone and station**
- Payouts depend only on **station rainfall data**, not user location

#### Key Insight:
A bad actor cannot influence:
- Rainfall at an IMD station  
- Their assigned zone after onboarding  
- Historical platform records  

This removes the need to "detect" spoofing — the system is designed so spoofing has no effect.

---

### 2. Data Signals Used to Detect Fraud Patterns

While payouts are not claim-based, we monitor system-level signals to detect coordinated abuse:

- Platform verification data (worker existence, activity duration)
- Zone-level enrollment spikes (sudden mass sign-ups in high-risk zones)
- Payment timing patterns (multiple users enrolling just before high-risk periods)
- Station-level correlation (simultaneous payouts across clusters)
- Historical rainfall vs payout consistency

#### Why this works:
- Fraud rings typically rely on **scaling attacks**
- These patterns emerge at **system level**, not individual level

This enables detection of:
- Coordinated enrollment attacks  
- Artificial clustering around specific zones  
- Suspicious timing behavior  

---

### 3. UX Balance: Protecting Honest Workers

Traditional systems risk penalizing honest users due to false fraud flags. SaaralCare avoids this through design:

- No claim rejection flow (no manual claims exist)
- No dependency on:
  - GPS signals  
  - network quality  
  - user-submitted data  

#### If anomalies are detected:

- System flags patterns **at zone/system level**, not individual users  
- Payouts continue as long as trigger conditions are met  
- Additional verification applies only to:
  - new enrollments  
  - suspicious clusters  

#### Result:
- Honest workers are never blocked from payouts  
- No friction during bad weather conditions  
- No reliance on user connectivity  

---

### Final Design Principle

Instead of trying to detect fraud after it happens, SaaralCare AI:

- Eliminates the claim layer  
- Removes user-controlled inputs  
- Anchors decisions to **trusted external data (weather stations)**  

This makes the system inherently **resistant to spoofing and coordinated fraud**, while maintaining a seamless experience for genuine users.
---

## 11. AI / ML Integration

### Station Rainfall Risk Prediction Model

- Trained on historical Tamil Nadu rainfall telemetry dataset  
- Outputs:
  - station_risk_score (0–1)

### Usage

- Risk-based pricing  
- Zone classification  
- Future dynamic pricing improvements  

---

## 12. Multilingual Accessibility

The platform supports multiple languages to improve accessibility for gig workers.

### Current

- English  
- Tamil  
- Hindi  

### Implementation

- Translation dictionary-based system  
- Instant language switching  
- No page reload required  

### Importance

- Improves usability for regional workers  
- Enhances adoption and inclusivity  

---

## 13. Dashboard Features

- Worker Profile  
  - Name, platform, zone  

- Station Information  
  - Assigned station  
  - Rainfall status  

- Coverage Overview  
  - Plan status  
  - Coverage period  

- Premium and Coverage  
  - Weekly premium  
  - Monthly premium  
  - Coverage per day  
  - Maximum weekly payout  

- Payout History  
  - Full payout  
  - Partial payout  
  - Not triggered  

---

## 14. Technology Stack

### Mobile App
- React Native (Expo)

### Backend
- Supabase (PostgreSQL, Auth)

### APIs

- OpenWeatherMap API  
  - Rainfall data collection  

- Razorpay (Sandbox)  
  - Payment simulation  

- Mock Platform API  
  - Simulated Swiggy/Zomato worker database  

---

## 15. System Architecture

Mobile App (React Native)  
↓  
Supabase Backend  
↓  
Weather API (OpenWeatherMap)  
↓  
Trigger Engine  
↓  
Automated Payout System  

---
## Financial Model (Overview)

SaaralCare AI uses a parametric, data-driven model to determine payouts and pricing based on rainfall risk.

### Trigger Logic

Rainfall is evaluated using:

Trigger = Intensity (mm/hr) × Duration (hours)

- ≥ 50 → Full payout  
- 30–49 → Partial payout  
- < 30 → No payout  

This ensures payouts occur only during **meaningful work disruption**.

👉 [Financial Model](./saaralcare_v4_architecture.svg)
👉 [Dynamic Financial Model](./saaralcare_v4_calculator.html)
---

### Risk Modeling

Rainfall events are modeled using a **dual Poisson framework**:

- λ_F_max = 0.20/week (severe events)  
- λ_P_max = 0.30/week (moderate events)  

For each user:

λ_total = 0.50 × s × β  

Where:
- `s` = station risk score (ML output)  
- `β` = seasonal factor  

---

### Expected Payout

E[Payout] = c_day × w × E[min(N,3)]

- c_day = 0.5 × daily income  
- w = 0.70  
- Weekly cap = 3 days  

---

### Premium

P_weekly = 1.325 × E[Payout]

- Loss Ratio ≈ 75%  
- Includes operations, reserve, and reinsurance  

---

### Key Properties

- Scales with income, risk, and season  
- Fully automated (no claims)  
- Designed to be financially sustainable  

---

### Detailed Model

For full derivations, calibration, and actuarial validation:

👉 [Read Full Financial Model](./FINANCIAL_MODEL.md)
---

## 16. Key Design Principles

- Fully automated (no claims)  
- Data-driven decisions  
- Fraud-resistant architecture  
- Mobile-first design  
- Simple user experience  

---

## 17. Conclusion

SaaralCare AI redefines insurance for gig workers by replacing manual claims with automatic, data-triggered payouts.

It combines:

- Weather data  
- AI-driven risk modeling  
- Secure system design  

to deliver a reliable and scalable financial safety net.

---

## 18. One-Line Summary

If it rains, the system pays automatically based on verified weather data.