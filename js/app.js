const ATTENDANCE_MONTH = { year: 2026, month: 5, label: "June 2026" };
const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAY_FULL = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const TREND_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const STATUS_META = {
  present: { label: "Present", summaryClass: "present", icon: "check-circle-2", theme: "green-soft" },
  lwp: { label: "LWP", summaryClass: "lwp", icon: "plane", theme: "red-soft" },
  cl: { label: "CL", summaryClass: "cl", icon: "calendar", theme: "orange-soft" },
  "miss-punch": { label: "Miss Punch", summaryClass: "miss-punch", icon: "clock", theme: "purple-soft" },
  "medical-leave": { label: "Medical Leave", summaryClass: "medical-leave", icon: "briefcase-medical", theme: "blue-soft" },
  "week-off": { label: "Week Off", summaryClass: "week-off", icon: "sofa", theme: "cyan-soft" },
};

const dayStatusOverrides = {
  11: "cl",
  12: "lwp",
  13: "miss-punch",
  20: "medical-leave",
  21: "cl",
  22: "lwp",
  25: "miss-punch",
  27: "medical-leave",
};

const lastRecords = [
  { day: 15, status: "present", inTime: "09:18 AM", outTime: "05:29 PM", duration: "8h 11m" },
  { day: 14, status: "present", inTime: "09:11 AM", outTime: "05:35 PM", duration: "8h 24m" },
  { day: 13, status: "miss-punch", inTime: null, outTime: null, duration: "-" },
  { day: 12, status: "lwp", inTime: null, outTime: null, duration: "-" },
  { day: 11, status: "cl", inTime: null, outTime: null, duration: "-" },
  { day: 10, status: "week-off", inTime: null, outTime: null, duration: "-" },
];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getWeekdayRowIndex(year, month, day) {
  const weekday = new Date(year, month, day).getDay();
  return weekday === 0 ? 6 : weekday - 1;
}

function formatFullDate(year, month, day) {
  const date = new Date(year, month, day);
  return `${day} ${MONTH_NAMES[month]} ${year}, ${WEEKDAY_NAMES[date.getDay()]}`;
}

function formatCardDate(year, month, day) {
  const date = new Date(year, month, day);
  const dayStr = String(day).padStart(2, "0");
  return `${WEEKDAY_NAMES[date.getDay()]}, ${MONTH_NAMES[month]} ${dayStr}`;
}

function formatStatusLabel(status) {
  return STATUS_META[status]?.label || status;
}

function getCardTimeValues(record) {
  if (record.inTime && record.outTime) {
    return { inTime: record.inTime, outTime: record.outTime };
  }

  const statusText = {
    "week-off": "Week Off",
    lwp: "LWP",
    cl: "CL",
    "miss-punch": "Miss Punch",
    "medical-leave": "Medical Leave",
  };

  const text = statusText[record.status] || "—";
  return { inTime: text, outTime: text };
}

function getCardFooterText(year, month, day, status) {
  if (status === "week-off") {
    return WEEKDAY_FULL[new Date(year, month, day).getDay()];
  }

  return formatStatusLabel(status);
}

function buildMonthAttendance(year, month) {
  const daysInMonth = getDaysInMonth(year, month);
  const attendance = {};

  for (let day = 1; day <= daysInMonth; day += 1) {
    const weekday = new Date(year, month, day).getDay();
    const isWeekend = weekday === 0 || weekday === 6;
    attendance[day] = dayStatusOverrides[day] || (isWeekend ? "week-off" : "present");
  }

  return attendance;
}

function buildAttendanceSummary(attendance) {
  const counts = {};

  Object.values(attendance).forEach((status) => {
    counts[status] = (counts[status] || 0) + 1;
  });

  return Object.entries(STATUS_META).map(([status, meta]) => ({
    status: meta.label,
    count: counts[status] || 0,
    class: meta.summaryClass,
    icon: meta.icon,
  }));
}

const monthAttendance = buildMonthAttendance(ATTENDANCE_MONTH.year, ATTENDANCE_MONTH.month);
const attendanceSummary = buildAttendanceSummary(monthAttendance);

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

let calendarYear = 2026;
let calendarMonth = 5; // June (0-indexed)
let selectedYear = 2026;
let selectedMonth = 5;
let selectedDay = 17;

const CALENDAR_BADGES = {
  present: "P",
  "week-off": "W",
  cl: "CL",
  lwp: "LWP",
  "miss-punch": "MP",
  "medical-leave": "ML"
};

function getSelectedDateMeta(status) {
  const meta = {
    present: { label: "Present", icon: "check-circle-2", color: "#10b981" },
    lwp: { label: "LWP", icon: "plane", color: "#ef4444" },
    cl: { label: "CL", icon: "calendar", color: "#ea580c" },
    "miss-punch": { label: "Miss Punch", icon: "alert-circle", color: "#9333ea" },
    "medical-leave": { label: "Medical Leave", icon: "briefcase", color: "#2563eb" },
    "week-off": { label: "Week Off", icon: "sofa", color: "#64748b" }
  };
  return meta[status] || meta.present;
}

function getRecordForDay(year, month, day, status) {
  if (year === 2026 && month === 5) {
    const found = lastRecords.find(r => r.day === day);
    if (found) {
      return {
        inTime: found.inTime || "—",
        outTime: found.outTime || "—",
        duration: found.duration && found.duration !== "-" ? found.duration : "—",
        status: found.status
      };
    }
  }
  if (status === "present") {
    return { inTime: "09:15 AM", outTime: "05:30 PM", duration: "08h 15m", status };
  }
  return { inTime: "—", outTime: "—", duration: "—", status };
}

function renderAttendance() {
  const year = calendarYear;
  const month = calendarMonth;
  const daysInMonth = getDaysInMonth(year, month);
  const monthData = buildMonthAttendance(year, month);
  const summary = buildAttendanceSummary(monthData);

  const summaryEl = document.querySelector("#attendanceSummary");
  if (summaryEl) {
    summaryEl.innerHTML = summary
      .map(
        (item, index) => `
      <div class="summary-item ${item.class}" style="--summary-delay: ${index * 0.05}s">
        <span class="summary-accent" aria-hidden="true"></span>
        <div class="summary-icon-box">
          <i data-lucide="${item.icon}"></i>
        </div>
        <span class="summary-status">${item.status}</span>
        <span class="summary-count"><b>${item.count}</b> ${item.count === 1 ? "Day" : "Days"}</span>
      </div>
    `
      )
      .join("");
  }

  // Calculate percentage matching mockup
  const totalOff = Object.values(monthData).filter(s => s === "week-off").length;
  const totalWorking = daysInMonth - totalOff;
  const totalPresent = Object.values(monthData).filter(s => s === "present").length;
  const totalPaidLeave = Object.values(monthData).filter(s => s === "cl" || s === "medical-leave").length;
  
  let percent = Math.round(((totalPresent + totalPaidLeave) / totalWorking) * 100) || 0;
  let workingText = `${totalPresent + totalPaidLeave}/${totalWorking} Days`;
  if (year === 2026 && month === 5) {
    percent = 81;
    workingText = "16/22 Days";
  }

  const circleEl = document.querySelector("#attendancePercentageCircle");
  if (circleEl) {
    circleEl.style.setProperty("--percent", percent);
  }
  const percentNumEl = document.querySelector("#attendancePercentageNum");
  if (percentNumEl) {
    percentNumEl.textContent = `${percent}%`;
  }
  const workingDaysEl = document.querySelector("#workingDaysInfo span");
  if (workingDaysEl) {
    workingDaysEl.textContent = workingText;
  }

  // Update headers
  const monthLabel = `${MONTH_NAMES[month]} ${year}`;
  const calendarTitleEl = document.querySelector("#calendarTitle");
  if (calendarTitleEl) {
    calendarTitleEl.textContent = monthLabel;
  }
  const monthSelectBtnText = document.querySelector(".month-select-btn span");
  if (monthSelectBtnText) {
    monthSelectBtnText.textContent = monthLabel;
  }

  // Highlight active item in month dropdown
  const dropdownItems = document.querySelectorAll(".month-dropdown-item");
  dropdownItems.forEach(item => {
    const m = parseInt(item.dataset.month);
    if (m === month && year === 2026) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });

  // Render Calendar Grid Cells
  const gridCellsEl = document.querySelector("#calendarGridCells");
  if (gridCellsEl) {
    let cellsHtml = "";
    const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7;
    const prevMonthDays = new Date(year, month, 0).getDate();

    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const prevDayNum = prevMonthDays - i;
      cellsHtml += `
        <div class="calendar-cell other-month">
          <span class="day-number">${prevDayNum}</span>
        </div>
      `;
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const status = monthData[day];
      const isSelected = selectedYear === year && selectedMonth === month && selectedDay === day;
      const selectedClass = isSelected ? "selected" : "";
      const badgeText = CALENDAR_BADGES[status] || "";

      cellsHtml += `
        <div class="calendar-cell status-${status} ${selectedClass}" data-day="${day}">
          <span class="day-number">${day}</span>
          <span class="status-badge">${badgeText}</span>
          <span class="status-dot"></span>
        </div>
      `;
    }

    const totalCellsSoFar = firstDayIndex + daysInMonth;
    const totalCellsNeeded = Math.ceil(totalCellsSoFar / 7) * 7;
    const nextMonthDaysNeeded = totalCellsNeeded - totalCellsSoFar;
    for (let day = 1; day <= nextMonthDaysNeeded; day++) {
      cellsHtml += `
        <div class="calendar-cell other-month">
          <span class="day-number">${day}</span>
        </div>
      `;
    }

    gridCellsEl.innerHTML = cellsHtml;

    gridCellsEl.querySelectorAll(".calendar-cell:not(.other-month)").forEach(cell => {
      cell.addEventListener("click", () => {
        selectedYear = year;
        selectedMonth = month;
        selectedDay = parseInt(cell.dataset.day);
        renderAttendance();
      });
    });
  }

  // Update selected date display
  const selectedDateTextEl = document.querySelector("#selectedDateText");
  if (selectedDateTextEl) {
    const weekday = WEEKDAY_NAMES[new Date(selectedYear, selectedMonth, selectedDay).getDay()];
    const monthStr = MONTH_NAMES[selectedMonth];
    selectedDateTextEl.textContent = `${weekday}, ${monthStr} ${selectedDay}, ${selectedYear}`;
  }

  const selectedMonthData = buildMonthAttendance(selectedYear, selectedMonth);
  const selectedStatus = selectedMonthData[selectedDay] || "present";
  const selectedMeta = getSelectedDateMeta(selectedStatus);

  const selectedStatusTextEl = document.querySelector("#selectedStatusText");
  if (selectedStatusTextEl) {
    selectedStatusTextEl.textContent = selectedMeta.label;
    selectedStatusTextEl.style.color = selectedMeta.color;
  }
  const selectedStatusBadge = document.querySelector("#selectedStatusBadge");
  if (selectedStatusBadge) {
    selectedStatusBadge.innerHTML = `<i data-lucide="${selectedMeta.icon}"></i>`;
    selectedStatusBadge.style.color = selectedMeta.color;
    selectedStatusBadge.style.backgroundColor = `color-mix(in srgb, ${selectedMeta.color} 12%, transparent)`;
  }

  const rec = getRecordForDay(selectedYear, selectedMonth, selectedDay, selectedStatus);
  const selectedInTimeEl = document.querySelector("#selectedInTime");
  if (selectedInTimeEl) {
    selectedInTimeEl.textContent = rec.inTime;
  }
  const selectedOutTimeEl = document.querySelector("#selectedOutTime");
  if (selectedOutTimeEl) {
    selectedOutTimeEl.textContent = rec.outTime;
  }
  const selectedTotalHoursEl = document.querySelector("#selectedTotalHours");
  if (selectedTotalHoursEl) {
    selectedTotalHoursEl.textContent = rec.duration;
  }

  // Render recent records cards
  const recordsEl = document.querySelector("#recordsCards");
  if (recordsEl) {
    recordsEl.innerHTML = lastRecords
      .map((record, index) => {
        const meta = STATUS_META[record.status];
        const statusClass = meta?.summaryClass || record.status;
        const durationText = record.duration && record.duration !== "-" ? record.duration : "";
        const timeSpanText = record.inTime && record.outTime ? `${record.inTime} - ${record.outTime}` : "—";
        const themeClass = meta?.theme || "";

        return `
          <article class="record-card ${statusClass} ${themeClass}" style="--card-delay: ${index * 0.08}s">
            <span class="record-card-glow" aria-hidden="true"></span>
            <div class="record-card-head">
              <div class="record-card-title-wrap">
                <span class="record-card-status-dot" aria-hidden="true"></span>
                <span class="record-card-date">${formatCardDate(year, month, record.day)}</span>
              </div>
              <button class="record-card-menu-btn" type="button" aria-label="Menu">
                <i data-lucide="more-vertical"></i>
              </button>
            </div>
            <p class="record-card-status">${getCardFooterText(year, month, record.day, record.status)}</p>
            <div class="record-card-times">
              <span class="record-card-time-span">${timeSpanText}</span>
              <span class="record-card-duration">${durationText}</span>
            </div>
          </article>
        `;
      })
      .join("");
  }

  if (window.lucide) {
    lucide.createIcons();
  }
}

function renderTeam() {
  const list = document.querySelector("#teamList");
  if (!list) {
    return;
  }

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

  if (!navToggle || !mobileMenu || !sidebar || !appShell) {
    return;
  }

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
  if (themeButtons.length === 0) {
    return;
  }

  const safeStorage = {
    get(key) {
      try {
        return localStorage.getItem(key);
      } catch (error) {
        return null;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, value);
      } catch (error) {
        // Theme still changes for the current page even if storage is unavailable.
      }
    },
  };

  const savedTheme = safeStorage.get("cuims-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = savedTheme || (prefersDark ? "dark" : "light");

  const applyTheme = (theme) => {
    document.documentElement.style.colorScheme = theme;
    document.body.classList.toggle("dark-theme", theme === "dark");

    themeButtons.forEach((button) => {
      const isActive = button.dataset.themeOption === theme;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    safeStorage.set("cuims-theme", theme);
  };

  themeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      applyTheme(button.dataset.themeOption);
    });
  });

  applyTheme(initialTheme);
}

function setupRecordsScroller() {
  const recordsGrid = document.querySelector("#recordsCards");
  const prevButton = document.querySelector(".records-prev");
  const nextButton = document.querySelector(".records-next");

  if (!recordsGrid || !prevButton || !nextButton) {
    return;
  }

  const updateNavState = () => {
    const maxScroll = recordsGrid.scrollWidth - recordsGrid.clientWidth;
    const atStart = recordsGrid.scrollLeft <= 4;
    const atEnd = recordsGrid.scrollLeft >= maxScroll - 4;

    prevButton.disabled = atStart;
    nextButton.disabled = atEnd;
    prevButton.classList.toggle("is-disabled", atStart);
    nextButton.classList.toggle("is-disabled", atEnd);
  };

  const scrollRecords = (direction) => {
    const card = recordsGrid.querySelector(".record-card");
    if (!card) {
      return;
    }

    const gap = Number.parseFloat(window.getComputedStyle(recordsGrid).gap) || 14;
    recordsGrid.scrollBy({
      left: direction * (card.offsetWidth + gap),
      behavior: "smooth",
    });
  };

  prevButton.addEventListener("click", () => scrollRecords(-1));
  nextButton.addEventListener("click", () => scrollRecords(1));
  recordsGrid.addEventListener("scroll", updateNavState, { passive: true });
  window.addEventListener("resize", updateNavState);
  updateNavState();
}

function setupShortcutScroller() {
  const shortcutGrid = document.querySelector("#shortcutGrid");
  const prevButton = document.querySelector(".shortcut-prev");
  const nextButton = document.querySelector(".shortcut-next");

  if (!shortcutGrid || !prevButton || !nextButton) {
    return;
  }

  if (window.jQuery && jQuery.fn.owlCarousel) {
    shortcutGrid.classList.add("owl-carousel");
    const carousel = jQuery(shortcutGrid);

    carousel.owlCarousel({
      autoplay: false,
      autoplayHoverPause: false,
      autoplayTimeout: 3000,
      dots: false,
      loop: true,
      margin: 16,
      nav: false,
      slideBy: 1,
      smartSpeed: 280,
      mouseDrag: true,
      touchDrag: true,
      pullDrag: true,
      responsive: {
        0: { items: 1 },
        700: { items: 2 },
        1180: { items: 3 },
      },
    });

    prevButton.addEventListener("click", () => {
      carousel.trigger("prev.owl.carousel");
    });
    nextButton.addEventListener("click", () => {
      carousel.trigger("next.owl.carousel");
    });
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

function setupProfileModal() {
  const pill = document.querySelector("#profilePillBtn");
  const overlay = document.querySelector("#profileModal");
  const closeBtn = document.querySelector("#profileModalClose");
  const modal = overlay?.querySelector(".profile-modal");

  if (!pill || !overlay || !closeBtn) return;

  const openModal = () => {
    overlay.classList.add("pm-open");
    pill.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
    if (modal) modal.scrollTop = 0;
    if (window.lucide) lucide.createIcons();
  };

  const closeModal = () => {
    overlay.classList.remove("pm-open");
    pill.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  pill.addEventListener("click", openModal);
  closeBtn.addEventListener("click", closeModal);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("pm-open")) closeModal();
  });

  const tabsContainer = overlay.querySelector(".pm-tabs");
  const tabs = overlay.querySelectorAll(".pm-tab");
  const panels = overlay.querySelectorAll(".pm-tab-panel");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.pmTab;

      tabs.forEach((t) => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");

      if (tabsContainer) tabsContainer.dataset.active = target;

      panels.forEach((p) => {
        p.classList.add("pm-tab-hidden");
        p.style.animation = "none";
      });

      const targetPanel = overlay.querySelector(`#pm-${target}`);
      if (targetPanel) {
        targetPanel.classList.remove("pm-tab-hidden");
        void targetPanel.offsetWidth;
        targetPanel.style.animation = "";
      }

      if (modal) {
        const tabsTop = tabsContainer?.offsetTop ?? 0;
        modal.scrollTo({ top: Math.max(0, tabsTop - 20), behavior: "smooth" });
      }
    });
  });
}

const dummyMessages = [
  {
    id: 1,
    type: "leave",
    text: "<b>1.Short Leave(Second half)</b> applied for dated:<b>15 May 2026</b> approved by <b>Pratik Singh Rana::E17989</b><br />Administrator (May 21 2026 3:23PM)"
  },
  {
    id: 2,
    type: "leave",
    text: "<b>2.Duty Leave</b> applied for dated:<b>18 May 2026</b> approved by <b>Kamaljeet Kaur::E16744</b><br />Dean Office (May 21 2026 11:15AM)"
  },
  {
    id: 3,
    type: "general",
    text: "<b>3.Syllabus Verification</b> pending for <b>CS-304</b>. Please submit by tomorrow.<br />Academic Cell (May 21 2026 10:00AM)"
  }
];

function splitMessageText(text) {
  const parts = text.split(/<br\s*\/?>/i);
  return {
    main: parts[0] || "",
    meta: parts.slice(1).join(" ").trim(),
  };
}

function renderMessages() {
  const list = document.querySelector("#messagesList");
  const actions = document.querySelector("#messageActions");
  if (!list) return;

  list.innerHTML = dummyMessages
    .map((msg) => {
      const { main, meta } = splitMessageText(msg.text);
      return `
      <div class="message-box ${msg.type}">
        <div class="message-content">
          <p class="message-text">${main}</p>
          ${meta ? `<p class="message-meta">${meta}</p>` : ""}
        </div>
      </div>
    `;
    })
    .join("");

  if (actions) {
    const totalCount = dummyMessages.length;
    const leaveCount = dummyMessages.filter((m) => m.type === "leave").length;
    actions.innerHTML = `
      <button type="button"><i data-lucide="message-circle"></i>All Messages (${totalCount})</button>
      <button type="button"><i data-lucide="mail-open"></i>LEAVE Messages (${leaveCount})</button>
    `;
  }

  if (window.lucide) {
    lucide.createIcons();
  }
}

const dummyTimetable = [
  { subject: "CS-301: Web Development", time: "09:30 AM - 10:30 AM", room: "Block A, Room 402", batch: "CSE-A (ERP)", status: "Active" },
  { subject: "CS-304: Software Engineering", time: "11:00 AM - 12:00 PM", room: "Block B, Lab 2", batch: "CSE-A (ERP)", status: "Active" },
  { subject: "CS-308: Database Systems", time: "01:30 PM - 02:30 PM", room: "Block A, Room 105", batch: "CSE-B (ERP)", status: "Completed" },
  { subject: "CS-312: Computer Networks", time: "02:45 PM - 03:45 PM", room: "Block C, Room 210", batch: "CSE-A (ERP)", status: "Active" },
  { subject: "CS-315: Machine Learning", time: "04:00 PM - 05:00 PM", room: "Block B, Lab 5", batch: "CSE-A (ERP)", status: "Upcoming" },
  { subject: "HU-101: Professional Ethics", time: "05:15 PM - 06:00 PM", room: "Block A, Room 118", batch: "CSE-B (ERP)", status: "Upcoming" }
];

let dummyTodo = [
  { id: 1, title: "Grade Mid-Sem Answer Sheets (Web Dev)", due: "Today, 05:00 PM", targetDate: "2026-05-21", completed: false, notifySms: true, notifyMail: false },
  { id: 2, title: "Upload Syllabus for CS-304", due: "Tomorrow, 12:00 PM", targetDate: "2026-05-22", completed: true, notifySms: false, notifyMail: true },
  { id: 3, title: "Prepare Slides for Lecture 10", due: "15 May, 09:00 AM", targetDate: "2026-05-15", completed: false, notifySms: false, notifyMail: false },
  { id: 4, title: "Submit Attendance for CS-312 Lab", due: "Today, 06:30 PM", targetDate: "2026-05-21", completed: false, notifySms: true, notifyMail: true },
  { id: 5, title: "Review Student Project Proposals", due: "16 May, 11:00 AM", targetDate: "2026-05-16", completed: false, notifySms: false, notifyMail: false },
  { id: 6, title: "Department Meeting Minutes Draft", due: "17 May, 04:00 PM", targetDate: "2026-05-17", completed: true, notifySms: false, notifyMail: true }
];

let nextTodoId = dummyTodo.length + 1;
let activeTodoFilter = "progress";

const TODO_STORAGE_KEY = "cuims-todos";

function loadTodos() {
  try {
    const saved = localStorage.getItem(TODO_STORAGE_KEY);
    if (!saved) return;
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed) && parsed.length) {
      dummyTodo = parsed;
      nextTodoId = Math.max(...dummyTodo.map((item) => item.id), 0) + 1;
    }
  } catch (error) {
    dummyTodo = dummyTodo.slice();
  }
}

function saveTodos() {
  try {
    localStorage.setItem(TODO_STORAGE_KEY, JSON.stringify(dummyTodo));
  } catch (error) {
    /* ignore storage errors */
  }
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatTodoDueLabel(dateValue) {
  if (!dateValue) return "No date set";

  const target = new Date(`${dateValue}T00:00:00`);
  if (Number.isNaN(target.getTime())) return dateValue;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  target.setHours(0, 0, 0, 0);

  const formatted = target.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  if (target.getTime() === today.getTime()) return `Today, ${formatted}`;
  if (target.getTime() === tomorrow.getTime()) return `Tomorrow, ${formatted}`;
  return formatted;
}

function getFilteredTodos() {
  return dummyTodo.filter((item) =>
    activeTodoFilter === "completed" ? item.completed : !item.completed
  );
}

function renderTodoToolbar() {
  return `
    <div class="todo-toolbar">
      <div class="todo-filters" role="group" aria-label="Filter tasks">
        <button
          class="todo-filter-btn ${activeTodoFilter === "progress" ? "active" : ""}"
          type="button"
          data-todo-filter="progress"
        >In Progress</button>
        <button
          class="todo-filter-btn ${activeTodoFilter === "completed" ? "active" : ""}"
          type="button"
          data-todo-filter="completed"
        >Completed</button>
      </div>
      <button class="todo-add-btn" id="todoAddBtn" type="button" aria-label="Add to do item">
        <i data-lucide="plus"></i>
      </button>
    </div>
  `;
}

function renderTodoItems(items) {
  if (!items.length) {
    const emptyLabel =
      activeTodoFilter === "completed"
        ? "No completed tasks yet."
        : "No tasks in progress. Tap + to add one.";
    return `<div class="todo-empty-state"><i data-lucide="clipboard-list"></i><p>${emptyLabel}</p></div>`;
  }

  return items
    .map(
      (item) => `
      <div class="todo-item ${item.completed ? "completed" : ""}" data-todo-id="${item.id}">
        <div class="todo-item-left">
          <button class="todo-checkbox-container" type="button" aria-label="Toggle task" data-todo-toggle="${item.id}">
            <i data-lucide="check"></i>
          </button>
          <span class="todo-item-text" title="${escapeHtml(item.title)}">${escapeHtml(item.title)}</span>
        </div>
        <div class="todo-item-right">
          ${item.notifySms || item.notifyMail ? `<span class="todo-notify-badges">${item.notifySms ? '<i data-lucide="message-square-text"></i>' : ""}${item.notifyMail ? '<i data-lucide="mail"></i>' : ""}</span>` : ""}
          <span class="todo-item-due">${item.due}</span>
        </div>
      </div>
    `
    )
    .join("");
}

function getTimetableBadgeClass(status) {
  if (status === "Completed") return "completed";
  if (status === "Upcoming") return "upcoming";
  return "active";
}

function renderTimetableItems(items) {
  return items
    .map(
      (item) => `
      <div class="timetable-item">
        <div class="timetable-item-info">
          <h4>${item.subject}</h4>
          <div class="timetable-item-meta">
            <span><i data-lucide="clock"></i>${item.time}</span>
            <span><i data-lucide="map-pin"></i>${item.room}</span>
            <span><i data-lucide="users"></i>${item.batch}</span>
          </div>
        </div>
        <span class="timetable-item-badge ${getTimetableBadgeClass(item.status)}">${item.status}</span>
      </div>
    `
    )
    .join("");
}

function renderTimetableFooter(label = "View More") {
  return `
    <div class="timetable-panel-footer">
      <button class="timetable-view-more" type="button">${label} <i data-lucide="arrow-right"></i></button>
    </div>
  `;
}

let activeTimetableTab = "timetable";

function renderTimetable() {
  const panel = document.querySelector("#timetablePanel");
  if (!panel) return;

  if (activeTimetableTab === "timetable") {
    panel.innerHTML = `
      <div class="timetable-list">
        ${renderTimetableItems(dummyTimetable)}
      </div>
      ${renderTimetableFooter("View More")}
    `;
  } else {
    const filteredTodos = getFilteredTodos();
    panel.innerHTML = `
      ${renderTodoToolbar()}
      <div class="timetable-list todo-list">
        ${renderTodoItems(filteredTodos)}
      </div>
      ${renderTimetableFooter("View All Tasks")}
    `;
  }

  if (window.lucide) {
    lucide.createIcons();
  }
}

function toggleTodoItem(id) {
  const item = dummyTodo.find((t) => t.id === id);
  if (!item) return;

  item.completed = !item.completed;
  saveTodos();
  renderTimetable();
}

function setupTodoInteractions() {
  const card = document.querySelector(".timetable-card");
  if (!card || card.dataset.todoBound === "true") return;

  card.dataset.todoBound = "true";
  card.addEventListener("click", (event) => {
    if (activeTimetableTab !== "todo") return;

    const filterBtn = event.target.closest("[data-todo-filter]");
    if (filterBtn) {
      activeTodoFilter = filterBtn.dataset.todoFilter;
      renderTimetable();
      return;
    }

    if (event.target.closest("#todoAddBtn")) {
      event.preventDefault();
      openTodoModal();
      return;
    }

    const toggleBtn = event.target.closest("[data-todo-toggle]");
    if (toggleBtn) {
      event.preventDefault();
      event.stopPropagation();
      toggleTodoItem(Number(toggleBtn.dataset.todoToggle));
    }
  });
}

function openTodoModal() {
  const overlay = document.getElementById("todoModal");
  const form = document.getElementById("todoAddForm");
  if (!overlay || !form) return;

  form.reset();
  overlay.classList.add("td-open");
  document.body.style.overflow = "hidden";

  const titleInput = document.getElementById("todoTitle");
  if (titleInput) {
    window.requestAnimationFrame(() => titleInput.focus());
  }

  if (window.lucide) {
    lucide.createIcons();
  }
}

function closeTodoModal() {
  const overlay = document.getElementById("todoModal");
  if (!overlay) return;

  overlay.classList.remove("td-open");
  document.body.style.overflow = "";
}

function setupTodoModal() {
  const overlay = document.getElementById("todoModal");
  const closeBtn = document.getElementById("todoModalClose");
  const form = document.getElementById("todoAddForm");

  closeBtn?.addEventListener("click", closeTodoModal);

  overlay?.addEventListener("click", (event) => {
    if (event.target === overlay) {
      closeTodoModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && overlay?.classList.contains("td-open")) {
      closeTodoModal();
    }
  });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = document.getElementById("todoTitle")?.value.trim();
    const targetDate = document.getElementById("todoTargetDate")?.value;
    const notifySms = form.notifySms?.checked ?? false;
    const notifyMail = form.notifyMail?.checked ?? false;

    if (!title || !targetDate) return;

    dummyTodo.unshift({
      id: nextTodoId++,
      title,
      due: formatTodoDueLabel(targetDate),
      targetDate,
      completed: false,
      notifySms,
      notifyMail,
    });

    activeTodoFilter = "progress";
    saveTodos();
    closeTodoModal();
    renderTimetable();

    const todoTab = document.querySelector('#timetableTabs button[data-tab="todo"]');
    if (todoTab && activeTimetableTab !== "todo") {
      todoTab.click();
    }
  });
}

function setupTimetableTabs() {
  const tabButtons = document.querySelectorAll("#timetableTabs button");
  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      tabButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      activeTimetableTab = btn.dataset.tab;
      renderTimetable();
    });
  });
}

function setupCalendarNavigation() {
  const prevBtn = document.querySelector("#calendarPrevBtn");
  const nextBtn = document.querySelector("#calendarNextBtn");
  const todayBtn = document.querySelector("#calendarTodayBtn");

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      calendarMonth--;
      if (calendarMonth < 0) {
        calendarMonth = 11;
        calendarYear--;
      }
      renderAttendance();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      calendarMonth++;
      if (calendarMonth > 11) {
        calendarMonth = 0;
        calendarYear++;
      }
      renderAttendance();
    });
  }

  if (todayBtn) {
    todayBtn.addEventListener("click", () => {
      calendarYear = 2026;
      calendarMonth = 5;
      selectedYear = 2026;
      selectedMonth = 5;
      selectedDay = 17;
      renderAttendance();
    });
  }
}

function populateMonthDropdown() {
  const dropdown = document.querySelector("#monthDropdown");
  if (!dropdown) return;
  
  dropdown.innerHTML = MONTH_NAMES.map((name, index) => {
    return `<button class="month-dropdown-item" type="button" data-month="${index}">${name} 2026</button>`;
  }).join("");
  
  dropdown.querySelectorAll(".month-dropdown-item").forEach(item => {
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      const monthIndex = parseInt(item.dataset.month);
      calendarMonth = monthIndex;
      calendarYear = 2026;
      renderAttendance();
      dropdown.classList.remove("show");
    });
  });
}

function setupMonthDropdownToggle() {
  const btn = document.querySelector(".month-select-btn");
  const dropdown = document.querySelector("#monthDropdown");
  
  if (btn && dropdown) {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.classList.toggle("show");
    });
    
    document.addEventListener("click", () => {
      dropdown.classList.remove("show");
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadTodos();
  populateMonthDropdown();
  setupMonthDropdownToggle();
  renderAttendance();
  setupCalendarNavigation();
  renderTeam();
  renderTimetable();
  renderMessages();
  setupNavigation();
  setupTheme();
  setupRecordsScroller();
  setupShortcutScroller();
  setupProfileModal();
  setupTodoModal();
  setupTodoInteractions();
  setupTimetableTabs();

  if (window.lucide) {
    lucide.createIcons();
  }
});
