# Himanshu's Creator Hub 🚀

Your personal website with two faces:

- **Public** — a polished portfolio at your URL. Visitors and recruiters see only your *published* projects.
- **Private** — log in and the same site becomes your command center: drafts, works-in-progress, one-click Publish, and profile settings.

Everything below runs on **free plans** (GitHub + Vercel + Supabase). Total cost: **$0/month**.

---

## Before you start — read this

- **There is nothing to install on your computer.** Every step happens in your web browser.
- You need: an email address, about **45 minutes**, and a bit of patience.
- ⏱ The time estimates assume everything goes smoothly. **Your first time, expect 2–3× longer — that is completely normal.** You can stop after any step and continue later.
- If anything looks stuck or shows an error: **take a screenshot and show it to Claude.** We'll fix it together.
- 🔑 You will create passwords along the way. **Never share them with anyone — including AI assistants.**

---

## Step 1 — Create a GitHub account and upload the code (~15 min)

GitHub is where your code lives online. Vercel (step 2) reads from it.

1. Go to **github.com** → **Sign up** → follow the steps (use your email).
2. Once signed in, click the **+** (top-right) → **New repository**.
3. Repository name: `himanshu-creator-hub` · keep it **Public** · do **NOT** tick "Add a README" · click **Create repository**.
4. On the next page, click the small link **"uploading an existing file"**.
5. Open the folder `D:\CLAUDE PROJECTS\himanshu-creator-hub` in File Explorer.
6. Select **everything inside the folder** — EXCEPT these two if they exist (they are huge and must not be uploaded):
   - ❌ `node_modules` (folder)
   - ❌ `.next` (folder)
7. Drag the selected files and folders into the GitHub upload page.
8. Wait for all files to appear, then click **Commit changes** (green button).

✅ **Check:** your repository page now shows folders like `app`, `components`, `lib` and files like `package.json`.

> Trouble dragging folders? Upload in two rounds: first drag the folders (`app`, `components`, `lib`, `docs`, `.github`), then drag the loose files.

---

## Step 2 — Put your site live on Vercel (~10 min)

Vercel builds your code and hosts it on the internet.

1. Go to **vercel.com** → **Sign up** → choose **Continue with GitHub** (easiest) → pick the **Hobby** (free) plan.
2. Click **Add New… → Project**.
3. Find `himanshu-creator-hub` in the list → **Import**.
4. Change nothing (Vercel auto-detects Next.js) → click **Deploy**.
5. Wait 1–3 minutes. Confetti! 🎉 Click the preview to open your live site.

✅ **Check:** your site is live at an address like `himanshu-creator-hub.vercel.app` — showing your name, tagline, and a "New projects coming soon" section. **Save this URL — you'll need it in steps 5, 6, and 8.**

> The dashboard doesn't work yet — that's expected. The database comes next.

---

## Step 3 — Create your database on Supabase (~10 min)

Supabase stores your projects, profile, images, and handles your login.

1. Go to **supabase.com** → **Start your project** → sign in with GitHub.
2. Click **New project**:
   - Name: `creator-hub`
   - Database password: click **Generate** and **save it somewhere safe** (you rarely need it, but keep it)
   - Region: pick the one closest to you (e.g. Mumbai or Singapore)
   - Click **Create new project** and wait ~2 minutes.
3. In the left sidebar, open **SQL Editor** → **New query**.
4. On your computer, open the file `supabase-setup.sql` (in this project folder) with Notepad → select ALL of it (Ctrl+A) → copy.
5. Paste into the SQL Editor → click **Run**.

✅ **Check:** the result says **"Setup complete ✅ …"**.

---

## Step 4 — Lock the door & create YOUR login (~5 min)

1. Still in Supabase: **Authentication → Sign In / Providers**.
2. Find **"Allow new users to sign up"** → turn it **OFF** → Save.
   *(Now nobody on Earth can create an account — except the one you make next.)*
3. Go to **Authentication → Users** → **Add user → Create new user**:
   - Email: your real email
   - Password: choose a strong one — **this is how you'll log into your website**
   - If you see an "Auto Confirm User" option, tick it.
   - Click **Create user**.

✅ **Check:** one user appears in the list. (Behind the scenes, this also auto-created your profile with your name and tagline.)

---

## Step 5 — Tell Supabase your site's address (~2 min)

This makes password-reset emails point to the right place.

1. **Authentication → URL Configuration**.
2. **Site URL:** paste your Vercel URL from step 2 (e.g. `https://himanshu-creator-hub.vercel.app`) → Save.

---

## Step 6 — Connect Vercel to Supabase (~5 min)

Your website needs two values to find its database.

1. In Supabase: **Project Settings** (gear icon) → **API Keys**.
   - Copy the **Project URL** (starts with `https://…supabase.co`)
   - Copy the **publishable key** (starts with `sb_publishable_…`).
     *If your dashboard shows an older "anon public" key instead — that's the same thing, use it.*
2. In Vercel: open your project → **Settings → Environment Variables**. Add these two:

   | Name | Value |
   |------|-------|
   | `NEXT_PUBLIC_SUPABASE_URL` | the Project URL |
   | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | the publishable key |

3. **Redeploy** so the site picks them up: **Deployments** tab → newest deployment → **⋯ menu → Redeploy → Redeploy**.

✅ **Check:** open `your-site.vercel.app/login` — the login form appears (no more "setup not finished" message).

---

## Step 7 — First login 🎉 (~5 min)

1. Open your site → click the tiny **lock icon** (top-right) → log in with the email + password from step 4.
2. You're in your dashboard! Try it out:
   - **Settings** → upload a profile picture (animated GIF works!) → Save.
   - **New Project** → fill in a real or test project → Create.
   - Back on the dashboard → click **Publish** → open your public site → it's there. ✨
   - Click **Unpublish** → it's gone from public view. That's your superpower now.

---

## Step 8 — Switch on the keep-alive robot (~3 min)

Supabase pauses free databases after ~1 week of no activity. This tiny robot visits your site twice a day so that never happens.

1. On GitHub, open your repository → folder `.github/workflows` → file `keep-alive.yml`.
2. Click the **pencil icon** (edit).
3. Find the line `SITE_URL: https://YOUR-SITE-URL.vercel.app` and replace the placeholder with your real URL from step 2.
4. Click **Commit changes**.
5. Go to the **Actions** tab → if it asks, click **"I understand my workflows, enable them"**.

✅ **Check:** in Actions, select "Keep Supabase awake" → **Run workflow** → it should finish with a green tick.

---

## You're done! Daily life from now on

| You want to… | You do… |
|---|---|
| Add a project | Log in → New Project → fill the form → Create |
| Make it public | Dashboard → **Publish** (appears in seconds) |
| Hide something | Dashboard → **Unpublish** |
| Change avatar/bio/links | Dashboard → Settings → Save |
| Share your work | Send anyone your URL — they only ever see published projects |

**No coding. No redeploying. Ever.**

---

## Troubleshooting (the usual suspects)

| Problem | Fix |
|---|---|
| Login page says "Setup not finished" | The two Environment Variables in Vercel are missing or misspelled, or you forgot to **Redeploy** (step 6.3). |
| "That email or password doesn't match" | Check the user exists in Supabase → Authentication → Users. You can delete it and create it again, or use "Forgot password?" on the login page. |
| Published project not showing publicly | Refresh the page (Ctrl+F5). Confirm the project's badge says 🟢 Published. |
| Image upload fails | Confirm step 3's SQL script ran successfully (it creates the image storage). Also check the image is under the size limit shown in the form. |
| Site suddenly shows default content / errors after days away | Supabase paused. Open supabase.com → your project → **Resume project** (2 clicks). Then do step 8 so it never happens again. |
| Password-reset email link goes to a weird page | Step 5's Site URL isn't set to your Vercel URL. |
| Vercel build fails | Take a screenshot of the red error text and show Claude. |
| Anything else | Screenshot → Claude. Seriously, that's the workflow. |

---

## What's in this folder (for the curious)

| Path | What it is |
|---|---|
| `app/` | The website's pages (public site + dashboard) |
| `components/` | Reusable building blocks (cards, forms, nav…) |
| `lib/` | The brains: database access, validation, actions |
| `supabase-setup.sql` | The one-time database setup script (step 3) |
| `.github/workflows/keep-alive.yml` | The keep-alive robot (step 8) |
| `docs/PRD.md` | The full blueprint of this project |
| `.env.local.example` | For developers only — you can ignore it |

Built with Next.js, Tailwind CSS, and Supabase — generated with AI assistance, owned and driven by Himanshu. 💛
