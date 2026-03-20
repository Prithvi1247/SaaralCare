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