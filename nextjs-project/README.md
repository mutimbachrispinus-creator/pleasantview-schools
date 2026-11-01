# Pleasantview Schools (Next.js 15): group site, with each school at /s/<slug>
1. `cp .env.example .env.local` and fill it in (Turso URL/token, Resend, Africa's Talking, ADMIN_PATH, ADMIN_EMAIL, ADMIN_PASSWORD, SESSION_SECRET)
2. `npm install && npm run dev` (tables are created automatically)
3. Central admin: `/<ADMIN_PATH>` (all schools; creates schools and sets each school admin login). Each school admin signs in at its own private link `/p/<key>` (shown in the central admin) and can only manage their own school.
Photos are stored in Turso (8 MB max each), so it deploys on Vercel as is. Set the same env vars there.
