# My Hub - Project Status

**Last Updated:** 2025-11-05 21:40
**Project Location:** `C:\Users\matte\Desktop\My Hub`
**Server:** http://localhost:3000 (RUNNING)
**Database:** Supabase (project: wuvuapmjclahbmngntku)
**MCP Supabase:** Configurato in `.mcp.json` (richiede riavvio Claude Code)

---

## ✅ Completed Modules

### 1. **Wishlist Module** ✅
- Location: `app/dashboard/wishlist/`
- Features:
  - Add/view/delete wishlist items
  - Priority system (alta/media/bassa)
  - Notes field
  - Supabase integration
- Status: **COMPLETE & WORKING**

### 2. **Pasti/Alimentazione Module** ✅
- Location: `app/dashboard/pasti/`
- Features:
  - Preset meal plans (colazione, pranzo, cena, snack, pizza)
  - Auto/Manual toggle for custom meals
  - Differentiation between workout/rest days
  - Meal history tracking
- Status: **COMPLETE & WORKING**

### 3. **Fitness/Workout Module** ✅
- Location: `app/dashboard/fitness/`
- Features:
  - 3 preset workout schedules (Scheda A, B, C)
  - Smart weight input system:
    - Single weight field for exercises with fixed reps (e.g., "3x10")
    - Multiple weight fields for progressive exercises (e.g., "10-8-6-4")
  - Custom labels for different exercise types:
    - "Peso (kg)" for weight exercises
    - "Durata (min)" for cardio (Run, Bike, Top)
    - "Reps raggiunte" for max effort exercises (Trazioni MAX)
    - "Note" for pauses and stretching
  - Date tracking with default to today
  - Session notes
- Database Tables:
  - `workout_sessions` (user_id, data, tipo_scheda, note)
  - `workout_exercises` (workout_session_id, nome, serie, ripetizioni, peso)
- Status: **COMPLETE & WORKING**

#### Workout Schedules Details:

**Scheda A** (Petto/Tricipiti/Addome):
- Riscaldamento - Extrarotazione Manubri: 3 serie x 15-12-12 reps (pesi crescenti)
- Croci Panca 30°: 3 serie x 10 reps (peso fisso)
- Distensioni Panca Piana: 4 serie x 10-8-6-4 reps (pesi crescenti)
- Tricipiti 2 Manubri: 3 serie x 10 reps (peso fisso)
- Tricipiti Bilan Panca 30° alla nuca: 4 serie x 10-8-6-6 reps (pesi crescenti)
- Pausa + Bike: 1 serie x 3min
- Leg Extension: 3 serie x 15-12-10 reps (pesi crescenti)
- Affondi Due Manubri Singoli: 4 serie x 12-10-8-8 reps (pesi crescenti)
- Crunch: 3 serie x 30 reps (corpo libero)
- Stretching: 1 serie

**Scheda B** (Dorso/Bicipiti/Addome):
- Riscaldamento - Extrarotazione Manubri: 3 serie x 15 reps
- Bicipiti Man. Alter. Rotaz. Compl.: 3 serie x 10 reps
- Bicipiti Bilanciere: 4 serie x 10-8-6-6 reps (pesi crescenti)
- Pull Over Bilanc - Presa Inv.: 3 serie x 12 reps
- Lat Machine Trazibar: 4 serie x 12-10-8-8 reps (pesi crescenti)
- Alzate Frontali Bilanciere: 3 serie x 12 reps
- Lento Manubri con Rotazione: 4 serie x 12-10-8-15 reps (pesi crescenti)
- Ginoc. Alpetto alle Parallele: 3 serie x 30 reps
- Stretching: 1 serie

**Scheda C** (Gambe/Addome):
- Run: 1 serie x 5min
- Top: 1 serie x 3min
- Distensioni Panca Alta: 4 serie x 8-10 reps (pesi crescenti)
- Trazioni (con Aiuto): 4 serie x MAX reps (a cedimento)
- Pausa: 1 serie
- Squat: 4 serie x 10-8 reps (pesi crescenti)
- Hyperxtension: 3 serie x 20 reps
- Crunch Doppio: 3 serie x 25 reps
- Stretching: 1 serie

---

## 🚧 In Progress

### 4. **Game Prize Module**
- Location: TBD
- Target: Support 100+ simultaneous users on public landing page
- Status: **NOT STARTED**

### 5. **Public Landing Page**
- Location: TBD
- Purpose: Public-facing page for Game Prize module
- Status: **NOT STARTED**

---

## 📦 Deployment Status

### Current Setup:
- ✅ **Local Development:** Running on http://localhost:3000
- ✅ **Database:** Supabase (connected and working)
- ✅ **Git:** Repository initialized, latest commit includes all 3 modules
- ❌ **GitHub:** No remote repository configured yet
- ❌ **Hosting:** Not deployed yet

### Deployment Plan:
**Target Platform:** Vercel (chosen for always-on free tier, no standby)

**Why Vercel over Render:**
- ✅ Always active (no 15min standby on free tier)
- ✅ Better for Next.js (built by Vercel team)
- ✅ 100GB bandwidth/month free
- ✅ Global CDN for fast loading
- ✅ Suitable for 100+ simultaneous users on landing page

**Deployment Steps (NEXT SESSION):**
1. ✅ MCP Configuration:
   - ✅ Vercel MCP configured in Claude Code (`https://mcp.vercel.com/mcp`)
   - ✅ Render MCP removed
   - ⚠️ Requires Claude Code restart to activate Vercel MCP
   - ❌ Cloudflare MCP present but not connected

2. ⏳ GitHub Setup:
   - Create GitHub repository
   - Add remote: `git remote add origin <github-url>`
   - Push code: `git push -u origin master`

3. ⏳ Vercel Deployment (via MCP):
   - Connect GitHub repository to Vercel
   - Configure environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY` (if needed)
   - Deploy automatically from GitHub
   - Set up automatic deployments on push

---

## 🗄️ Database Schema

### Supabase Tables:

1. **wishlist_items**
   - id (uuid, primary key)
   - user_id (uuid, references auth.users)
   - nome (text)
   - priorita (text: 'alta' | 'media' | 'bassa')
   - note (text, nullable)
   - created_at (timestamp)

2. **pasti**
   - id (uuid, primary key)
   - user_id (uuid, references auth.users)
   - data (date)
   - tipo_pasto (text)
   - descrizione (text)
   - created_at (timestamp)

3. **workout_sessions**
   - id (uuid, primary key)
   - user_id (uuid, references auth.users)
   - data (date)
   - tipo_scheda (text: 'A' | 'B' | 'C')
   - note (text, nullable)
   - created_at (timestamp)

4. **workout_exercises**
   - id (uuid, primary key)
   - workout_session_id (uuid, references workout_sessions)
   - nome (text)
   - serie (text)
   - ripetizioni (text)
   - peso (numeric)
   - note (text, nullable)
   - created_at (timestamp)

---

## 🔧 Technical Stack

- **Framework:** Next.js 16.0.1 (App Router, Turbopack)
- **Language:** TypeScript
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Styling:** Tailwind CSS
- **Deployment Target:** Vercel
- **Version Control:** Git

---

## 📝 Notes for Next Session

### Immediate Actions Needed:
1. ⚠️ **FIX DATABASE FIRST**: Esegui `ALTER TABLE workout_sessions ADD COLUMN note TEXT;` in Supabase SQL Editor
2. **Restart Claude Code** to activate Supabase MCP (configurato in `.mcp.json`)
3. Test completo di tutti i moduli (dopo fix database)
4. Commit modifiche recenti (hydration fix + MCP config)
5. Push code to GitHub (repository già esistente: Matteo-Zaramella/my-hub)
6. Deploy to Vercel
7. Configure Supabase environment variables in Vercel
8. Test deployment and verify all modules work in production

**File creato:** `NEXT_STEPS.md` - Guida dettagliata per riprendere il lavoro

### Known Issues:
- Cloudflare MCP configured but not connecting (low priority, not needed for current deployment)
- Some temporary files were created during development (already cleaned up from git)

### Future Enhancements:
- Game Prize module implementation
- Public landing page design and development
- Consider adding analytics for the landing page
- Implement rate limiting for public endpoints (when Game Prize is live)

---

## 🎯 Development Workflow

**Local Development:**
```bash
cd D:/my-hub
npm run dev
# Server runs on http://localhost:3000
```

**Git Workflow:**
```bash
git status                    # Check changes
git add .                     # Stage changes
git commit -m "message"       # Commit with message
git push                      # Push to GitHub (after remote setup)
```

**Database Access:**
- Supabase Dashboard: https://supabase.com/dashboard
- Project Ref: wuvuapmjclahbmngntku

---

## 👤 User Authentication

- Login: `/login`
- Signup: `/signup`
- Dashboard: `/dashboard` (protected route)
- Logout: Available in dashboard

**Auth Flow:**
- Supabase Auth handles authentication
- Middleware protects dashboard routes
- User ID stored in `auth.users` table
- All modules filter data by `user_id`

---

**Project maintained with Claude Code**
Last commit: "Add Wishlist, Pasti and Fitness modules with preset workout schedules"
