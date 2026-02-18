# Smart Bookmark App

A simple and secure bookmark manager built with Next.js and Supabase, featuring Google OAuth authentication, real-time sync, and a clean, responsive UI.

---

## Live Demo

[SMART BOOKMARK](https://smart-bookmark-app-navy-tau.vercel.app/)

---

## GitHub Repository

[smart-bookmark-app](https://github.com/siddharth9442/smart-bookmark-app)

---

## Features

- **Google OAuth** authentication (no email/password)
- Add bookmarks with title and URL
- Bookmarks are **private** to each user
- Real-time sync across multiple tabs without refresh
- Delete bookmarks functionality
- Responsive and modern UI using Tailwind CSS
- Deployed on Vercel with a live URL

---

## Tech Stack

- Next.js (App Router)
- Supabase (Auth, Database, Realtime)
- Tailwind CSS
- Vercel (deployment)

---

## Getting Started

### Prerequisites

- Node.js >= 16.x
- A Supabase project with authentication and database setup
- Google OAuth credentials configured in Supabase

### Installation

1. Clone the repo:

   ```bash
   git clone https://github.com/siddharth9442/smart-bookmark-app.git
   cd smart-bookmark-app
   ```


2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:  
   Create a .env.local file in the root with:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open http://localhost:3000 to view in your browser.  


### Challenges & Solutions

#### Challenge: Real-time bookmark sync across tabs  
   **Problem**: Ensuring bookmarks added or deleted in one browser tab update instantly on all other open tabs without manual refresh.  
   **Solution**: Used Supabase Realtime subscriptions to listen for changes on the bookmarks table and update the React state accordingly.

#### Challenge: Adapting to Next.js Without Prior Professional Experience  
   **Problem**: Coming from a backend engineering background with no professional experience in Next.js, building a production-ready frontend application required understanding Next.js concepts such as routing, server/client components, API routes, and deployment patterns.  
   **Solution**: Leveraged prior React knowledge from personal projects and used guidance from OpenAI to accelerate learning and implementation. Studied official documentation, followed best practices for project structure, and iteratively refactored the codebase to align with Next.js conventions, successfully delivering a fully functional application.