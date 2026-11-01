# PLEASANTVIEW SCHOOLS — Institutional Web Portal & Management System

> **A luxury multi-campus academic web platform built to the highest architectural standards of [St Andrew's Turi](https://www.standrewsturi.com), powered by Next.js, Africa's Talking SMS, Resend Email, and a Central Administrative Console.**

---

## 🏛️ About Pleasantview Schools

- **Location:** Githunguri, Komothai Subcounty, Kiambu County, Kenya  
- **Established:** 1998 (24+ Years of Scholastic Distinction)  
- **Motto:** *Our Aim is Victory*  
- **Ethos:** Competent · Confident · Compassionate (Christian-ethos Foundation)  
- **Academic Benchmarks:**
  - **KCPE:** Consistently exceeds **390/500** mean score (Top 10 in Kiambu County)
  - **KCSE (Girls' High School):** Mean grade **B+**, with >90% direct university qualification
  - **CBC Pathways:** Modern STEM, Integrated Science, Agriculture, and Digital Robotics Hubs

---

## 🌟 Visual Architecture (Exact St Andrew's Turi Parity)

- **Color Harmony:** Royal Navy (`#05286b`), Midnight Navy (`#0a1e43`), Slate Blue (`#335390`), Soft Ice (`#ebeef4`), and Warm Gold (`#e0a82e`).
- **Typography:** Modern geometric `M PLUS 2` alongside classic luxury serif display headings.
- **Rotated Side Action Tabs:** St Andrew's Turi's iconic 270° rotated vertical quick-action badges (*Book A Visit* & *Apply Now*) on the right viewport margin.
- **Signposting Cards:** Full-bleed image cards for each school division featuring smooth Ken Burns zoom hover effects, category tags, and enrolled learner count badges.
- **Vision, Mission & Values (VMV) Tabbed Slideshow:** Interactive tabbed switcher with gold underlines and authentic institutional statements.
- **Dynamic Hero Carousel:** Interactive multi-slide banner with frosted-glass navigation arrows, active slide counter (`01 / 03`), pill indicators, hover-pause, and Ken Burns zoom.

---

## 📬 Inbound & Outbound Communications Hub

Central Admin has a dedicated inbox to monitor, review, and reply to all communications in real-time:

1. **Inbound SMS (Africa's Talking Gateway):**
   - Live webhook endpoint at `/api/africastalking` captures all incoming SMS sent to the school's shortcode or virtual number.
   - Logs sender phone, destination number, SMS message body, timestamp, and status (`received` / `replied`).
   - Built-in Kenyan phone number normalization (`formatKenyanPhone()`), automatically converting `07...` and `01...` to E.164 `+254...`.
   - Central Admin can reply with an SMS directly from the console.

2. **Inbound Emails (Resend Gateway & Admissions Desk):**
   - Live webhook endpoint at `/api/resend` captures incoming emails and web admissions enquiries.
   - Central Admin can view sender details, subject line, full message body, and dispatch email replies directly from the dashboard.

3. **Unified Real-Time Communications Log:**
   - Chronological audit trail of all messages (Inbound SMS, Outbound SMS, Inbound Email, Outbound Email) with status badges and timestamps.

4. **Gateway Test & Simulation Tools:**
   - Built-in simulation forms allowing Central Admin to test receiving inbound SMS and emails without external webhooks.

---

## 🖼️ Hero Dynamic Pictures Manager

Central Admin can customize hero carousel slides for both the Group homepage and individual school division pages:
- **Direct Image Uploads:** Upload local photos directly to the database.
- **Campus Preset Gallery:** Quick selector for high-resolution campus photography.
- **Custom Headlines & Taglines:** Edit headings and subtitles dynamically.
- **Call-to-Action (CTA) Config:** Customize primary and secondary button labels and destination URLs.
- **Sort Sequencing & In-Place Editing:** Control the exact slide order with live cache revalidation.

---

## 🏫 Academic Divisions & School Portals

- **Pleasantview Senior School** (`SENIOR SCHOOL` — Grades 10–12 / Form 1–4, 450 Students, 450 Boarders)
- **Pleasantview Junior Secondary** (`JUNIOR SECONDARY JSS` — Grades 7–9, 500 Students, 200 Boarders)
- **Pleasantview Primary School** (`PRIMARY SCHOOL` — Grades 1–6, 1,000 Pupils, 250 Boarders)
- **Pleasantview Early Learning Centre** (`EARLY LEARNING` — Playgroup, PP1, PP2 & Crèche, 250 Pupils)

---

## 🚀 Quick Start Guide

### Pure Next.js Application

```bash
# Install dependencies
npm install

# Run development server
npm run dev
# Visit http://localhost:3000

# Build and run production server
npm run build
npm start
# Visit http://localhost:3000
```

---

## 🔐 Administrative Credentials

- **Central Admin Portal:** `/hidden-admin`
- **Staff Email:** `admin@pleasantview.sc.ke`
- **Default Password:** `pleasantview2026`

---

## 📡 API Endpoints

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/africastalking` | `GET` | Africa's Talking gateway health check and inbound SMS count |
| `/api/africastalking` | `POST` | Dispatches outbound SMS or logs incoming SMS via webhook |
| `/api/resend` | `GET` | Resend service health check and inbound email count |
| `/api/resend` | `POST` | Dispatches outbound email or logs incoming email via webhook |
| `/api/notify` | `POST` | Unified dispatcher triggering both SMS and email notifications |
| `/img/[id]` | `GET` | Serves uploaded high-resolution campus imagery from SQLite |

---

*Pleasantview Schools &bull; Founded 1998 &bull; Githunguri, Kiambu County, Kenya*
