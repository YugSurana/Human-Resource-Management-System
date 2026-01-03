const params = new URLSearchParams(window.location.search);
const loginId = params.get("loginId");

let employee;

/* ================= LOAD EMPLOYEE ================= */
fetch("data.json")
  .then(res => res.json())
  .then(data => {
    employee = data.users.find(u => u.loginId === loginId);
    if (!employee) {
      document.getElementById("content").innerHTML =
        "<h2>Employee not found</h2>";
      return;
    }
    renderProfile();
  });

/* ================= PROFILE ================= */
function renderProfile() {
  document.getElementById("content").innerHTML = `
    <div class="profile-card">
      <div class="profile-header">
        <img src="avatar.png" class="avatar">
        <div>
          <h1>${employee.name}</h1>
          <p>Login ID: ${employee.loginId}</p>
          <p>Email: ${employee.email}</p>
          <p>Phone: ${employee.phone}</p>
        </div>
      </div>

      <div class="tabs">
        <span class="active" onclick="showResume(this)">Resume</span>
        <span onclick="showPrivate(this)">Private Info</span>
        <span onclick="showSalary(this)">Salary</span>
        <span onclick="showAttendance(this)">Attendance</span>
        <span onclick="showTimeOff(this)">Time Off</span>
      </div>

      <div id="tabContent"></div>
    </div>
  `;

  showResume(document.querySelector(".tabs span"));
}

/* ================= TAB UTILS ================= */
function activate(el) {
  el.parentElement.querySelectorAll("span")
    .forEach(s => s.classList.remove("active"));
  el.classList.add("active");
}

/* ================= RESUME ================= */
function showResume(el) {
  activate(el);
  document.getElementById("tabContent").innerHTML = `
    <div class="two-col">
      <div>
        <h2>Professional Summary</h2>
        <p>
          Detail-oriented Software Engineer with strong experience in building
          scalable web applications, internal enterprise tools, and REST-based
          systems. Known for clean code, reliability, and collaboration with
          cross-functional teams.
        </p>

        <h2>Work Experience</h2>
        <div class="card">
          <b>Software Engineer</b><br>
          ABC Technologies<br>
          <small>July 2023 – Present</small>
          <ul>
            <li>Designed and maintained internal HRMS and payroll modules</li>
            <li>Developed REST APIs using Node.js and Express</li>
            <li>Worked closely with frontend teams on dashboard UX</li>
            <li>Improved performance by optimizing SQL queries</li>
          </ul>
        </div>

        <div class="card">
          <b>Software Development Intern</b><br>
          XYZ Solutions<br>
          <small>Jan 2022 – Jun 2023</small>
          <ul>
            <li>Built UI components using HTML, CSS, and JavaScript</li>
            <li>Resolved bugs and improved existing modules</li>
            <li>Collaborated with senior engineers during deployments</li>
          </ul>
        </div>

        <h2>Education</h2>
        <div class="card">
          <b>B.Tech – Computer Engineering</b><br>
          XYZ University<br>
          <small>2019 – 2023</small>
        </div>
      </div>

      <div>
        <h2>Key Skills</h2>
        <ul>
          <li>JavaScript (ES6+)</li>
          <li>Node.js & Express</li>
          <li>HTML & CSS</li>
          <li>SQL & Database Design</li>
          <li>REST API Development</li>
        </ul>

        <h2>Languages</h2>
        <ul>
          <li>English – Professional</li>
          <li>Hindi – Native</li>
        </ul>

        <h2>Certifications</h2>
        <ul>
          <li>Full Stack Web Development</li>
          <li>Database Management Systems</li>
          <li>Software Engineering Fundamentals</li>
        </ul>
      </div>
    </div>
  `;
}

/* ================= PRIVATE INFO ================= */
function showPrivate(el) {
  activate(el);
  document.getElementById("tabContent").innerHTML = `
    <table class="table">
      <tr><td>Date of Birth</td><td>01/01/1999</td></tr>
      <tr><td>Residing Address</td><td>Ahmedabad, India</td></tr>
      <tr><td>Nationality</td><td>Indian</td></tr>
      <tr><td>Personal Email</td><td>user@gmail.com</td></tr>
      <tr><td>Gender</td><td>Male</td></tr>
      <tr><td>Marital Status</td><td>Single</td></tr>
      <tr><td>Date of Joining</td><td>01/07/2023</td></tr>
      <tr><td>Bank Name</td><td>SBI</td></tr>
      <tr><td>Account Number</td><td>XXXX-1234</td></tr>
      <tr><td>IFSC</td><td>SBIN0000123</td></tr>
      <tr><td>PAN</td><td>ABCDE1234F</td></tr>
      <tr><td>UAN</td><td>123456789</td></tr>
    </table>
  `;
}

/* ================= SALARY ================= */
function showSalary(el) {
  activate(el);

  const base = 80000;
  const yearly = 100000;
  const pf = base * 0.12;

  document.getElementById("tabContent").innerHTML = `
    <h2>Salary Overview</h2>

    <table class="table">
      <tr><td>Base Salary (Monthly)</td><td>₹${base}</td></tr>
      <tr><td>Yearly Allowance</td><td>₹${yearly}</td></tr>
    </table>

    <h3>Salary Components (Monthly)</h3>
    <table class="table">
      <tr><td>Basic Salary</td><td>₹${(base * 0.5).toFixed(0)}</td></tr>
      <tr><td>House Rent Allowance</td><td>₹${(base * 0.5).toFixed(0)}</td></tr>
      <tr><td>Standard Allowance</td><td>₹${(base * 0.1667).toFixed(0)}</td></tr>
      <tr><td>Performance Allowance</td><td>₹${(base * 0.0833).toFixed(0)}</td></tr>
      <tr><td>Travel Allowance</td><td>₹${(base * 0.0833).toFixed(0)}</td></tr>
      <tr><td>Fixed Allowance</td><td>₹${(base * 0.1167).toFixed(0)}</td></tr>
    </table>

    <h3>Provident Fund & Tax</h3>
    <table class="table">
      <tr><td>Employee PF (12%)</td><td>₹${pf.toFixed(0)}</td></tr>
      <tr><td>Employer PF (12%)</td><td>₹${pf.toFixed(0)}</td></tr>
      <tr><td>Professional Tax</td><td>₹1000</td></tr>
    </table>
  `;
}

/* ================= ATTENDANCE ================= */
let currentMonth = 11;
let currentYear = 2025;
let currentFilter = "all";

function showAttendance(el) {
  activate(el);
  renderAttendance();
}

function changeMonth(step) {
  currentMonth += step;
  if (currentMonth < 0) { currentMonth = 11; currentYear--; }
  if (currentMonth > 11) { currentMonth = 0; currentYear++; }
  renderAttendance();
}

function renderAttendance() {
  const data = generateAttendanceData(currentYear, currentMonth);

  document.getElementById("tabContent").innerHTML = `
    <h2>Attendance – ${monthName(currentMonth)} ${currentYear}</h2>

    <div class="attendance-summary">
      <button onclick="changeMonth(-1)">&lt;</button>
      <button onclick="changeMonth(1)">&gt;</button>
      <span>Present: ${data.present}</span>
      <span>Absent: ${data.absent}</span>
      <span>Working Days: ${data.total}</span>
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
  `;
}

/* ================= ATTENDANCE HELPERS ================= */
function generateAttendanceData(year, month) {
  const days = [];
  let present = 0, absent = 0, total = 0;

  const leaveDays = [5, 12, 19, 26];
  const extraDays = [8, 15, 22];
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const day = date.getDay();
    if (day === 0 || day === 6) continue;

    total++;

    if (leaveDays.includes(d)) {
      absent++;
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
    <tr>
      <td>${d.date}</td>
      <td class="${d.in === "-" ? "red" : "green"}">${d.in}</td>
      <td>${d.out}</td>
      <td>${d.work}</td>
      <td>${d.extra}</td>
    </tr>
  `).join("");
}

function monthName(m) {
  return [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ][m];
}

function formatDate(d, m, y) {
  return `${String(d).padStart(2,"0")}/${String(m+1).padStart(2,"0")}/${y}`;
}

/* ================= TIME OFF ================= */
function showTimeOff(el) {
  activate(el);

  document.getElementById("tabContent").innerHTML = `
    <h2>Time Off Requests</h2>

    <table class="table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Type</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>08/01/2026</td>
          <td>Paid Leave</td>
          <td id="status-1">Pending</td>
          <td id="action-1">
            <button class="approve-btn" onclick="approveLeave(1)">Approve</button>
            <button class="reject-btn" onclick="rejectLeave(1)">Reject</button>
          </td>
        </tr>

        <tr>
          <td>15/01/2026</td>
          <td>Sick Leave</td>
          <td id="status-2">Pending</td>
          <td id="action-2">
            <button class="approve-btn" onclick="approveLeave(2)">Approve</button>
            <button class="reject-btn" onclick="rejectLeave(2)">Reject</button>
          </td>
        </tr>
      </tbody>
    </table>
  `;
}

/* ================= HELPERS ================= */
function monthName(m) {
  return ["January","February","March","April","May","June",
          "July","August","September","October","November","December"][m];
}
function formatDate(d, m, y) {
  return `${String(d).padStart(2,"0")}/${String(m+1).padStart(2,"0")}/${y}`;
}
function approveLeave(id) {
  document.getElementById(`status-${id}`).textContent = "Approved";
  document.getElementById(`status-${id}`).style.color = "#2ecc71";
  document.getElementById(`action-${id}`).innerHTML = "-";
}

function rejectLeave(id) {
  document.getElementById(`status-${id}`).textContent = "Rejected";
  document.getElementById(`status-${id}`).style.color = "#e74c3c";
  document.getElementById(`action-${id}`).innerHTML = "-";
}

