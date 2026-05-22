const attendance = [
  { day: "Wed,", date: "May 20", inTime: "08:44:05", outTime: "17:33:55", status: "Present" },
  { day: "Tue,", date: "May 19", inTime: "09:07:45", outTime: "17:37:29", status: "Present" },
  { day: "Mon,", date: "May 18", inTime: "09:04:28", outTime: "17:33:22", status: "Present" },
  { day: "Sun,", date: "May 17", inTime: "Week Off", outTime: "Week Off", status: "Sunday" },
  { day: "Sat,", date: "May 16", inTime: "09:18:15", outTime: "17:29:10", status: "Present" },
  { day: "Fri,", date: "May 15", inTime: "09:11:20", outTime: "17:35:48", status: "Present" },
  { day: "Thu,", date: "May 14", inTime: "09:02:36", outTime: "17:31:14", status: "Present" },
];

const team = [
  {
    name: "Anjan Layek",
    code: "E15601",
    role: "Dot Net Developer",
    email: "anjan.e15601@cumail.in",
    tone: "linear-gradient(135deg, #252c35, #d2ad85)",
  },
  {
    name: "Anuj Mishra",
    code: "E13830",
    role: "Software Developer",
    email: "anuj.e13830@cumail.in",
    tone: "linear-gradient(135deg, #672d28, #f0b9a6)",
  },
  {
    name: "Arshdeep Kaur Brar",
    code: "E18650",
    role: "Sr. Dot Net Developer",
    email: "",
    tone: "linear-gradient(135deg, #f1b7a7, #8a6788)",
  },
];

function renderAttendance() {
  const list = document.querySelector("#attendanceList");

  list.innerHTML = attendance
    .map(
      (item) => `
        <div class="attendance-day">
          <div class="attendance-date">
            <i data-lucide="calendar-days"></i>
            <div><b>${item.day}</b><span>${item.date}</span></div>
          </div>
          <div class="time-row">
            <div><span>In-Time</span><b>${item.inTime}</b></div>
            <div><span>Out-Time</span><b>${item.outTime}</b></div>
          </div>
          <p class="status">${item.status}</p>
        </div>
      `
    )
    .join("");
}

function setupAttendanceCarousel() {
  const list = document.querySelector("#attendanceList");
  const prevButton = document.querySelector(".attendance-card .slider-btn.left");
  const nextButton = document.querySelector(".attendance-card .slider-btn.right");

  if (!list || !prevButton || !nextButton) {
    return;
  }

  if (window.jQuery && jQuery.fn.owlCarousel) {
    const carousel = jQuery(list);

    carousel.owlCarousel({
      autoplay: true,
      autoplayHoverPause: true,
      autoplaySpeed: 1200,
      autoplayTimeout: 4200,
      dots: false,
      loop: attendance.length > 1,
      margin: 14,
      nav: false,
      slideBy: 1,
      smartSpeed: 900,
      mouseDrag: true,
      touchDrag: true,
      pullDrag: true,
      responsive: {
        0: { items: 1 },
        620: { items: 2 },
        900: { items: 2 },
        1280: { items: 3 },
      },
    });

    prevButton.addEventListener("click", () => carousel.trigger("prev.owl.carousel"));
    nextButton.addEventListener("click", () => carousel.trigger("next.owl.carousel"));
    return;
  }

  let isAutoScrolling = false;

  const scrollAttendance = (direction) => {
    const firstCard = list.querySelector(".attendance-day");
    const cardWidth = firstCard ? firstCard.offsetWidth : 180;
    const listGap = Number.parseFloat(window.getComputedStyle(list).columnGap) || 14;

    if (isAutoScrolling) {
      return;
    }

    isAutoScrolling = true;
    list.scrollBy({
      left: direction * (cardWidth + listGap),
      behavior: "smooth",
    });

    window.setTimeout(() => {
      isAutoScrolling = false;
    }, 900);
  };

  list.classList.add("attendance-fallback-carousel");
  prevButton.addEventListener("click", () => scrollAttendance(-1));
  nextButton.addEventListener("click", () => scrollAttendance(1));
  window.setInterval(() => scrollAttendance(1), 4200);
}

function renderTeam() {
  const list = document.querySelector("#teamList");

  list.innerHTML = team
    .map(
      (member) => `
        <div class="member">
          <div class="member-photo">
            <span class="avatar" style="background:${member.tone}"></span>
            <span class="send-badge"><i data-lucide="send"></i>SEND</span>
          </div>
          <div class="member-info">
            <h3>${member.name}</h3>
            <span class="member-code">(${member.code})</span>
            <p>${member.role}</p>
            ${
              member.email
                ? `<p class="email-line"><i data-lucide="mail"></i>${member.email}</p>`
                : ""
            }
          </div>
          <span class="present">Present</span>
          <button type="button" aria-label="Team member menu"><i data-lucide="more-vertical"></i></button>
        </div>
      `
    )
    .join("");
}

function setupNavigation() {
  const navToggle = document.querySelector("#navToggle");
  const mobileMenu = document.querySelector("#mobileMenu");
  const sidebar = document.querySelector("#sidebar");
  const appShell = document.querySelector(".app-shell");
  const mobileQuery = window.matchMedia("(max-width: 1050px)");
  let isSidebarAnimating = false;

  const toggleMobileSidebar = () => {
    sidebar.classList.toggle("open");
  };

  navToggle.addEventListener("click", () => {
    if (mobileQuery.matches) {
      toggleMobileSidebar();
      return;
    }

    if (isSidebarAnimating) {
      return;
    }

    isSidebarAnimating = true;
    appShell.classList.toggle("sidebar-collapsed");
    navToggle.setAttribute("aria-expanded", String(!appShell.classList.contains("sidebar-collapsed")));

    window.setTimeout(() => {
      isSidebarAnimating = false;
    }, 360);
  });

  mobileMenu.addEventListener("click", toggleMobileSidebar);

  mobileQuery.addEventListener("change", () => {
    sidebar.classList.remove("open");
    appShell.classList.remove("sidebar-collapsed");
  });
}

function setupTheme() {
  const themeButtons = document.querySelectorAll("[data-theme-option]");
  const savedTheme = localStorage.getItem("cuims-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = savedTheme || (prefersDark ? "dark" : "light");

  const applyTheme = (theme) => {
    document.body.classList.toggle("dark-theme", theme === "dark");

    themeButtons.forEach((button) => {
      const isActive = button.dataset.themeOption === theme;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    localStorage.setItem("cuims-theme", theme);
  };

  themeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      applyTheme(button.dataset.themeOption);
    });
  });

  applyTheme(initialTheme);
}

function setupShortcutScroller() {
  const shortcutGrid = document.querySelector("#shortcutGrid");
  const prevButton = document.querySelector(".shortcut-prev");
  const nextButton = document.querySelector(".shortcut-next");

  if (!shortcutGrid || !prevButton || !nextButton) {
    return;
  }

  if (window.jQuery && jQuery.fn.owlCarousel) {
    const carousel = jQuery(shortcutGrid);

    carousel.owlCarousel({
      autoplay: true,
      autoplayHoverPause: true,
      autoplaySpeed: 1200,
      autoplayTimeout: 4200,
      dots: false,
      loop: true,
      margin: 16,
      nav: false,
      slideBy: 1,
      smartSpeed: 900,
      mouseDrag: true,
      touchDrag: true,
      pullDrag: true,
      responsive: {
        0: { items: 1 },
        700: { items: 2 },
        1180: { items: 3 },
      },
    });

    prevButton.addEventListener("click", () => carousel.trigger("prev.owl.carousel"));
    nextButton.addEventListener("click", () => carousel.trigger("next.owl.carousel"));
    return;
  }

  const scrollShortcuts = (direction) => {
    const firstCard = shortcutGrid.querySelector(".shortcut-card");
    const cardWidth = firstCard ? firstCard.offsetWidth : 260;
    const gridGap = Number.parseFloat(window.getComputedStyle(shortcutGrid).columnGap) || 16;
    shortcutGrid.scrollBy({
      left: direction * (cardWidth + gridGap),
      behavior: "smooth",
    });
  };

  prevButton.addEventListener("click", () => scrollShortcuts(-1));
  nextButton.addEventListener("click", () => scrollShortcuts(1));
}

renderAttendance();
renderTeam();
setupNavigation();
setupTheme();
setupShortcutScroller();
setupAttendanceCarousel();

if (window.lucide) {
  lucide.createIcons();
}
