# FINANCE.md — Money for engineers who hate finance

> A plain-language framework for solo technical founders and small companies whose founder is the engineer.
> Worked example uses **Axiom X Co., Ltd.** as of 2026-07-17.

---

## 0. Why this exists

Most technical founders do not lose to product. They lose to *money*. They build the thing, the thing works, the thing does not pay them, and 14 months later they are out of cash and confused about why. The financial layer is the same kind of system as the technical layer — once you make it legible, it stops being scary. This document is the legibility pass.

The whole document fits on one A4 page if you print it. The rest is worked examples and Thai-specific tax notes. Skim §1, read §2, do §3 today, come back to §4-§6 when the company is real.

---

## 1. The five numbers that matter

If you track only five numbers about your company, track these. Every other metric is downstream of them.

| # | Number | Why it matters | How to compute it (today) |
|---|---|---|---|
| 1 | **Cash on hand** | The only number that decides whether you survive next month | Bank accounts + Stripe/PayPal balance + cash. Subcount `data/tenant_ikigai.json` if you have one. **5 minutes.** |
| 2 | **Monthly burn** | How fast you spend it. Burn ÷ cash = runway. | Sum of last 3 months of expenses, divide by 3. Include subscriptions, salaries, contractor payouts, **and your own draw**. **30 minutes once a quarter.** |
| 3 | **Runway (months)** | The number your gut never quite gets right. | `cash ÷ monthly burn`. If under 6 → panic. If under 3 → take a bridge loan or cut hard. If over 18 → you can afford to invest. |
| 4 | **Revenue (last 90 days)** | Trend, not absolute. Is the curve up, flat, or down? | Sum of all invoices paid in the last 90 days. Look at the curve, not the absolute. **5 minutes.** |
| 5 | **Effective hourly rate** | The only honest measure of "is this worth it." | `last-90-days-revenue ÷ hours-you-actually-worked`. If under ฿2,000/hr you are subsidizing clients. If over ฿5,000/hr you can hire your first subcontractor. |

That is it. The whole finance stack. Everything else (margin, LTV, CAC, MRR, ARR, valuation, dilution) is a derivative of these five.

---

## 2. The one sheet (print this, fill it in weekly)

```
─────────────────────────────────────────────────────────
AXIOM X CO., LTD.    ──  Finance Pulse  ──   Week of: __________
─────────────────────────────────────────────────────────

1. CASH ON HAND (start of week)             ฿ ___________
   + Invoiced this week                     ฿ ___________
   − Received this week                     ฿ ___________
   = CASH ON HAND (end of week)             ฿ ___________

2. MONTHLY BURN (last full month)
   Subscriptions (SaaS, infra)               ฿ ___________
   Salaries / contractor payouts            ฿ ___________
   Founder draw (yes, count it)              ฿ ___________
   Office / coworking / travel               ฿ ___________
   Tax deposits                              ฿ ___________
   Other                                     ฿ ___________
   TOTAL                                     ฿ ___________

3. RUNWAY              cash ÷ burn         = _____ months
   🟢 ≥18   🟡 12–18   🟠 6–12   🔴 <6   ⚫ <3

4. REVENUE (last 90 days)                    ฿ ___________
   Same 90 days, one quarter ago             ฿ ___________
   Trend:        ↑ growing  → flat  ↓ falling

5. HOURS WORKED (last 7 days)                ___ hours
   Effective rate   revenue ÷ hrs (90d)    = ฿ ___________ /hr
   Target rate                              ≥ ฿ 2,000 /hr

─────────────────────────────────────────────────────────
NOTES / DECISIONS THIS WEEK:
   _____________________________________________________
   _____________________________________________________
─────────────────────────────────────────────────────────
```

**Tape this to the wall above your monitor. Update every Friday. Takes 10 minutes.** If you cannot honestly answer the five questions on the sheet, the company is at risk and you do not know it yet.

---

## 3. Worked example — Axiom X Co., Ltd. as of 2026-07-17

This is the actual Axiom data, current as of the last refresh of `data/tenant_ikigai.json`.

### 3.1 Cash on hand (Number 1)

| Source | THB |
|---|---:|
| 2 angel investors (500K + 300K) | 800,000 |
| TKC PCL (Digital Twin, 2 installments: 97K Jun + 194K Jul) | 291,000 |
| EDA / Horizon Assessment (2 installments: 145,500 Jul 1 + 145,500 Jul 16, net of ฿4,500 WHT each) | 291,000 |
| **TOTAL IN** | **1,382,000** |

*Note on classification:* the ฿800K from angels is **equity capital**, not revenue. The ฿582K from TKC + EDA is **client revenue** (recognized over Jun–Jul 2026). Mixing them in "revenue" is a common bookkeeping trap.

### 3.2 Monthly burn (Number 2)

**Known:**

| Item | THB / month | Notes |
|---|---:|---|
| Mac M5 Max 128GB lease (OPEX) | 19,900 | Apr 2026 – Jan 2027 (10 months), committed ฿199,000 |

**Unknown (waiting on Gmail classification):**
- Other SaaS subscriptions (Claude Code plan, Vercel, Cloudflare, GitHub Pro, Linear, Notion, Figma, …)
- Internet / phone / coworking
- Travel (Taipei, GITEX, LEAP, Solomon Islands, Hanoi…)
- Hardware replacement / upgrades
- Thai corporate filings (annual return, audit, tax)
- Professional services (lawyer, accountant)
- Personal draw (founder compensation)

**Estimate without unknowns:** ฿19,900 / month (the Mac lease only). That gives a runway of 1,382,000 / 19,900 = **69 months = 5.8 years**, which is fiction. The real burn is probably 3–8x that.

**3-scenario burn:**

| Scenario | Burn / month | Runway (months) | Runway (years) | Status |
|---|---:|---:|---:|---|
| 🟢 Lean (only Mac lease) | 19,900 | 69.4 | 5.8 | Fiction — undercounted |
| 🟡 Realistic (3× Mac) | 60,000 | 23.0 | 1.9 | Plausible for a solo consultancy |
| 🟠 Stress (5× Mac) | 100,000 | 13.8 | 1.2 | If Dr Non is paying himself ฿60K/mo + ฿30K travel + ฿10K SaaS |
| 🔴 Crisis (8× Mac) | 160,000 | 8.6 | 0.7 | If you add health insurance, accountant, lawyer, hardware reserve |

**Action required before the next quarter-end:** pull the last 90 days of Gmail receipts (search `subject:receipt` from `Stripe` / `GitHub` / `Cloudflare` / `Claude` / `Vercel` / `Google Workspace`), classify each as OPEX or CAPEX, compute the *actual* burn. Until then, the burn number is a guess.

### 3.3 Runway (Number 3)

**Working estimate:** 14–24 months at realistic burn. That is **comfortable** if the revenue curve is up, **fragile** if it is flat.

The current client revenue is ฿582K in 2 months (~฿291K/mo gross). If that continues, the company is **cash-flow positive** (revenue > burn) and runway is no longer the binding constraint — it becomes a question of *growth investment* vs *founder draw*.

### 3.4 Revenue trend (Number 4)

| Period | Revenue (THB) | Source |
|---|---:|---|
| Pre-2026-06 | 0 (no invoice history) | — |
| 2026-06 | 97,000 | TKC PCL, first installment |
| 2026-07 (so far) | 484,000 | TKC (194K) + EDA (291K) |
| **Trailing 90 days** | **582,000** | two paying clients |

**Trend:** ↑↑ sharply up. Two of the three known clients are in the depa / government ecosystem — the pipeline is concentrated. If either client stops, revenue drops 30–50%. Diversification is the strategic question for Q3–Q4 2026.

### 3.5 Effective hourly rate (Number 5)

Without time-tracking, this is a guess. But a calibrated one:

- Trailing 90-day revenue: ฿582,000
- Plausible solo-consultancy hours: 50 hrs/week × 13 weeks = 650 hours (real billable + delivery time, not including admin)
- **Effective rate: ~฿895 / hour**

That is **below the ฿2,000/hr floor** from §1. The reason: a lot of hours go into unpaid proposal writing, free pilots (ASCN, ASEAN CSCO, Solomon Islands, SCL — all pro bono), and the SALES work that has not yet converted to retainers.

**The honest read:** Axiom is currently in *investment mode* — the pro-bono work is relationship-building and the billable work is 1–2 clients deep. The effective rate will rise as more billable hours replace the relationship-building hours. The danger is if billable never comes and the pro-bono work eats the runway.

---

## 4. Tax in Thailand — the only part you cannot ignore

Axiom X Co., Ltd. is registered in Thailand. As a Thai-resident company, the tax surface is the following. None of this is legal advice — it is the lay-of-the-land so you know when to call a tax professional. The cost of a one-hour call to a Thai tax accountant is ฿2,000–5,000. The cost of *not* calling is potentially ฿100K+ in fines. Always call.

### 4.1 Corporate Income Tax (CIT)

- **Rate:** 20% of net profit (after deductions).
- **Small-medium company rate:** 0% on first ฿300K profit, 15% on next ฿2M, 20% above. *Eligible for first 5 accounting periods if registered capital ≤ ฿5M and revenue ≤ ฿30M.*
- **Filing:** PND 50 form, 150 days after fiscal year-end. Late filing = ฿200/วัน fine + 1.5% monthly interest on unpaid tax.
- **Axiom implication:** if 2026 revenue stays around ฿1.5M and expenses ฿600K, net profit ฿900K. After SME rate: roughly ฿300K × 0% + ฿600K × 15% = ฿90K CIT. The first ฿300K is tax-free.

### 4.2 Withholding Tax (WHT) — the gotcha most foreigners miss

- **What it is:** the *payer* (not the receiver) withholds a percentage of the invoice and remits it to the Revenue Department.
- **Rates by service type:**

  | Service | WHT rate (foreign client) |
  |---|---:|
  | Service / consulting fee | 5% |
  | Rental | 5% |
  | Advertising | 2% |
  | Transportation | 1% |
  | Professional fees (legal, accounting, medical) | 3% |

- **Axiom reality:** the EDA invoices already show `net of ฿4,500 WHT` — that is a foreign client (or a Thai government entity treating Axiom as the WHT agent) withholding 3% of a ฿150,000 invoice. Axiom *received* ฿145,500; the *client* paid the WHT. This is normal but must be **reconciled on the PND 53** at year-end.
- **Trap:** if the invoice says "150,000" and the client only wires 145,500, do not book 145,500 as revenue. Book 150,000 and book 4,500 as a WHT receivable. The government owes it back to you as a credit on the next filing.

### 4.3 VAT (Value Added Tax)

- **Threshold:** mandatory registration at **฿1.8M annual revenue** (was ฿1.8M, scheduled to rise to ฿5M but not yet enacted at the time of writing).
- **Current state:** Axiom is below the threshold. No VAT filing. **Re-evaluate at every quarter-end.**
- **When you cross:** register within 30 days, start charging 7% VAT on every invoice, file PND 30 monthly. This is non-trivial — get a tax accountant before you cross.

### 4.4 PDPA (Personal Data Protection Act)

- **What it is:** Thailand's GDPR-equivalent. Effective 2022.
- **Cost of compliance:** ~฿30,000–80,000 first year (privacy policy, consent flows, data processor agreements, possibly a Data Protection Officer).
- **Axiom status:** the public site has contact forms + Cloudflare analytics + (in `/admin`) user PII. The site has a privacy policy and consent flows but no formal DPA documentation. **Action: budget ฿50K for a privacy consultant review before any Thai-government contract above ฿1M.** PDPA fines for non-compliance are up to ฿5M.

### 4.5 Founder compensation

- **Draw vs salary:** the cleanest path is a fixed monthly salary through payroll (subject to withholding tax ฿0–35% on a graduated scale, social security 5% of salary capped at ฿750/mo, and provident fund optional 2–15%). A "draw" against equity is harder to defend at audit.
- **Reasonable salary:** the Revenue Department looks at "what would this person earn if hired by someone else." A solo founder of a tech consultancy with PhD-level domain expertise: ฿80,000–200,000 / month is defensible.
- **Dividends:** paid out of post-tax profit. 10% withholding tax on dividends paid to Thai individuals. 0% if paid to Thai companies (with conditions).
- **Mix it:** a common pattern is salary of ~฿100K + dividend of remaining profit at year-end. The salary is deductible (reduces CIT); the dividend is the founder's actual return.

---

## 5. The seven deadly sins for solo technical founders

These are the failure modes I see most often, in order of how often they kill the company.

### Sin 1: Confusing capital with revenue

The ฿800K from angels is **equity**. It is not yours, it is the company's. It is on the balance sheet, not in the founder's pocket. The moment you treat it as "salary," you have diluted yourself for a monthly draw that you could have taken as salary. The angels own part of every revenue dollar that comes in forever.

**Defense:** separate bank accounts. Capital goes into a "treasury" account. Revenue goes into an "operations" account. Founder salary comes out of operations. Never the twain shall meet.

### Sin 2: Underpricing because the client is "cool"

The depa, ASEAN Secretariat, UN DESA — these are *cool* clients. The instinct is to charge less because the work is meaningful. The work is meaningful, yes. But the cost of your time is the same whether the deliverable goes to a UN agency or a real-estate company. Discounting "for the mission" is a discount on your runway.

**Defense:** quote full price. If the client cannot pay full price, that is a *pro bono decision*, not a price negotiation. Pro bono is a real category; it belongs on the P&L as a marketing/CSR cost, not as a hidden subsidy.

### Sin 3: Doing the work before the deposit

The number-one cause of solo-founder insolvency is "I delivered in good faith, they'll pay in 30 days." They will not. They will pay in 90 days, then 120, then "we're restructuring the procurement department." Meanwhile you have paid your subcontractors in 7 days and your rent in 30 days and the math does not work.

**Defense:** **50% deposit, non-refundable, before kickoff. 50% on delivery. No exceptions.** If the client pushes back, that is a signal — the client who refuses to pay a deposit is the client who will not pay the final invoice. Walk away.

### Sin 4: Mixing personal and company expenses

The card you used to book the flight to Taipei — is it the company's card or yours? If yours, and the company reimburses you, the answer is "company flight, personal card" and you need a paper trail. If you just pay it from the company account, you also need a paper trail. If you "forget" to book it, you have a tax problem at year-end.

**Defense:** **a) the company pays for all business expenses from a company card or company bank account. b) You pay yourself a fixed monthly salary into a personal account, and that is your only "company money" you touch. c) The personal account never pays for company things.**

### Sin 5: Ignoring the foreign-currency tail

If your clients are mostly Thai government, you invoice in THB. If they are international (UN, World Bank, ASEAN Secretariat Singapore office, foreign private), you invoice in USD. Every USD invoice is exposed to FX. The THB/USD rate over 2024–2026 has moved from ~36 to ~34 — a 6% swing on a ฿10M contract is ฿600K. That is the size of a hire.

**Defense:** invoice USD when the client is USD-based. Hold USD in a Wise / OFX / Schwab account. Do not auto-convert to THB the day the money arrives. Rebalance quarterly.

### Sin 6: The "I will do the books later" trap

The admin folder on your laptop has 47 PDF invoices, 12 receipts from a Bangkok trip, and 8 Stripe payouts you "intend to reconcile." You will not reconcile them. They will become a ฿40K tax-accountant bill at year-end, and the accountant will find three years of mistakes you cannot recover from.

**Defense:** **book every expense within 7 days.** Use a tool that does it for you: **Wave** (free for revenue < ฿1M/yr) or **Xero** (฿650/mo, much better). Bank feeds + OCR receipt capture = 10 minutes a week. Not optional.

### Sin 7: No cap table, no founder agreement, no shareholder agreement

If there is more than one founder, or any investor, you need all three. Even a 2-person, 2-investor company needs them. The conversations are uncomfortable. The lawyer costs ฿30K–60K. The alternative is that a co-founder walks out with your customer list at 3am and you have no recourse.

**Defense:** day one. Before the second ฿100K comes in. **FounderVest / Clerky / Capbase** for cap tables (US), **Skooldio / Zegal / Lemon** for Thai-style shareholder agreements, or a ฿30K one-off with a Bangkok startup lawyer. Do not DIY this.

---

## 6. The three things to set up this week

If you do nothing else from this document, do these three.

### 1. Open two bank accounts

- **Operations account** — receives all client revenue, pays all OPEX, pays your salary
- **Treasury account** — receives all capital, holds the cash buffer, never pays anything except transfers to operations (with a paper trail)

Kasikorn, Bangkok Bank, and SCB all support this. Pick the one your accountant uses — easier at year-end. Set up automatic transfer rules: if operations balance drops below ฿X, auto-refill from treasury. ฿X = 3 months of burn.

### 2. Set up Wave or Xero

- **Free if revenue < ฿1M/yr:** Wave (https://waveapps.com). Bank feeds, invoicing, basic reports. Good enough.
- **฿650/mo:** Xero (https://xero.com). Better if you have employees, multiple currencies, or a real accountant.
- **Connect your bank.** Connect your Stripe (or your payment processor). Connect your credit card.
- **Categorize everything for 30 days.** The first month is annoying. After that it is 10 minutes a week.
- **Tell your accountant.** They will love you.

### 3. Write down the five numbers

Fill in the one-sheet from §2 with today's actual numbers. Tape it to the wall. Update it every Friday for 13 weeks. At the end of 13 weeks, you will have:
- A 90-day burn trend
- A 90-day revenue trend
- An honest effective hourly rate
- A real runway number, not a guess

If you cannot do this, your accountant cannot do it for you. The numbers are the floor.

---

## 7. The thirty-second summary

> Cash on hand ÷ monthly burn = months until the company runs out of money. That is the only number that matters until it stops being the only number. Everything else is an optimization on top of it.

If you remember nothing else from this document, remember that.

---

*This document is not legal, tax, or financial advice. It is a framework for organizing your thinking so you know when to call someone who is. For Thai corporate tax specifically, the Revenue Department hotline is **1161** (English support varies). The Thai Institute of Management Accountants (TIMA) maintains a directory of registered tax agents at https://www.tima.or.th.*
