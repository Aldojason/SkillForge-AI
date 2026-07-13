# SkillForge AI

The all-in-one AI-powered placement preparation platform — DSA tracker, study
planner, resume builder, AI resume review, mock interviews, analytics, and
premium subscriptions, in one app instead of six tabs.

This repo is a **working monorepo scaffold** built exactly to the blueprint:
React + Tailwind (claymorphism UI) on the frontend, Express + Prisma +
PostgreSQL + JWT on the backend.

**Fully wired and working out of the box:** auth (register/login/refresh/logout),
dashboard, DSA tracker, study planner, profile, analytics.
**Scaffolded with clear TODOs:** AI resume review, AI mock interview, Razorpay
payments, admin dashboard — these need your API keys (Gemini, Razorpay,
Cloudinary) to go from stub to fully functional; the request/response shape,
routes, and DB models are already in place.

```
skillforge-ai/
├── client/     React + Vite + Tailwind (claymorphism UI)
└── server/     Express + Prisma + PostgreSQL + JWT
```

---

## 1. Design system — Claymorphism

Palette, type, and the signature "clay coin" streak badge live in
`client/src/styles/clay.css` and `client/tailwind.config.js`:

| Token | Hex | Use |
|---|---|---|
| `canvas` | `#E7E1D6` | page background (desk mat) |
| `surface` | `#F2ECDF` | raised card |
| `primary` (Study Violet) | `#5B4B8A` | primary actions, focus |
| `sprout` | `#6E8B3D` | progress / success |
| `ember` | `#C1793F` | streaks / accents |

Fonts: **Fraunces** (display), **Plus Jakarta Sans** (body), **IBM Plex Mono**
(scores/stats). Molded surfaces use dual soft shadows (`.clay-raised`,
`.clay-inset`, `.clay-btn`, `.clay-coin` — see `clay.css`) instead of flat
Tailwind shadows, which is what gives the "pressed clay" look.

---

## 2. Prerequisites

Install these first:

- **Node.js 18+** and **npm** — https://nodejs.org
- **PostgreSQL 14+** — either installed locally, or a free hosted instance on
  [Neon](https://neon.tech) (recommended, matches the deployment steps below)
- **Git**

Check versions:
```bash
node -v
npm -v
```

---

## 3. Installation (local development)

### 3.1 Unzip and install dependencies

```bash
cd skillforge-ai/server && npm install
cd ../client && npm install
```

### 3.2 Configure the backend

```bash
cd server
cp .env.example .env
```

Open `.env` and fill in:

- `DATABASE_URL` — your Postgres connection string (local or Neon)
- `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` — any long random strings, e.g.
  generate with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`
- Leave `RAZORPAY_*`, `CLOUDINARY_*`, `SMTP_*`, `GEMINI_API_KEY` blank for now
  — the app runs fine without them; those power the stubbed features (payments,
  file storage, email, AI review).

### 3.3 Create the database schema

```bash
npx prisma migrate dev --name init
```

This creates every table in the blueprint (users, profiles, problems,
problem_progress, study_plans, tasks, resumes, resume_reviews, subscriptions,
payments, notifications, interview_sessions).

### 3.4 Seed sample data

```bash
npm run seed
```

Creates an admin login (`admin@skillforge.ai` / `Admin@12345`) and six sample
DSA problems so the tracker isn't empty on first load.

### 3.5 Run the backend

```bash
npm run dev
```

API is now live at `http://localhost:5000`. Check it: `curl http://localhost:5000/health`

### 3.6 Configure and run the frontend

In a second terminal:

```bash
cd client
cp .env.example .env
npm run dev
```

App is now live at `http://localhost:5173`.

---

## 4. Connectivity — how the pieces talk to each other

```
Browser (client, :5173)
   │  axios, withCredentials: true
   ▼
Express API (server, :5000)  ──▶  PostgreSQL (Prisma)
   │
   ├──▶ Razorpay      (checkout + verification)
   ├──▶ Cloudinary     (resume/avatar file storage)
   ├──▶ SMTP           (password reset emails)
   └──▶ Gemini API     (AI resume review / mock interview / study coach)
```

- **Client → Server**: `client/src/services/api.ts` is the single axios
  instance. `VITE_API_URL` in `client/.env` points it at the backend. In dev,
  `vite.config.ts` also proxies `/api` to `localhost:5000` so you can call
  relative paths if you prefer.
- **Auth flow**: on login/register, the server returns a short-lived JWT
  **access token** in the response body (kept in memory on the client) and
  sets a long-lived **refresh token** as an httpOnly cookie. `api.ts`
  auto-refreshes the access token on a 401 and retries the request — you
  don't need to think about this in the pages.
- **CORS**: the server only accepts requests from `CLIENT_URL` (set in
  `server/.env`). Update this when you deploy the frontend.
- **Server → Database**: `server/prisma/schema.prisma` is the single source
  of truth. Any schema change → `npx prisma migrate dev` locally, then
  `npx prisma migrate deploy` in production.
- **Razorpay payments**: checkout creates a Razorpay order via
  `POST /api/payments/checkout`, and `POST /api/payments/verify` validates
  the payment signature server-side using the Razorpay SDK.

---

## 5. Wiring the stubbed integrations

These are scaffolded with real routes and DB models, but return placeholder
data until you add credentials:

| Feature | File | What to do |
|---|---|---|
| AI Resume Review | `server/src/modules/resume/resume.routes.ts` | Replace the stub in `POST /review` with a call to the Gemini API (`GEMINI_API_KEY`) — send the resume text, ask for ATS score / grammar / missing skills as JSON. |
| AI Mock Interview | `server/src/modules/interview/interview.routes.ts` | The `InterviewSession` model already exists in the schema; the route generates company-specific questions via the Gemini API and stores the transcript/feedback. |
| File uploads (resume PDFs, avatars) | `resume.routes.ts` | Currently accepts the upload via `multer` in memory but doesn't persist it. Add the Cloudinary SDK, upload `req.file.buffer`, save the returned URL to `resume.fileUrl`. |
| Payments | `server/src/modules/payment/payment.routes.ts` | Set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in `.env`. Create a Razorpay account at https://dashboard.razorpay.com first. |
| Password reset email | `auth.service.ts` → `createPasswordResetToken` | Add a `PasswordResetToken` model (hash + expiry), and send the raw token via your SMTP provider. |

---

## 6. Deployment

This follows the blueprint's stack: **Vercel** (frontend), **Render**
(backend), **Neon** (database), **Cloudinary** (images).

### 6.1 Database — Neon

1. Create a project at https://neon.tech (free tier is enough to start).
2. Copy the connection string it gives you — this is your production
   `DATABASE_URL`.

### 6.2 Backend — Render

1. Push this repo to GitHub.
2. On https://render.com, create a **New Web Service**, point it at the repo,
   set **Root Directory** to `server`.
3. Build command: `npm install && npx prisma generate && npm run build`
4. Start command: `npx prisma migrate deploy && npm start`
5. Add every variable from `server/.env.example` under Render's Environment
   tab, using your real values:
   - `DATABASE_URL` → the Neon connection string
   - `CLIENT_URL` → your Vercel URL (set after step 6.3)
   - `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` → strong random secrets
   - `RAZORPAY_*`, `CLOUDINARY_*`, `SMTP_*`, `GEMINI_API_KEY` as needed
6. Deploy. Note the Render URL, e.g. `https://skillforge-api.onrender.com`.

### 6.3 Frontend — Vercel

1. On https://vercel.com, **New Project**, import the repo, set **Root
   Directory** to `client`.
2. Framework preset: **Vite**.
3. Add environment variable `VITE_API_URL` = `https://skillforge-api.onrender.com/api`
4. Deploy. Note the Vercel URL, e.g. `https://skillforge.vercel.app`.
5. Go back to Render and set `CLIENT_URL` to that Vercel URL, then redeploy
   the backend (needed for CORS + cookies to work).

### 6.4 Razorpay (production)

In the Razorpay dashboard → Settings → API Keys, generate production keys
and add `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` to Render's environment
variables.

### 6.5 Cloudinary

Create a free account at https://cloudinary.com, grab `Cloud name`, `API
Key`, `API Secret` from the dashboard, add them to Render's environment.

---

## 7. Useful commands

```bash
# Server
npm run dev             # start with hot reload
npm run build && npm start   # production build/run
npx prisma studio        # visual DB browser at localhost:5555
npx prisma migrate dev   # create/apply a migration after schema changes
npm run seed              # re-seed sample data

# Client
npm run dev       # start Vite dev server
npm run build      # production build → client/dist
npm run preview    # preview the production build locally
```

---

## 8. Roadmap alignment

This scaffold implements Phases 1–4 fully (repo, DB, auth, dashboard) plus
working Phase 5–6 features (DSA tracker, planner) and Phase 9 (analytics
overview). Phases 7–8, 10–11 (full resume builder editor, AI review/mock
interview intelligence, live payments, admin UI polish) have their data
models and API routes in place — follow section 5 above to finish wiring
them, in the same order the blueprint specifies.
