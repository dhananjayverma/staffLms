# CUIMS Staff Dashboard — LMS

> A modern, responsive **Learning Management System (LMS) staff portal** built for Chandigarh University (CUIMS). Provides staff members with a unified dashboard for attendance tracking, team management, announcements, and more.

---

## 📸 Preview

| Light Mode | Dark Mode |
|:---:|:---:|
| ![Light Mode Dashboard](.github/preview-light.png) | ![Dark Mode Dashboard](.github/preview-dark.png) |

> **Note:** Open `index.html` directly in your browser — no build step required.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🎨 **Light / Dark Theme** | Smooth toggle between themes with `localStorage` persistence and system preference detection |
| 📅 **Attendance Log** | Auto-scrolling carousel showing daily in-time / out-time records |
| 👥 **My Team** | Staff directory with gradient avatars, roles, email addresses and live "Present" status |
| 📣 **Announcements** | Filterable announcement board with search, pin, and detail view |
| 🗓 **Today's Timetable** | Tabbed card showing timetable and to-do list |
| 💬 **Important Messages** | Leave approval and admin messages panel |
| ❓ **Q&A / Queries** | Stats for open, closed, and total queries |
| 📝 **Feedback to Answer** | Tabbed student / staff feedback tracker |
| 📅 **Upcoming Events** | Institutional event display |
| 💼 **Internal Job Postings** | Internal career opportunity listing |
| 🔗 **Shortcut Panel** | Scrollable quick-access cards (Chat, LMS, Feedback, Important Links, etc.) |
| 📱 **Fully Responsive** | Collapsible sidebar for mobile, fluid layout for all screen sizes |

---

## 🗂 Project Structure

```
staffLms/
├── index.html          # Main application shell & all UI markup
├── css/
│   └── styles.css      # Complete design system — variables, layout, components
├── js/
│   └── app.js          # Data layer + all interactive behaviour
├── logo.png            # CUIMS institutional logo
├── profile-dummy.svg   # Default staff avatar placeholder
└── README.md           # You are here
```

---

## 🚀 Getting Started

### Prerequisites

No build tools, no Node.js, no package manager required.

| Requirement | Version |
|---|---|
| Modern Browser | Chrome 90+, Firefox 88+, Safari 15+, Edge 90+ |

### Running Locally

**Option 1 — Open directly:**
```bash
open index.html        # macOS
start index.html       # Windows
xdg-open index.html    # Linux
```

**Option 2 — Serve via VS Code Live Server:**
1. Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension
2. Right-click `index.html` → **Open with Live Server**

**Option 3 — Python HTTP server:**
```bash
cd staffLms
python3 -m http.server 3000
# Open http://localhost:3000
```

---

## 🧰 Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Structure | **HTML5** | Semantic layout, accessibility attributes |
| Styling | **Vanilla CSS** | Custom design system, CSS variables, dark mode |
| Logic | **Vanilla JavaScript (ES6+)** | DOM rendering, carousel, theme, navigation |
| Icons | [Lucide Icons](https://lucide.dev/) `v0.x` (UMD via CDN) | SVG icon set |
| Carousel | [Owl Carousel 2](https://owlcarousel2.github.io/OwlCarousel2/) (via CDN) | Touch-friendly slides |
| jQuery | [jQuery 3.7.1](https://jquery.com/) (via CDN) | Owl Carousel dependency |
| Fonts | [Inter](https://fonts.google.com/specimen/Inter) (Google Fonts) | Primary typeface |

> All CDN dependencies are loaded at runtime — no local `node_modules` needed.

---

## 🎨 Design System

The design system lives in `css/styles.css` and is driven by CSS custom properties:

```css
/* Colour tokens (light mode) */
--bg-base        /* page background   */
--bg-card        /* card surface      */
--text-primary   /* primary text      */
--accent         /* brand accent      */

/* Dark mode — toggled by .dark-theme on <body> */
body.dark-theme { --bg-base: #0f1117; ... }
```

**Key design decisions:**
- Glassmorphism cards via `backdrop-filter: blur()` on `.glass-card`
- Sidebar collapses to icon-only rail on desktop (`sidebar-collapsed` class)
- Slide-out overlay on mobile (`.sidebar.open`)
- Smooth `transition` on all interactive elements for micro-animation feel

---

## 🛠 Key JavaScript Modules

| Function | File | Description |
|---|---|---|
| `renderAttendance()` | `app.js` | Injects attendance day cards into `#attendanceList` |
| `setupAttendanceCarousel()` | `app.js` | Initialises Owl Carousel (or fallback scroll) on attendance list |
| `renderTeam()` | `app.js` | Renders team member cards with gradient avatars into `#teamList` |
| `setupNavigation()` | `app.js` | Handles sidebar collapse (desktop) and slide-out (mobile) |
| `setupTheme()` | `app.js` | Applies / persists light-dark theme via `localStorage` |
| `setupShortcutScroller()` | `app.js` | Initialises shortcut panel Owl Carousel or fallback |

All modules are bootstrapped inside a single `DOMContentLoaded` listener.

---

## 📦 Data Layer

Static data arrays at the top of `app.js` act as the data source for rendered components. Replace these with API calls to connect a live backend:

```js
// Attendance records — swap with fetch('/api/attendance')
const attendance = [
  { day: "Wed,", date: "May 20", inTime: "08:44:05", outTime: "17:33:55", status: "Present" },
  // ...
];

// Team members — swap with fetch('/api/team')
const team = [
  { name: "Anjan Layek", code: "E15601", role: "Dot Net Developer", email: "...", tone: "..." },
  // ...
];
```

---

## 🔒 Theme Persistence

The selected theme is saved to `localStorage` under the key `cuims-theme`. On load, the app checks:

1. `localStorage.getItem("cuims-theme")` — previously saved preference
2. `window.matchMedia("(prefers-color-scheme: dark)")` — OS-level preference
3. Falls back to **light** mode

---

## 📱 Responsive Breakpoints

| Breakpoint | Behaviour |
|---|---|
| `≥ 1280px` | Full sidebar + 3-column dashboard grid |
| `900px – 1279px` | Sidebar visible, 2-column grid |
| `≤ 1050px` | Sidebar becomes slide-out drawer (mobile toggle) |
| `≤ 768px` | Single-column stacked layout |

---

## 🔮 Roadmap / Future Enhancements

- [ ] Connect attendance and team data to a live REST API
- [ ] Add real-time notifications via WebSockets
- [ ] Implement search & bookmark functionality in the topbar
- [ ] Build out timetable and to-do list CRUD features
- [ ] Add unit/integration tests (Jest + Playwright)
- [ ] PWA support (service worker + manifest) for offline access

---

## 🤝 Contributing

1. Fork this repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "feat: add my feature"`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

Please follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages.

---

## 📄 License

This project is proprietary to **Chandigarh University**. All rights reserved.

---

## 📞 Support & Contact

| Channel | Details |
|---|---|
| Staff Care Email | [staffcare@cuchd.in](mailto:staffcare@cuchd.in) |
| General Helpline | 0160-5017000 |
| Women Helpline | 1800 1900 2222 |
| Wi-Fi / Hostels | 7347017909 (Mr. Jaspreet Singh) |

---

<p align="center">
  Made with ❤️ for Chandigarh University Staff &nbsp;·&nbsp; Version 2025
</p>
