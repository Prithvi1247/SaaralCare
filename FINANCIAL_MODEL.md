## Financial Model (Parametric Insurance Engine)

SaaralCare AI uses a mathematically grounded parametric model to determine payouts and pricing based on rainfall risk.

---

### 1. Trigger Design

Rainfall is evaluated using an intensity-duration model:

Trigger = Intensity (mm/hr) × Duration (hours)

#### Payout Rules:

- Full payout  
  - Trigger ≥ 50  

- Partial payout  
  - 30 ≤ Trigger < 50  

- No payout  
  - Trigger < 30  

This ensures only **meaningful work-disrupting rainfall** triggers compensation.

---

### 2. Risk Modeling (Dual Poisson Framework)

Rainfall events are modeled as two independent processes:

- Full events (severe rainfall)  
- Partial events (moderate rainfall)  

Calibrated using IMD Chennai station data:

- λ_F_max = 0.20/week  
- λ_P_max = 0.30/week  
- λ_total_max = 0.50/week  

For a given user:

- λ_F = 0.20 × s × β  
- λ_P = 0.30 × s × β  
- λ_total = 0.50 × s × β  

Where:
- `s` = station risk score (AI output)  
- `β` = seasonal multiplier  

---

### 3. Seasonal Adjustment

To reflect Chennai’s rainfall patterns:

| Season | β |
|-------|---|
| Dry | 0.5 |
| Pre-monsoon | 0.8 |
| SW Monsoon | 1.2 |
| NE Monsoon | 1.8 |

This ensures pricing adapts to **real seasonal risk variation**.

---

### 4. Expected Payout

Weekly payout is calculated as:

E[Payout] = c_day × w × E[min(N, 3)]

Where:

- c_day = 0.5 × daily income  
- w = 0.70 (weighted payout factor)  
- N ~ Poisson(λ_total)  
- Weekly cap = 3 days  

Closed-form:

E[min(N,3)] = 3 − e^(−λ)(3 + 2λ + λ²/2)

---

### 5. Premium Calculation

Premium is set with a controlled loading:

P_weekly = 1.325 × E[Payout]

P_monthly = 4.33 × P_weekly

#### Loading Breakdown:

- 12.5% → operations & infrastructure  
- 10% → reserve fund  
- 10% → reinsurance  

Resulting in a stable:

- Loss Ratio ≈ 75.5%

---

### 6. Key Properties

- Premium scales with:
  - Income  
  - Risk (zone)  
  - Season  

- Two-tier payout reduces volatility:
  - Average payout per event = 70% of full coverage  

- Weekly cap prevents extreme exposure  

---

### 7. Basis Risk (Important)

Since payouts depend on weather stations:

- Workers are mapped to nearest IMD station (~≤4 km)  
- Chennai has ~12 active stations (~5 km spacing)  

Accuracy:

- ~85–90% correct trigger detection  
- ~10–15% basis risk (unavoidable)

#### Mitigation:

- Nearest-station mapping  
- Partial payout tier as buffer  
- Periodic recalibration  

---

### 8. Why This Model Works

- Uses **real historical rainfall data**  
- Avoids overestimating risk (conservative λ values)  
- Maintains stable loss ratio across zones  
- Designed for **scalability and financial sustainability**  

---

### 9. Simple Interpretation

- Higher-risk zones → higher premium, higher payouts  
- Monsoon season → higher premiums  
- No claims → payout triggered automatically by rainfall data  

---

This model ensures SaaralCare AI remains:

- Fair to users  
- Resistant to fraud  
- Financially sustainable  