# 🚀 TourWidget — Product Tours & Onboarding Made Simple

**TourWidget** is the easiest way to create beautiful, interactive product tours and onboarding experiences for your web application. Build tours visually in our dashboard and embed them anywhere with a single line of code.

**🔗 Live App:** [https://tourwidget.vercel.app](https://tourwidget.vercel.app)  
**🧩 Widget Script:** `https://tourwidget-onboarding.vercel.app/tour.js`

---

## ✨ Features

### 🛠️ Tour Builder
- **No-Code Editor:** Create and edit tours directly from a user-friendly dashboard.
- **Element Targeting:** Highlight any element using CSS selectors (ids, classes) or `data-tour` attributes.
- **Smart Positioning:** Tooltips automatically position themselves (Top, Bottom, Left, Right) for the best fit.

### 📊 Analytics & Insights (New!)
- **Real-Time Data:** Track how users interact with your tours instantly.
- **Engagement Charts:** Visualize weekly trends, completion rates, and drop-off points.
- **User Metrics:** Monitor total tours started, completed, and skipped.

### ⚡ Technical Highlights
- **Universal Embed:** Works on any website (React, Vue, plain HTML) with a single `<script>` tag.
- **Responsive Dashboard:** Manage your tours on the go from mobile, tablet, or desktop.
- **Instant Sync:** Updates made in the dashboard reflect immediately on your live site.

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS & Shadcn/UI
- **Database & Auth:** Supabase
- **State Management:** Zustand
- **Visualization:** Recharts
- **Icons:** Lucide React

---

## 🚀 Getting Started

### 1. Create a Tour
Log in to the [Dashboard](https://tourwidget.vercel.app), create a new tour, and define your steps by pointing to elements on your website (e.g., `#navbar`, `.signup-btn`).

### 2. Embed the Widget
Copy the generated snippet and paste it into the `<head>` or `<body>` of your website.

```html
<script src="[https://tourwidget-onboarding.vercel.app/tour.js](https://tourwidget-onboarding.vercel.app/tour.js)"></script>
<script>
  TourWidget.init({
    tourId: "YOUR_TOUR_ID_HERE"
  });
</script>