# ReFound — Campus Lost & Found Platform

> **Tagline:** Lost things. Found people.  
> **Visual Direction:** Pinterest Visual Discovery × Editorial Classifieds × Modern Community Marketplace

---

## 🧭 About ReFound

**ReFound** is a photography-first, community-driven lost and found discovery platform tailored specifically for university campuses. Unlike generic SaaS dashboards or fragmented WhatsApp/Instagram group chats, ReFound provides an intuitive, trustworthy visual marketplace for students and campus safety officers to reunite lost belongings with their owners.

---

## 🎨 Visual Identity & Design Principles

- **Warm Editorial Aesthetic:** Warm paper background (`#FAF8F3`), rich ink typography (`#242424`), and classic editorial headings powered by *Playfair Display* contrasted with modern, legible *DM Sans*.
- **Asymmetric Masonry Grid:** Prioritizes authentic photography with natural height variations, making discovery visual and engaging like a curated Pinterest board.
- **Strictly Non-SaaS:** Avoids cookie-cutter sidebars, neon gradients, glassmorphism, or fake metric widgets. Features a horizontal top navigation bar, refined border tokens (`#EAE7DF`), and thoughtful micro-interactions.
- **Privacy-First Guardrails:** Masks sensitive student ID numbers, phone numbers, and addresses. Prompts finders and claimants to verify ownership through confidential, non-public details.

### Brand Palette

| Role | Name | Hex Code |
| :--- | :--- | :--- |
| **Canvas** | Paper Background | `#FAF8F3` |
| **Card / Surface** | Pure White | `#FFFFFF` |
| **Primary Text** | Deep Ink | `#242424` |
| **Secondary Text**| Warm Slate | `#77756F` |
| **Accent Primary**| Royal Cobalt | `#3457D5` |
| **Cobalt Light**  | Soft Blue Wash | `#E9EDFF` |
| **Lost Accent**   | Coral | `#F07861` |
| **Highlight**     | Butter Yellow | `#F5D978` |
| **Reunited Badge**| Soft Sage | `#DDEBDD` (`#2A5D33`) |
| **Border**        | Paper Border | `#EAE7DF` |

---

## 🚀 Key Features & Flows

### 1. Visual Discovery Homepage
- **Hero Section:** "Lost something? It might be right here." with a large keyword search bar and quick suggestion tags (`AirPods`, `Student ID`, `Car Keys`, `Backpack`, `Charger`).
- **Live Reunion Element:** Highlights recent successful item reunions and campus success rates.
- **Quick Category Navigation:** Instant chips with item counts for *Electronics*, *ID Cards*, *Accessories*, *Books*, *Bags*, *Clothing*, *Keys*, and *Other*.
- **Asymmetric Masonry Grid:** Recently found belongings displayed with high-resolution photography, campus location tags, and bookmark toggles.
- **Recently Lost & Reunited Sections:** Student requests and happy return stories.
- **How It Works:** 4-step editorial guide explaining reporting, verification, and safe handover.

### 2. Comprehensive Browse & Filter Directory
- Full text search across item titles, brands, colours, and building descriptions.
- **Filters:** Category chips, Lost vs. Found toggle, Campus Location filter (Library, Lecture Halls, Dining, Sports Complex, etc.), and status filter.
- **Sorting:** By Recently Posted, Event Date, or Oldest.
- Active filter badges with one-click reset.

### 3. Multi-Step Reporting Workflow
- **Step 1 — Details:** Select *I lost something* or *I found something*, title, category, colour, brand, public description, and optional private verification secret.
- **Step 2 — Location & Time:** Campus building selector, exact room/hallway details, and date/time picker.
- **Step 3 — Photographs:** Drag-and-drop file upload, image URL input, sample preset photography for demo testing, and mandatory privacy disclaimer preventing exposed student IDs.
- **Step 4 — Review & Publish:** Comprehensive preview before generating a unique listing ID and saving to LocalStorage.

### 4. Item Detail & Verification View
- Large photograph preview with thumbnail gallery.
- Detailed specifications (location, date, attributes).
- Masked finder/claimant profile card.
- Direct actions: **"This is mine — Claim it"**, Save listing, Share URL, and Flag listing.

### 5. Verified Claim & Safe Handover Workflow
- Claimants must provide:
  1. Circumstances of loss (where and when).
  2. **Confidential private proof** (e.g. engraving initials, lockscreen wallpaper, serial number, hidden sticker).
  3. Optional supporting evidence image.
- **Finder Review:** Finder can accept or reject claims based on whether the private proof matches the item in their possession.
- **In-App Messaging:** Direct private thread for finder and claimant to coordinate.
- **Safe Handover Protocol:** Recommends designated daylight campus meeting points (Central Library Desk, Campus Safety Office).
- **Double Confirmation:** Finder confirms handover, claimant confirms receipt $\rightarrow$ Triggers confetti celebration and updates status to **Reunited**.

### 6. Personal Activity Center ("My Activity")
- Personal space with 4 dedicated tabs:
  - **My Found Items:** Manage active found reports, edit details, view incoming claims, or mark reunited.
  - **My Lost Items:** Track missing reports, edit or mark recovered.
  - **Claims & Verification:** Review incoming claims with full message thread and handover coordinator.
  - **Saved Bookmarks:** Fast access to saved listings.

### 7. Campus Safety Moderator Panel
- Review flagged listings with reporter notes.
- One-click actions to dismiss flags or remove inappropriate/sensitive listings.
- Directory table of all campus listings with quick search and filters.
- Monitor all submitted claims and verify safe handovers.

### 8. Interactive Demo Persona Switcher
- Instantly switch between personas from the top navigation bar to test all sides of the workflow:
  - **Alex Chen:** Computer Science sophomore (default student user).
  - **Maya Patel:** Architecture junior (student & claimant).
  - **Jordan Lee:** Biology senior (frequent campus good samaritan / finder).
  - **Marcus Vance:** Campus Safety Staff (moderator role).
- **Reset Demo Dataset:** One-click button in the header to restore the initial 26 seeded demo listings.

---

## 🛠️ Technology Stack

- **Framework:** React 18 with Vite 6 & TypeScript
- **Styling:** Tailwind CSS with custom editorial configuration
- **Routing:** React Router v6
- **Icons:** Lucide React
- **Date Utilities:** `date-fns`
- **Celebration Effects:** `canvas-confetti`
- **Persistence:** LocalStorage with synchronized React Context

---

## 💻 Local Setup & Development

```bash
# 1. Clone repository
git clone <repo-url>
cd ReFound

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Build for production
npm run build

# 5. Preview production build
npm run preview
```

---

## 🌐 Deploy to Vercel

This repository is ready for immediate deployment on [Vercel](https://vercel.com):

1. Push your repository to GitHub.
2. In the Vercel dashboard, click **Add New Project** and select the repository.
3. Framework Preset: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Click **Deploy**.

