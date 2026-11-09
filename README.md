# Kino - movie streaming site (React + Supabase)

SWE334 bie daalt. Stack: React (Vite), Tailwind, React Router, Supabase, Vercel.

## Local deer ajilluulah
1. `npm install`
2. `.env.example`-g `.env` bolgon huulj, Supabase URL, anon key-g oruulna
3. Supabase > SQL Editor deer `supabase/schema.sql`-g ajilluulna
4. `npm run dev`  ->  http://localhost:5173

## Admin bolgoh
Burtguulsnii daraa SQL Editor deer:
`update profiles set role = 'admin' where email = 'tanii@email.com';`

## Deploy
GitHub-d push hiigeed Vercel deer Import, Environment Variables deer `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` nemne, daraa n Domains deer ooriin domain-oo holbono.
