let menuOpen = false;

/* ---------- PROFILE MENU ---------- */
function toggleMenu() {
  menuOpen = !menuOpen;
  const menu = document.getElementById("profileMenu");
  if (menu) {
    menu.style.display = menuOpen ? "block" : "none";
  }
}

// ✅ ADDED (this was missing and breaking JS execution)
function goProfile() {
  window.location.href = "employee-profile.html";
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}

/* ---------- TAB HANDLING ---------- */
function setActiveTab(tabId) {
  ["tab-employees", "tab-attendance", "tab-timeoff"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove("active");
  });
  const active = document.getElementById(tabId);
  if (active) active.classList.add("active");
}

function showEmployees() {
  setActiveTab("tab-employees");
  document.getElementById("content").innerHTML =
    `<div id="employeeGrid" class="grid"></div>`;
  loadEmployees();
}

/* =====================================================
   ATTENDANCE LOGIC
===================================================== */

let currentMonth = 11;
let currentYear = 2025;
let currentFilter = "all";

function showAttendance() {
  setActiveTab("tab-attendance");
  renderAttendance();
}

function changeMonth(step) {
  currentMonth += step;
  if (currentMonth < 0) { currentMonth = 11; currentYear--; }
  if (currentMonth > 11) { currentMonth = 0; currentYear++; }
  renderAttendance();
}

function filterAttendance(type) {
  currentFilter = type;
  renderAttendance();
}

function renderAttendance() {
  const data = generateAttendanceData(currentYear, currentMonth);

  document.getElementById("content").innerHTML = `
    <div class="attendance">
      <h2>Attendance</h2>

      <div class="attendance-summary">
        <button onclick="changeMonth(-1)">&lt;</button>
        <button onclick="changeMonth(1)">&gt;</button>
        <div>${monthName(currentMonth)} ${currentYear}</div>

        <div onclick="filterAttendance('present')">
          Count of days present: <b>${data.present}</b>
        </div>
        <div onclick="filterAttendance('absent')">
          Leaves count: <b>${data.absent}</b>
        </div>
        <div onclick="filterAttendance('all')">
          Total working days: <b>${data.total}</b>
        </div>
      </div>

      <table class="attendance-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Check In</th>
            <th>Check Out</th>
            <th>Work Hours</th>
            <th>Extra Hours</th>
          </tr>
        </thead>
        <tbody>
          ${renderAttendanceRows(data.days)}
        </tbody>
      </table>
    </div>
  `;
}

function generateAttendanceData(year, month) {
  const days = [];
  let present = 0, absent = 0, total = 0;

  const leaveDays = [5, 12, 19, 26];
  const extraDays = [8, 15, 22];
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let d = 1; d <= daysInMonth; d++) {
    const day = new Date(year, month, d).getDay();
    if (day === 0 || day === 6) continue;

    total++;
    if (leaveDays.includes(d)) {
      absent++;
      if (currentFilter === "present") continue;
      days.push({
        date: formatDate(d, month, year),
        in: "-",
        out: "-",
        work: "00:00",
        extra: "00:00",
        type: "absent"
      });
    } else {
      present++;
      if (currentFilter === "absent") continue;
      const extra = extraDays.includes(d) ? "01:00" : "00:00";
      const out = extraDays.includes(d) ? "17:00" : "16:00";
      days.push({
        date: formatDate(d, month, year),
        in: "09:00",
        out,
        work: "07:00",
        extra,
        type: "present"
      });
    }
  }
  return { days, present, absent, total };
}

function renderAttendanceRows(days) {
  return days.map(d => `
    <tr class="${d.type}">
      <td>${d.date}</td>
      <td>${d.in}</td>
      <td>${d.out}</td>
      <td>${d.work}</td>
      <td>${d.extra}</td>
    </tr>
  `).join("");
}

/* =====================================================
   TIME OFF LOGIC
===================================================== */

let timeOffMonth = 11;
let timeOffYear = 2025;

let timeOffData = [
  { name: "Yug Surana", start: "05/12/2025", end: "05/12/2025", type: "Paid Time Off", status: "Approved" },
  { name: "Yug Surana", start: "12/12/2025", end: "12/12/2025", type: "Sick Leave", status: "Approved" },
  { name: "Yug Surana", start: "19/12/2025", end: "19/12/2025", type: "Paid Time Off", status: "Approved" },
  { name: "Yug Surana", start: "26/12/2025", end: "26/12/2025", type: "Paid Time Off", status: "Approved" }
];

function showTimeOff() {
  setActiveTab("tab-timeoff");

  document.getElementById("content").innerHTML = `
    <div class="timeoff">
      <div class="timeoff-header">
        <h2>Time Off</h2>
        <button class="new-btn" onclick="openLeaveForm()">NEW</button>
      </div>

      <div class="attendance-summary">
        <button onclick="changeTimeOffMonth(-1)">&lt;</button>
        <button onclick="changeTimeOffMonth(1)">&gt;</button>
        <div>${monthName(timeOffMonth)} ${timeOffYear}</div>
      </div>

      <table class="timeoff-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Start</th>
            <th>End</th>
            <th>Type</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody id="timeoffRows"></tbody>
      </table>
    </div>
  `;
  renderTimeOffTable();
}

function changeTimeOffMonth(step) {
  timeOffMonth += step;
  if (timeOffMonth < 0) { timeOffMonth = 11; timeOffYear--; }
  if (timeOffMonth > 11) { timeOffMonth = 0; timeOffYear++; }
  showTimeOff();
}

function renderTimeOffTable() {
  const tbody = document.getElementById("timeoffRows");
  if (!tbody) return;

  tbody.innerHTML = "";
  const monthLeaves = timeOffData.filter(l => {
    const [, m, y] = l.start.split("/");
    return parseInt(m) - 1 === timeOffMonth && parseInt(y) === timeOffYear;
  });

  if (!monthLeaves.length) {
    tbody.innerHTML = `<tr><td colspan="5">No leave records for this month</td></tr>`;
    return;
  }

  monthLeaves.forEach(l => {
    tbody.innerHTML += `
      <tr>
        <td>${l.name}</td>
        <td>${l.start}</td>
        <td>${l.end}</td>
        <td>${l.type}</td>
        <td class="approved">${l.status}</td>
      </tr>
    `;
  });
}

/* =====================================================
   LEAVE MODAL
===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("currentUser")) || {};
  const wrap = document.createElement("div");
  wrap.innerHTML = `
    <div id="leaveModal" class="modal hidden">
      <div class="modal-content">
        <h3>Time Off Type Request</h3>

        <label>Employee</label>
        <input value="${user.name || ""}" readonly>

        <label>Type</label>
        <select id="leaveType">
          <option>Paid Time Off</option>
          <option>Sick Leave</option>
        </select>

        <label>Validity</label>
        <div class="date-range">
          <input type="date" id="fromDate">
          <input type="date" id="toDate">
        </div>

        <label>Allocation</label>
        <input id="leaveDays" readonly>

        <div class="modal-actions">
          <button onclick="submitLeave()">Submit</button>
          <button onclick="closeLeaveForm()">Reset</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(wrap);
});

function openLeaveForm() {
  document.getElementById("leaveModal").classList.remove("hidden");
}

function closeLeaveForm() {
  document.getElementById("leaveModal").classList.add("hidden");
}

document.addEventListener("change", () => {
  const f = document.getElementById("fromDate")?.value;
  const t = document.getElementById("toDate")?.value;
  if (!f || !t) return;
  document.getElementById("leaveDays").value =
    (new Date(t) - new Date(f)) / (1000 * 3600 * 24) + 1;
});

function submitLeave() {
  const user = JSON.parse(localStorage.getItem("currentUser")) || {};
  const from = document.getElementById("fromDate").value;
  const to = document.getElementById("toDate").value;
  const type = document.getElementById("leaveType").value;

  timeOffData.push({
    name: user.name || "Employee",
    start: formatDate(new Date(from).getDate(), new Date(from).getMonth(), new Date(from).getFullYear()),
    end: formatDate(new Date(to).getDate(), new Date(to).getMonth(), new Date(to).getFullYear()),
    type,
    status: "Approved"
  });

  closeLeaveForm();
  renderTimeOffTable();
}

/* =====================================================
   EMPLOYEES
===================================================== */

function loadEmployees() {
  fetch("/data.json")
    .then(res => res.json())
    .then(data => {
      const grid = document.getElementById("employeeGrid");
      if (!grid) return;

      grid.innerHTML = "";
      data.users.forEach(emp => {
        if (emp.role !== "employee") return;

        const card = document.createElement("div");
        card.className = "card";
        card.style.cursor = "pointer";
        card.onclick = () =>
          window.location.href = `employee-profile.html?loginId=${emp.loginId}`;

        card.innerHTML = `
          <img src="avatar.png">
          <div>${emp.name}</div>
          <div class="status-dot"
            style="background:${emp.status === "present" ? "#2ecc71" : "#e74c3c"}">
          </div>
        `;
        grid.appendChild(card);
      });
    });
}

/* ---------- HELPERS ---------- */
function monthName(m) {
  return ["January","February","March","April","May","June",
          "July","August","September","October","November","December"][m];
}

function formatDate(d, m, y) {
  return `${String(d).padStart(2,"0")}/${String(m+1).padStart(2,"0")}/${y}`;
}

/* ---------- DEFAULT ---------- */
showEmployees();
