# Week 5 Lab Manual: APIs, Databases & Full-Stack Transition


## Table of Contents

- [Overview](#overview)
- [Learning Objectives](#learning-objectives)
- [Pre-Lab Checklist](#pre-lab-checklist)
- [Component A: Staff Interview](#component-a-staff-interview)
- [Component B: Lab](#component-b-lab)
- [Component C: System Architecture & Design](#component-c-system-architecture--design)
- [Component D: Testing & Validation](#component-d-testing--validation)
- [Component E: Applied Challenge — The API Connector](#component-e-applied-challenge--the-api-connector-4050-min-individual)
- [Troubleshooting Matrix](#troubleshooting-matrix)
- [Submission](#submission)
- [Reflection](#reflection)

---

## Overview

Starting this week, you decide which tech stack fits the problem you are solving. You will integrate external APIs, set up a database, scaffold a Next.js project, and build an app that connects all three.

---

## Learning Objectives

By the end of this lab, you will be able to:

1. **Integrate external REST APIs** into an application using `fetch` or `requests`, including authentication and error handling. *(A **REST API** is a standard way for programs to exchange data over the web using URLs — you send a request to a URL and get structured data (usually JSON) back.)* 
2. **Set up a Supabase database** and perform CRUD operations (Create, Read, Update, Delete) from code
3. **Scaffold a Next.js application** and understand its file structure (`app/`, `page.tsx`, `layout.tsx`) 
4. **Justify a tech stack choice** based on user needs, not personal preference
5. **Manage environment variables** securely using `.env` files and `.gitignore`
6. **Create a system map** showing the data flow between user, frontend, API, and database, with pain points circled based on the staff interview
7. **Write 2 assert statements for API responses** that verify the data returned from your **Component B** external API meets expected structure (e.g., response contains expected keys, values are within plausible ranges). Commit them in your repo and list their file path in the README (see **Component D Deliverables**).

---

## Pre-Lab Checklist

Complete these steps before starting your labs.

- [ ] **Supabase account** created at [supabase.com](https://supabase.com) (sign up with GitHub recommended)
- [ ] **Supabase project** created: name it `techin510-lab5`, region "West US", write down your database password
- [ ] **Vercel account** created at [vercel.com](https://vercel.com) (sign up with GitHub recommended)
- [ ] **Node.js 20+** installed (`node --version` should show v20 or higher). Download from [nodejs.org](https://nodejs.org) (LTS version)
- [ ] **npm** available (`npm --version`)
- [ ] **At least one API key** obtained if your chosen API requires one (see the Curated API List below). APIs marked "None" require no key.
- [ ] **Cursor** installed and configured
- [ ] **Git** configured and you can push to GitHub

---

## Component A: Staff Interview 

### Guest: Maason Kao — Equipment Checkout Returns

**Maason** manages the equipment checkout and return process at GIX. His pain point centers on getting students to return checked-out equipment, using an existing workflow that spans multiple systems: BlueTally for reporting, Power Automate for automation, and email-based notifications.


### Synthesis Artifact: System Map Sketch

After the interview, sketch the work and data flows of your interviewee, with pain points circled.

### Mark System Touchpoints

On your system map, mark every point where a **user directly interacts with the system**. A touchpoint is any moment where a person does something: clicks a button, fills out a form, reads a notification, receives an email, or makes a decision based on what they see on screen.

Use a distinct marker (a star, a circle, or a different color) for each touchpoint. For each one, annotate:

- **Who** is the user at this point? (operations / IT staff? a student? another role?)
- **What** are they doing? (submitting a form, reading a status, making a decision)
- **What device** are they likely using? (desktop at their desk, phone while walking between buildings, tablet in a meeting)

Each touchpoint may indicate a screen or interaction your app needs to support. If the interviewee mentions checking something "on their phone while walking between buildings," that is a signal your app needs to work on a narrow screen. If they describe a workflow where two people hand off information, that may require authentication or multi-user support. These touchpoint annotations directly inform your tech stack decision framework below.

**Connection to tech stack choice:** Count your touchpoints. If there are multiple users at different touchpoints, that is a strong signal for Next.js with a database (multi-user, persistent data). We start with Supabase as that database so everyone shares the same setup and docs; in other contexts you might use PostgreSQL, Firebase, or another backend. If there is a single user at one or two touchpoints, Streamlit may be sufficient.

### Build Mandate

Your interview findings must directly shape what you build in Component B. Complete this sentence before writing any code:

> "Based on the interview, I will build **[specific feature/app]** because the interviewee said **[direct quote or paraphrased finding]**, which means **[design decision it drives]**."

This traces your code back to your research. If you cannot complete this sentence, re-read your interview notes.

---

## Component B: Lab

### Warm-up — Visual Reasoning

Take the system map you just drew by hand and describe the interviewee's system architecture in plain text to an AI (Claude, ChatGPT, or your tool of choice). Ask it to generate a diagram description (e.g., a Mermaid diagram or structured text layout). Compare the AI-generated version with your hand-drawn system map.

Reflect briefly: Which captured more detail: your sketch or the AI's interpretation? What did the AI miss? What did it add/miss?

---

### PRIMM Exercise: Reading the Next.js App Router

*This exercise applies the PRIMM method (Predict → Run → Investigate → Modify → Make) to the Next.js App Router file structure. It bridges the gap between Streamlit's single-file model and Next.js's folder-based routing.*

**The single most important thing to understand about Next.js** is that **file location = URL**. This is App Router routing:

```
src/app/page.tsx              →  localhost:3000/
src/app/dashboard/page.tsx    →  localhost:3000/dashboard
src/app/login/page.tsx        →  localhost:3000/login
src/app/settings/page.tsx     →  localhost:3000/settings
```

There is no routing configuration file. The folder structure *is* the routing. Create a folder, add a `page.tsx`, and you have a new URL. If port 3000 is already in use on your machine, Next.js may pick another port or fail to start—use the URL shown in your terminal (or follow the port conflict steps in Troubleshooting) instead of assuming localhost:3000.

Compare this to Streamlit:

```
STREAMLIT (one file, all routes)     NEXT.JS APP ROUTER (folder = route)
────────────────────────────────     ────────────────────────────────────
app.py                               src/app/page.tsx       (→ /)
  └── if page == "dashboard":          src/app/dashboard/
        show_dashboard()                 └── page.tsx       (→ /dashboard)
  └── if page == "login":             src/app/login/
        show_login()                     └── page.tsx       (→ /login)
```

**Step 1 — PREDICT:** Before running anything, answer these questions in writing:

1. If you create a file at `src/app/profile/page.tsx`, what URL will it map to?
2. The file `src/app/layout.tsx` exists at the root of `app/`. What do you think it does?
3. **Hooks primer (read, then predict):** Streamlit uses `st.session_state` to remember values between reruns. In React **client components**, **`useState`** and **`useEffect`** are built-in *hooks* (functions from `"react"` whose names start with `use`).
   - **`useState(initial)`** returns a pair: the current value and an updater function (often written `const [value, setValue] = useState(initial)`). Calling the updater schedules a re-render so the UI can reflect the new value. **`useState([])`** means “start with an empty array as the initial state.”
   - **`useEffect(() => { ... }, dependencyArray)`** runs your function **after** the component renders, and can run again when values in that dependency array change. Typical uses: **`fetch()`** to load remote data, timers, or subscribing to browser APIs—anything that **syncs the component with the outside world**. Direct user actions (clicks, typing) usually go in event handlers (`onClick`, etc.), not in `useEffect`.

   **Predict:** After reading the above, what do you expect `useState([])` to give you on the first render? When might you pair it with `useEffect` (for example, to load items from an API into that array)?

**Step 2 — RUN:** Open the Week 5 starter kit and run it:

```bash
cd "week 5/starter-kit/app-template"
npm install
npm run dev
```

Navigate to `localhost:3000`, `localhost:3000/dashboard`, and `localhost:3000/login`. Observe what each page shows.

**Step 3 — INVESTIGATE:** Open each file and answer:

| File | What does it display? | Does it have "use client" at the top? | Does it use useState or useEffect? |
|------|----------------------|---------------------------------------|------------------------------------|
| `src/app/page.tsx` | | | |
| `src/app/dashboard/page.tsx` | | | |
| `src/app/login/page.tsx` | | | |
| `src/app/layout.tsx` | | | |

**Key question:** The `layout.tsx` file wraps every page in the app. Open it. What HTML does it share across all pages? (Hint: look for the Navbar component.)

**Step 4 — MODIFY:** Make one small change that confirms your understanding:

1. Open `src/app/page.tsx`
2. Find the heading text (something like "Welcome" or the app name)
3. Change it to your name: `<h1>Hello from [Your Name]</h1>`
4. Save the file and watch the browser auto-refresh (Hot Module Replacement)
5. Navigate to `/dashboard` — did the heading change there too? Why or why not?

**Step 5 — MAKE:** Create a new page from scratch:

1. Create the folder: `src/app/about/`
2. Create the file: `src/app/about/page.tsx`
3. Add minimal content:
   ```typescript
   export default function AboutPage() {
     return (
       <div>
         <h1>About This App</h1>
         <p>Built for TECHIN 510, Week 5.</p>
       </div>
     );
   }
   ```
4. Navigate to `localhost:3000/about` — you just created a new URL.

**Reflection (write in your AI Usage Log):** How does the App Router model (file = route) change how you think about building a multi-page application, compared to Streamlit's `st.selectbox` navigation pattern?

---

### Tech Stack Decision Framework

Starting this week, you choose your stack. Use this framework to decide:

| Factor | Choose Streamlit | Choose Next.js + Supabase |
|--------|-----------------|--------------------------|
| **Users** | Single user (yourself, one stakeholder) | Multiple users need access |
| **Authentication** | Not needed | Login/signup required |
| **Data persistence** | Session-only or file-based | Data must persist across sessions and users |
| **Deployment target** | Quick demo, internal tool | Production web app |
| **Primary language** | Python-centric, data science | TypeScript/JavaScript, web development |
| **Visualization** | Heavy data viz (Plotly, charts) | Custom UI, interactive components |
| **Build speed** | Fastest for Python developers | Fastest for web developers |
| **Example** | "Show staff a dashboard of system statuses" | "Let multiple staff log incidents and track resolution" |

Write your tech stack choice and a 1-sentence justification in your Spec Checkpoint.

---

### Level 1: API Exploration

**Goal:** Call a public REST API and display the results in a simple page.

#### If you chose Streamlit (Python):

Create your project and virtual environment. Create `requirements.txt`:
```
streamlit>=1.38.0,<2.0
requests>=2.31.0,<3.0
python-dotenv>=1.0.0,<2.0
pandas>=2.1.0,<3.0
supabase>=2.10.0,<3.0
```

Create a file: `.env.example`:

```bash
# Copy to .env and fill in your keys: cp .env.example .env

# Only needed if your API requires a key:
# OPENWEATHER_API_KEY=your_key_here
# NEWS_API_KEY=your_key_here
# NASA_API_KEY=DEMO_KEY
# GITHUB_TOKEN=your_token_here

# Supabase (used in Level 2):
# SUPABASE_URL=https://your-project-id.supabase.co
# SUPABASE_KEY=your-anon-key-here
```
Initialize git and create `.gitignore`. Note that your secrets and env files should be included in `.gitignore`.

**What you build -- `app.py`:**

Implement a small Streamlit app that calls **one public REST API** and shows **live** results on the page (table, list, or cards -- your choice).

- **Suggested API (optional):** [Open-Meteo](https://open-meteo.com/) forecast API needs no API key. Pick latitude/longitude and which daily fields you want (e.g. max/min temperature, precipitation). You may use a different public API if you prefer; some require keys in `.env` (see `.env.example` comments).
- **HTTP:** Use `requests` (or equivalent) with query parameters, and always set a **request timeout**.
- **Errors:** Handle failures users actually hit -- at minimum timeout, HTTP errors, and connection errors -- and show **clear messages in the UI** (not a silent failure or a raw stack trace).
- **Performance:** Avoid refetching the same API response on every rerun when it is not necessary; Streamlit’s **`st.cache_data`** with a TTL is the intended pattern for cached fetches.
- **Layout:** At least a page title and your data view. Optional: a sidebar (e.g. location or parameter choices).

When it works:

```bash
streamlit run app.py
```

#### If you chose Next.js (TypeScript):

```bash
npx create-next-app@latest techin510-week5
```

When prompted, accept: TypeScript Yes, ESLint Yes, Tailwind Yes, `src/` directory Yes, App Router Yes. Defaults are fine for everything else.

```bash
cd techin510-week5
npm run dev
```

Open `src/app/page.tsx` and implement the page yourself (or use a coding agent with **your own** prompt). Requirements:

- Call **one public REST API** and render **live** data (table, list, or cards).
- Use the browser **`fetch`** API. A common pattern is to run the request inside **`useEffect`** on the client; if you use hooks and event handlers, the file needs **`"use client"`** at the top.
- Show a **loading** state while the request is in flight.
- Show an **error** state if the request fails (network error, non-OK response, or invalid JSON) -- user-visible, not only `console.error`.
- Optional: [Open-Meteo](https://open-meteo.com/) is a good no-key default (pick location and fields); other APIs may need env vars.

**Level 1 Checkpoint:** You should see live data from your API displayed on screen -- a table, a list, or cards. If you see data, Level 1 is complete.

---

### Level 2: Supabase Setup

**Goal:** Create a Supabase table, insert sample data, and read it from your app.

#### Step 1: Verify Your Supabase Project

Go to [supabase.com/dashboard](https://supabase.com/dashboard) and confirm `techin510-lab5` shows a green status.

#### Step 2: Create a Table

In the Supabase dashboard, click **Table Editor** > **Create a new table**.

Configure a table relevant to IT monitoring (or use the default bookmarks table):

**Option A -- IT Incident Log:**

| Column | Type | Default | Nullable | Notes |
|--------|------|---------|----------|-------|
| `id` | int8 | (auto) | No | Primary key (auto-generated) |
| `created_at` | timestamptz | `now()` | No | Already exists by default |
| `system_name` | text | (none) | No | e.g., "Wi-Fi", "Printer", "Room Display" |
| `status` | text | `'operational'` | No | "operational", "degraded", "down" |
| `description` | text | (none) | Yes | Notes about the incident |
| `reported_by` | text | (none) | Yes | Who reported it |

**Option B -- Bookmarks (simpler):**

| Column | Type | Default | Nullable | Notes |
|--------|------|---------|----------|-------|
| `id` | int8 | (auto) | No | Primary key |
| `created_at` | timestamptz | `now()` | No | Default |
| `title` | text | (none) | No | Bookmark title |
| `url` | text | (none) | No | Bookmark URL |
| `category` | text | `'general'` | No | Category |
| `description` | text | (none) | Yes | Optional notes |

**Important:** Turn Row Level Security (RLS) OFF for now. We will learn RLS later.

Click **Save**, then test by clicking **Insert row** and adding a sample row manually.

#### Step 3: Get Your Credentials

Go to **Project Settings** > **API** in the Supabase dashboard. Copy:
- **Project URL** (e.g., `https://abcdefgh.supabase.co`)
- **anon (public) key** (starts with `eyJ...`)

Add these to your `.env` file (Streamlit) or `.env.local` file (Next.js):

**For Streamlit (`.env`):**
```bash
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-anon-key-here
```

**For Next.js (`.env.local`):**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

#### Step 4: Connect from Code

**Streamlit path** -- create `db_app.py` (or extend your existing app in a new file). Implement it yourself; requirements:

- Load **`SUPABASE_URL`** and **`SUPABASE_KEY`** from the environment (after `load_dotenv()`). If either is missing, show a clear error and **`st.stop()`**.
- Create a Supabase client with **`create_client`** from the `supabase` package.
- **Create:** A form (or equivalent) that **inserts** a new row into **the table you created in Step 2** (`incidents` or `bookmarks` -- use the real table name).
- **Read:** After load or after a change, **select** all rows, ordered by **`created_at`** descending, and display them (table, expanders, or list).
- **Delete:** A way to **delete** one row at a time (e.g. by `id`). Confirm deletes refresh the UI (e.g. `st.rerun()` after success).
- **Schema alignment:**
  - **Option A (`incidents`):** Form fields should map to your columns, at minimum `system_name`, `status`, and optional `description` (and `reported_by` if you added it).
  - **Option B (`bookmarks`):** Map to `title`, `url`, `category`, and optional `description` -- not the incident field names.
- Handle Supabase errors in the UI (try/except or check the client response) so failed inserts/deletes are visible.

```bash
streamlit run db_app.py
```

**Next.js path** -- install the Supabase client and wire up a page:

```bash
npm install @supabase/supabase-js
```

Add **`src/lib/supabase.ts`**: export a Supabase client from **`@supabase/supabase-js`** using **`NEXT_PUBLIC_SUPABASE_URL`** and **`NEXT_PUBLIC_SUPABASE_ANON_KEY`** from `process.env`. Do not commit `.env.local` or paste real keys into source files.

Implement **`src/app/status/page.tsx`** (path name may vary) as a **`"use client"`** page that:

- Imports your shared client from `@/lib/supabase` (or your chosen alias).
- **Reads** rows from **your** Step 2 table, ordered by `created_at` descending, with **loading** and **error** states.
- **Inserts** new rows via a form whose fields match **Option A** (`system_name`, `status`, `description`, etc.) or **Option B** (`title`, `url`, `category`, `description`).
- Provides **delete** per row (by `id`).
- Uses **Tailwind** for basic layout. Use your own agent prompt or code; the table name and columns must match what you created in Supabase, not a fixed template.

**Level 2 Checkpoint:** You can add a row through your app, refresh the page, and the row persists. You can delete a row and it disappears. Data survives a page refresh because it lives in the database.

---

### Level 3: Next.js Scaffolding

**Goal:** If you have not already created a Next.js project, do so now. If you already did (choosing Next.js in Level 1), skip to understanding the file structure.

```bash
npx create-next-app@latest my-techin510-app
```

Accept the recommended defaults (TypeScript, Tailwind, App Router, `src/` directory).

#### Understanding the File Structure

```
my-techin510-app/
  src/
    app/
      layout.tsx      # Shared layout wrapper (nav, footer)
      page.tsx         # Home page (the "/" route)
      globals.css      # Global styles
  public/              # Static assets (images, icons)
  package.json         # Dependencies and scripts
  .env.local           # Environment variables (create this yourself)
  next.config.ts       # Next.js configuration
  tsconfig.json        # TypeScript configuration
```

**Note:** The exact files and names above are a guide. **`create-next-app` output changes with Next.js version**, so your tree may not match line-for-line. If you use an **AI coding assistant** to scaffold or write features, what you get can also **differ from run to run or from a classmate’s repo**—that is normal. Check your work against the **concepts** in this section (routes, `layout`, client vs server components), not an identical folder snapshot.

Key concepts:
- **`app/page.tsx`** is the home page. Every `page.tsx` inside a folder becomes a route (e.g., `app/about/page.tsx` becomes `/about`).
- **`app/layout.tsx`** wraps every page. Put navigation here.
- **`"use client"`** at the top of a file means it runs in the browser (needed for `useState`, `useEffect`, event handlers).
- **Files without `"use client"`** are Server Components -- they run on the server and can fetch data directly.

JSX is JavaScript that looks like HTML. Use `className` instead of `class`. Embed JavaScript in `{curly braces}`. Components are functions that return JSX.

**Level 3 Checkpoint:** Run `npm run dev` and see the default Next.js page at `http://localhost:3000`. You can explain what `page.tsx`, `layout.tsx`, and `"use client"` do.

---

### Level 4: Connect Everything

**Goal:** Build an app that fetches from an external API AND reads/writes to Supabase.

**Example:** A system status dashboard that:
- Pulls weather data from Open-Meteo (external API) to show if outdoor systems might be affected
- Stores incident logs in Supabase so staff have a persistent record
- Displays a combined view with traffic-light status indicators (green/yellow/red)

Combine your Level 1 API work with your Level 2 Supabase work into **one** app (same page or clearly linked views). Your external API and Supabase table can differ from the example below -- adapt names and fields to what you actually built.

**Example merge brief (write your own prompt or implement directly):** (1) Fetch weather (or your Level 1 API) and show the key fields you care about. (2) Read/write your Supabase data -- **`incidents`** or **`bookmarks`**, with the columns from Step 2. (3) If you use status-like fields (e.g. Option A), add color-coded indicators (green / yellow / red) where it makes sense.

**Level 4 Checkpoint:** Your app displays data from an external API and reads/writes to Supabase on the same page. The interviewee (or a classmate playing their role) could look at this and get useful information.

---

### Responsive Design Check

Responsive design means your application looks and works well on screens of different sizes (e.g., a wide desktop monitor, a narrow phone screen). If your system map touchpoints include users on mobile devices, responsive design is not optional.

Even if all your touchpoints are desktop users, responsive design is good practice. Evaluators, instructors, and demo audiences often pull up student apps on phones or tablets.

**Step 1: Test Your App at Phone Width**

1. Open your running app in Chrome (or any browser)
2. Press F12 to open DevTools
3. Click the "Toggle device toolbar" button (it looks like a phone/tablet icon in the top-left of DevTools, or press Ctrl+Shift+M / Cmd+Shift+M)
4. Select "iPhone 14 Pro" from the device dropdown (or any phone preset)
5. Reload the page

**Step 2: Note What Breaks**

Check each of these items at phone width:

| Element | Works at Phone Width? | What Breaks? |
|---------|----------------------|--------------|
| Page title -- is it fully visible? | Yes / No | |
| Navigation -- can you access all pages/sections? | Yes / No | |
| Forms -- can you fill out and submit forms? | Yes / No | |
| Tables -- can you read table content? (horizontal scrolling?) | Yes / No | |
| Charts -- are they readable? (labels visible, hover works?) | Yes / No | |
| Buttons -- are they large enough to tap with a finger? | Yes / No | |
| Text -- is the font size readable without zooming? | Yes / No | |

**Step 3: Fix the Most Critical Issue**

Pick the most severe breakage from your check and fix it. Common responsive fixes:

**For Streamlit apps:**
- Tables that overflow: Use `st.dataframe(df, use_container_width=True)` to make tables fit the screen width
- Charts that are too small: Use `st.plotly_chart(fig, use_container_width=True)` for responsive charts
- Sidebar content: Streamlit automatically collapses the sidebar on mobile -- make sure your app still works without the sidebar visible

**For Next.js apps:**
- Text that overflows: Use Tailwind's responsive utilities like `text-sm md:text-base` to adjust font sizes
- Columns that stack poorly: Use `flex flex-col md:flex-row` to stack vertically on mobile and horizontally on desktop
- Tables that overflow: Wrap in `<div className="overflow-x-auto">` to allow horizontal scrolling
- Tap targets too small: Ensure buttons and links have at least `p-2` padding (minimum 44x44 pixels for touch targets)

**Record your results.** Note what broke and what you fixed. Include this in your Component B deliverables.

---


### Level 5: Stretch Goals

Implement one of these structured challenges:

**Option A: Add a Second API**
- **Goal:** Integrate a second API alongside your first one. For example, combine weather data with news headlines, or population data with an image API.
- **Guiding prompt:** "Add a second API call to [API name] and display the results alongside the existing data. Show both in separate tabs using st.tabs()."
- **Checkpoint:** Your app displays data from two different APIs on the same page. Both have error handling.

**Option B: CRUD with Validation (Supabase)**
- **Goal:** Add input validation to your Supabase CRUD operations. Apply the assert verification pattern from Week 4 to ensure data integrity.
- **Checkpoint:** Submitting empty fields shows a user-friendly error. Your assert statements verify that row counts match expectations after insert/delete.

**Option C: Deploy to Vercel or Streamlit Cloud**
- **Goal:** Deploy your app so anyone with the URL can access it.
- **Checkpoint:** The live URL works and shows your data. You have verified no secrets are exposed in the deployment.

---

### Security Checklist

Before you leave, verify:

- [ ] **No hardcoded secrets** in your code files (API keys, Supabase keys must be in `.env` / `.env.local`)
- [ ] **`.env` is in `.gitignore`** (and `.env.local` for Next.js)
- [ ] **Error handling** on every API call and database operation (try/except or try/catch)
- [ ] **Environment variables** loaded with `os.getenv()` (Python) or `process.env.` (JavaScript)

Quick check:
```bash
# Run in your project directory:
grep -r "eyJ" --include="*.py" --include="*.ts" --include="*.tsx" --include="*.js" .
grep -r "sk-" --include="*.py" --include="*.ts" --include="*.tsx" --include="*.js" .
```

If either command returns results, you have a hardcoded secret. Move it to `.env` immediately.

---

## Component C: System Architecture & Design

---

### C.1 Architecture Concept: Client-Server Architecture (3-Tier) 

#### The Big Idea

Until now, your Streamlit apps have been **single-tier**: the code that handles the user interface, the logic, and the data all live in one Python file running on one machine. This is fast to build, but it has limits. What if two people need to use the app at the same time? What if you need data to persist after the app is closed? What if you want to separate "what the user sees" from "where the data lives"?

The answer is **client-server architecture**, and the most common form is the **3-tier model**:

1. **Presentation tier (client):** What the user sees and interacts with. In Next.js, this is the browser running your React pages.
2. **Logic tier (server):** The code that processes requests, enforces rules, and coordinates between the client and the data. In Next.js, this is your API routes.
3. **Data tier (database):** Where data is stored permanently. In this course, this is Supabase (a cloud-hosted PostgreSQL database).

If you built **Next.js + Supabase** in Component B, you moved toward a **3-tier** split:

- **Browser** (presentation): Your Next.js pages render in the user's browser
- **API routes** (logic): Next.js server-side code handles requests, validates data, talks to the database
- **Supabase** (data): Your cloud database stores data permanently, across sessions and users

If you stayed on **Streamlit** for Component B, the same *logical* layers still exist (UI, Python logic, Supabase), but they often run in **one server process** — your C.2 diagram should still show three tiers, with **Tier 2** labeled as your **Streamlit app server** (Python) instead of Next.js API routes.

Your early Streamlit-only apps ran all responsibilities in one file. Separating tiers (especially with Next.js) makes the system more powerful but also more complex.

---

### C.2 Diagramming Exercise: Draw a 3-Tier Diagram

#### Instructions

Draw a 3-tier architecture diagram for the app you built today. Show the three tiers, what lives in each one, and what flows between them.

#### Step-by-Step

1. **Draw three boxes** stacked vertically or arranged left to right. Label them:
   - **Tier 1: Browser (Client)**
   - **Tier 2: Application server (logic)** — *Next.js server / API routes* **or** *Streamlit Python server* (whichever matches your Component B stack)
   - **Tier 3: Supabase (Database)**

2. **Fill in each box** with specific components from your app:
   - Browser: Next.js `page.tsx` / React components **or** Streamlit-rendered UI, user interactions
   - Server: Next.js API routes, validation **or** Streamlit callback / Python functions that call Supabase and external APIs
   - Database: Tables you created, columns, relationships

3. **Draw arrows** between the tiers showing what data flows and in which direction. Label each arrow with the type of request or response:
   - Browser -> Server: e.g. "HTTP requests to Next.js" or "HTTP to Streamlit app"
   - Server -> Database: "SQL queries (SELECT, INSERT, UPDATE, DELETE)"
   - Database -> Server: "Query results (rows of data)"
   - Server -> Browser: "HTML/JSON responses"

4. **Add an external API** (like Open-Meteo weather) as a fourth box to the side, connected to the **Tier 2** box (your app server fetches it).

#### What to Include

- All three tiers with specific contents from YOUR app
- Arrows labeled with the type of communication (HTTP, SQL, JSON)
- Direction of data flow (requests go one way, responses come back)
- Any external APIs as a separate box connected to the server tier

#### Checkpoint

You are done when:
- [ ] Your diagram has three clearly labeled tiers with specific contents from your app
- [ ] Arrows between tiers are labeled with what flows between them
- [ ] You can point to any tier and explain what its job is in one sentence
- [ ] External APIs (if used) are shown as a separate component connected to the server tier

---

### C.3 Design Decision Log

#### The Template

| Field | Your Entry |
|-------|------------|
| **Decision** | What did you decide? |
| **Alternatives considered** | What else could you have done? |
| **Why you chose this** | What constraint drove it? |
| **Trade-off** | What did you give up? |
| **When would you choose differently?** | Under what conditions? |

#### This Week's Decision Prompt

> **"Why did you choose (or why would you choose) Streamlit (single-tier) versus Next.js + Supabase (multi-tier) for this week's problem?"**

If you used the Tech Stack Decision Framework in the lab, reference the factors that mattered most.

Think about:
- Does the **interviewee's** problem (this week: equipment checkout / returns workflow) require multiple users with their own accounts, or is it a single-user tool?
- Does data need to persist across sessions and be shared between users?
- How fast did you need to prototype versus how production-ready does the result need to be?
- What is the cost of switching stacks later if you start with the wrong one?

#### Example Entry

| Field | Example |
|-------|---------|
| **Decision** | Used Streamlit for the API explorer, then scaffolded a Next.js app for the incident tracker |
| **Alternatives considered** | (1) Build everything in Streamlit, (2) Build everything in Next.js, (3) Use Streamlit with a local SQLite database |
| **Why you chose this** | The API explorer is a single-user exploration tool -- Streamlit is perfect for that. The incident tracker needs multiple users and persistent shared data, which requires auth and a real database. |
| **Trade-off** | I now maintain two apps in two languages. If I had used Next.js for everything, I would have one codebase but a slower start for the API explorer. |
| **When would you choose differently?** | If staff only need a personal dashboard (no shared access), Streamlit + SQLite would be simpler and sufficient. If the project needed to be a single production app from the start, I would skip Streamlit and build everything in Next.js. |

---

## Component D: Testing & Validation

> This week you integrated external APIs and set up a Supabase database. When your app depends on external services, new categories of failure emerge: the API might reject your request, return unexpected data, or demand authentication you forgot to include. This exercise introduces **contract testing** -- verifying that your app and the external service agree on what valid communication looks like.

---

### D.1 Validation Exercise: API Contract Test

#### What you are testing

A **contract** between your app and an API is like a contract between a restaurant and a food supplier: the restaurant orders specific items in a specific format, and the supplier delivers specific items in a specific format. If either side breaks the contract (the restaurant orders something not on the menu, or the supplier delivers rotten produce), the system breaks.

Today you will test 3 scenarios that cover the most common ways the contract between your app and an API/database can break:

1. **Valid input** -- Does the happy path work?
2. **Invalid input** -- Does the API reject bad data gracefully?
3. **Missing/wrong authentication** -- What happens without credentials?

#### Instructions

**Step 1: Choose your API or database endpoint**

Pick one API endpoint or Supabase operation from your app. Good candidates:

- Your weather/data API call (from Level 1)
- Your Supabase insert operation (from Level 2)
- Your Supabase read/query operation (from Level 2)

**Step 2: Test Case 1 -- Valid Input (Happy Path)**

Make a request with correct, expected input. For example:

**If testing an API:**

> **HTTP Status Codes Quick Reference:** APIs respond with numeric codes to tell you what happened. **200** = success (OK). **400** = bad request (you sent invalid data). **401** = unauthorized (missing or wrong API key). **403** = forbidden (you do not have permission). **404** = not found (wrong URL). **429** = too many requests (rate limited). **500** = server error (something broke on their end).

```python
# Valid API call -- should return 200 and data
import requests

response = requests.get(
    "https://api.open-meteo.com/v1/forecast",
    params={"latitude": 47.61, "longitude": -122.33, "daily": "temperature_2m_max"},
    timeout=10
)
print(f"Status: {response.status_code}")
print(f"Has data: {'daily' in response.json()}")
```

**If testing Supabase:** (Adapt table and column names if you used **bookmarks** or a custom schema instead of **incidents**.)

```python
# Valid Supabase insert -- should succeed
result = supabase_client.table("incidents").insert({
    "system_name": "Wi-Fi",
    "status": "operational",
    "description": "Test entry"
}).execute()
print(f"Success: {result.data is not None}")
print(f"Rows returned: {len(result.data)}")
```

Record: What status code did you get? What data was returned? Does it match what you expected?

**Step 3: Test Case 2 -- Invalid Input**

Make a request with deliberately wrong or malformed input:

**If testing an API:**

```python
# Invalid input -- latitude out of range
response = requests.get(
    "https://api.open-meteo.com/v1/forecast",
    params={"latitude": 999, "longitude": -122.33, "daily": "temperature_2m_max"},
    timeout=10
)
print(f"Status: {response.status_code}")
print(f"Response: {response.text[:200]}")
```

**If testing Supabase:**

```python
# Invalid input -- missing required field
result = supabase_client.table("incidents").insert({
    "status": "operational"
    # system_name is missing (required NOT NULL field)
}).execute()
```

Record: Did the API/database reject the bad input? What error message did you get? Does your app handle this error gracefully (user-friendly message) or does it crash?

**Step 4: Test Case 3 -- Missing or Wrong Authentication**

Test what happens when credentials are missing or incorrect:

**If testing an API that requires a key:**

```python
# Wrong API key
response = requests.get(
    "https://api.example.com/data",
    headers={"Authorization": "Bearer WRONG_KEY"},
    timeout=10
)
print(f"Status: {response.status_code}")  # Expected: 401 or 403
```

**If testing Supabase with RLS off (this week's setup):**

```python
# Test with empty/wrong Supabase key
from supabase import create_client
bad_client = create_client("https://your-project.supabase.co", "not-a-real-key")
try:
    result = bad_client.table("incidents").select("*").execute()
    print(f"Unexpectedly succeeded: {result.data}")
except Exception as e:
    print(f"Correctly rejected: {type(e).__name__}: {e}")
```

Record: Did the service correctly reject the unauthenticated request? What error was returned?

> **Note:** If your chosen API does not require authentication (like Open-Meteo), skip the auth test and instead test a third type of invalid input (e.g., empty string, extremely long string, special characters in a field).

**Step 5: Record your results**

Use the recording template below.

#### Recording Template

Copy this table into your submission document:

| # | Test Case | Input Description | Expected Outcome | Actual Outcome | Status Code | Pass/Fail |
|---|-----------|-------------------|-----------------|----------------|-------------|-----------|
| 1 | Valid input | _Latitude 47.61, longitude -122.33, daily forecast_ | _200 OK, JSON with daily temperatures_ | _200, received 7-day forecast data_ | _200_ | _Pass_ |
| 2 | Invalid input | _Latitude 999 (out of range)_ | _400 Bad Request or error message_ | _400, "Latitude must be in range..."_ | _400_ | _Pass_ |
| 3 | Missing auth | _Wrong Supabase anon key_ | _401 Unauthorized or connection error_ | _Exception: "Invalid API key"_ | _401_ | _Pass_ |

#### What "passing" looks like

- You tested 3 distinct scenarios (valid, invalid, missing-auth or third invalid variant)
- Each test has a clear expected outcome written BEFORE you ran the test
- Actual outcomes are documented with status codes and response details
- All 3 tests either confirm correct behavior or identify a gap in your app's error handling

#### API response asserts (Learning Objective 7)

Add **two** `assert` statements (Python or TypeScript) that check the **external API** you integrated in Component B (e.g., expected keys in JSON, numeric ranges). Place them where they run when you fetch data (or in a small test file). Point TAs to the file path in your README (see **Component D Deliverables**).

---

### D.2 Quality Gate

Before you submit, every item below must be satisfied:

- [ ] **API/database test cases documented**: Your recording template has 3 complete rows covering valid input, invalid input, and auth/edge case scenarios
- [ ] **Expected vs. actual recorded**: Each row shows what you expected AND what actually happened
- [ ] **Status codes noted**: HTTP status codes or error types are documented for each test
- [ ] **Error handling verified**: For the invalid input and auth tests, your app shows a user-friendly error message (not a raw traceback). If it does not, document that as a finding
- [ ] **No hardcoded secrets**: Run the security check from the lab manual's Security Checklist. Confirm no API keys appear in your code files
- [ ] **External API asserts**: Two asserts for your Component B API response are committed in the repo and the README lists where to find them

---

### D.3 Testing Concept Preview: Contract Testing

#### What is contract testing?

**Contract testing** in software verifies that two systems agree on the format and rules of their communication:

- "I will send you a JSON object with fields `latitude` and `longitude`, both numbers"
- "You will respond with a JSON object containing a `daily` field with an array of temperatures"
- "If I send invalid data, you will respond with a 400 status code and an error message"
- "If I send no authentication, you will respond with a 401 status code"

The "contract" is the agreement about what inputs are valid, what outputs to expect, and how errors are communicated.

#### Why this matters

- APIs change over time. A field that was optional becomes required. A response format changes. Contract tests catch these breaking changes before your users do.
- When your app integrates multiple services (an API + a database + an AI model), each integration point is a potential failure. Contract tests verify each connection independently.
- AI-generated code often makes assumptions about API response formats. A contract test verifies those assumptions are correct.

Today you tested three aspects of the contract between your app and an external service: "does it accept valid input?", "does it reject invalid input?", and "does it enforce authentication?" These are the three most fundamental properties of any API contract. In professional settings, these tests run automatically every time the code changes.

---

## Component E: Applied Challenge — The API Connector

**Canvas / grading:** Your instructor may list this on Canvas as part of **Assignment 2** or under another name. Whatever the title, submit the artifacts in **[Submission → Component E deliverables](#component-e-deliverables)** below (same GitHub repo as Components B–D unless you are told otherwise).

### The Problem

GIX events — guest lectures, workshops, career panels — are scattered across emails, Slack, and flyers. No one knows what's happening this week without asking around. Design a system where events are stored in Supabase and displayed in a browsable frontend with category filters and proper error handling.

### What You Build

- A Supabase table with sample event records
- A frontend (Next.js or Streamlit) displaying events with a category filter
- A system architecture map with labeled boundaries
- Error handling for 3 failure modes
- Security verification (no hardcoded secrets)

### Part 1: Architecture & Design

Draw a **system architecture map** showing all layers from user interaction to data storage.

At each boundary between layers, label:
- The **data format** crossing that boundary
- One **potential error** that could occur at that boundary

### Part 2: Implementation

1. Create a Supabase table with a schema you design to capture event information
2. Populate your table with sample data across multiple categories
3. Build a frontend page that:
   - Fetches events from Supabase
   - Displays them in a list or card layout
   - Includes a category filter
   - Handles at least 3 error scenarios gracefully. Identify which errors are most likely for your system and document how your app responds.

### Part 3: Testing & Validation

1. **Assert statements** (2 required): Write 2 assert statements verifying your **events + Supabase** pipeline (e.g., query returns a list, required fields present after fetch). These are **in addition to** the **Component B external API** asserts listed under [Component D Deliverables](#component-d-deliverables).
2. **Error scenario tests** (3 required): Test at least 3 failure conditions. For each, document: what you did, what you expected, and what actually happened.
3. **Security check:** Verify no API keys or secrets are hardcoded in your source files. Document where your secrets are stored.

---

## Troubleshooting Matrix

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| API returns 401 Unauthorized | API key missing, expired, or wrong variable name | Check `.env` file. Verify key name matches exactly (e.g., `OPENWEATHER_API_KEY` not `OPENWEATHER_KEY`). Test with curl: `curl "https://api.example.com/data?key=YOUR_KEY"` |
| API returns 403 Forbidden | Free tier does not include this endpoint | Check API docs for free-tier endpoint restrictions |
| API returns 429 Too Many Requests | Rate limit exceeded | Wait and retry. Add caching (`@st.cache_data(ttl=300)` or local state). Check the API's rate limit docs. |
| CORS error in browser | External API blocks browser requests | Move the API call to a Next.js API route (server-side). Ask Cursor: "Move this fetch to a server-side API route." |
| `ModuleNotFoundError: No module named 'supabase'` | Package not installed in active venv | Run `pip install "supabase>=2.10.0,<3.0"`. Verify venv is activated (look for `(venv)` in terminal prompt). |
| Supabase returns empty data `[]` | Table has no rows, or RLS is blocking | Check Table Editor for rows. If RLS is on, disable it (shield icon in Table Editor). |
| `create_client() missing required argument` | `SUPABASE_URL` or `SUPABASE_KEY` is `None` | Check `.env` exists, variable names match, and `load_dotenv()` is called before `os.getenv()`. |
| `npx create-next-app` fails | Node.js not installed or below v18 | Install from [nodejs.org](https://nodejs.org). Close and reopen terminal after install. Run `node --version`. |
| `npm run dev` port-in-use error | Port 3000 already taken | Run `npx kill-port 3000` then `npm run dev`. Or use `npm run dev -- --port 3001`. |
| Vercel build fails | TypeScript error or missing dependency | Check Vercel build log. Run `npm run build` locally first. Fix errors, push again. |
| `.env.local` variables undefined in Next.js | Missing `NEXT_PUBLIC_` prefix, or dev server not restarted | Prefix client-side vars with `NEXT_PUBLIC_`. Restart the dev server after changing env files. |
| `set_page_config` error in Streamlit | Another `st.*` call runs before `set_page_config` | Move `st.set_page_config()` to immediately after imports and `load_dotenv()`, before any `st.error()` or `st.stop()`. |
| Supabase returns 403 on insert/delete | RLS enabled with no policies | In Table Editor, click your table > shield icon > toggle RLS OFF. We cover RLS in a later week. |
| `pip install supabase` build errors | Native dependencies failing to compile | Run `pip install --upgrade pip setuptools wheel` first. On Mac: `xcode-select --install`. Retry. |
| `create-next-app` hangs | Slow network during package download | Wait. If stuck, Ctrl+C, delete folder, retry. Try `npx create-next-app@latest my-app --use-npm`. |
| `JSONDecodeError` when calling API | API returned HTML instead of JSON (wrong URL or API is down) | Print `response.text` to see what was returned. Verify URL and parameters. |
| `git push` says "remote already exists" | Project already has a remote configured | Use `git remote set-url origin <your-url>` instead of `git remote add origin`. |
| Streamlit reruns on every click | Normal Streamlit behavior -- all code re-executes | Use `@st.cache_data(ttl=300)` for API calls. Use `st.session_state` for persistent UI state. |
| Python `dict | None` syntax error | Python version below 3.10 | Use `Optional[dict]` from `typing` module instead. Check version: `python3 --version`. |

---

## Submission

Submit a link to your **GitHub repo** on Canvas. Your README should document how to install, configure environment variables, and run the app so a TA can reproduce your results. If Canvas uses a different assignment title (e.g., **Assignment 2 — Data Explorer App**), it still maps to these components.

### Component A Deliverables

1. Interview scripts and notes
2. **System map sketch** — boxes and arrows showing the **interviewee's** tools and systems, data flows, and pain points, with system touchpoints marked (hand-drawn photo or digital diagram)

### Component B Deliverables

1. **Screenshot** of your running app showing data from at least 1 external API and Supabase CRUD working (include a link to the API docs you used in your README)
2. **Responsive design summary** — the completed checklist table from the [Responsive Design Check](#responsive-design-check) (or a short bullet list), including **one** issue you found at phone width and **what you changed** to fix it
3. **Tech stack justification** — 1 sentence explaining why you chose Streamlit or Next.js for this problem (from your [Spec Checkpoint](../templates/spec-checkpoint-template.md))

### Component C Deliverables

1. **Architecture diagram** from the [C.2](#c2-diagramming-exercise-draw-a-3-tier-diagram) exercise for your **Component B** app (hand-drawn photo or digital). This is the **3-tier** view (browser, app server, Supabase + external API).
2. **Design Decision Log** entry from C.3

**C.2 vs. Component E:** The **C.2** diagram is only for the **integrated API + Supabase app** from Component B. **Component E** requires a **separate** system architecture map (Part 1) with boundary labels and errors — do not substitute one for the other.

### Component D Deliverables

1. **Validation results** from D.1 exercise (completed recording template)
2. **Quality gate checklist** — all items checked from D.2
3. **External API assert statements** — two asserts for your Component B API response (see [API response asserts](#api-response-asserts-learning-objective-7)). Commit them in the repo and add a **README** line with the **file path** (and function name if helpful) so TAs can find them quickly

### Component E deliverables

Submit as part of the **same repo** unless your instructor specifies otherwise.

1. **Working events UI** — code that reads from your **events** Supabase table and shows a **category filter** (screenshot in README is fine)
2. **System architecture map** from **Component E → Part 1: Architecture & Design** (image/PDF in repo or attached on Canvas) with **data format** and **one potential error** labeled at each boundary
3. **Testing write-up** (README section or `docs/component-e.md`): **3** error/failure scenario tests (what you did, expected, actual) + **2** assert statements for the **events/Supabase** pipeline (snippet or file path)
4. **Security** — confirm where secrets live; no keys in source (align with the [Security Checklist](#security-checklist) and E Part 3)

### AI Usage Log

Document 3 AI interactions from today. For each interaction:
- **What you prompted:** The exact prompt or request you gave the AI
- **What it produced:** Summary of the AI's output
- **AI assumption:** Identify one assumption the AI made that you did not explicitly state in your prompt
- **Failure mode:** Describe what could go wrong (or did go wrong) because of that assumption
- **What you would change:** How would you modify your prompt or workflow to prevent this failure?

### Reflection

3-5 sentences (see Reflection section below)

---

## Reflection

Write 3-5 sentences addressing these questions:

1. **Transition:** What surprised you about the difference between building in Streamlit versus Next.js? What felt easier? What felt harder? *(Look at your Week 3 reflection on PRIMM. How does reading AI-generated Python compare to reading AI-generated TypeScript?)*
2. **System map:** What did the system map reveal about the **interviewee's** pain that you would not have understood from the interview questions alone? *(Compare this to the JTBD statement from Week 4 — which format captured more nuance about the user's real problem?)*
3. **Tech stack choice:** When is Streamlit the right tool, and when is Next.js + Supabase the right tool? Give a specific example of a problem that fits each.
