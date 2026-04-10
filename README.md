# JobPulse AI — Frontend

> A full-stack job application tracker with AI-powered insights, ghost detection, and visual analytics.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)](https://jobpulse-frontend.vercel.app)

**Live Demo:** https://jobpulse-frontend.vercel.app  
**Backend API:** https://jobpulse-backend-qtsk.onrender.com  
**Backend Repo:** https://github.com/Tejendra2004/jobpulse-backend

---

## Screenshots

<!-- After you add screenshots, they will appear here -->
*Screenshots coming soon*

---

## What This Does

- Register and Login with secure JWT authentication
- Add, edit, delete, and update status of job applications
- Ghost Detection — see which companies have gone silent
- Analytics Page — pie chart and bar charts for visual insights
- Profile Page — personal performance stats
- Purple dark theme throughout

---

## Tech Stack

| Layer | Tool |
|-------|------|
| Framework | Next.js 14 |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Auth | JWT stored in localStorage |
| Deploy | Vercel |

---

## Pages

| Page | What it shows |
|------|--------------|
| /login | Login form |
| /register | Create account |
| /dashboard | Overview stats and summary |
| /jobs | Full job list with add/edit/delete |
| /analytics | Charts and visual data |
| /profile | Personal application stats |

---

## How to Run Locally

### Step 1 — Clone
```bash
git clone https://github.com/Tejendra-dev/jobpulse-frontend.git
cd jobpulse-frontend
npm install
```

### Step 2 — Create environment file
```bash
cp .env.example .env.local
```

### Step 3 — Start the app
```bash
npm run dev
```
App runs at http://localhost:3000

---

## Environment Variables
