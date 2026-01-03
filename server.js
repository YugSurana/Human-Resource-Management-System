const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// MUST be before routes
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

const DATA_FILE = path.join(__dirname, "data.json");

// ---------- SAFE HELPERS ----------
function readData() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify({ users: [] }, null, 2));
    }
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
  } catch (err) {
    console.error("readData error:", err);
    return { users: [] };
  }
}

function writeData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("writeData error:", err);
  }
}

// ---------- LOGIN ID GENERATOR ----------
function generateLoginId(company, name, year, count) {
  const companyCode = company.slice(0, 2).toUpperCase();

  const parts = name.trim().split(" ");
  if (parts.length < 2) {
    throw new Error("Full name must include first and last name");
  }

  const nameCode =
    (parts[0].slice(0, 2) + parts[1].slice(0, 2)).toUpperCase();

  const number = String(count).padStart(4, "0");

  return `${companyCode}${nameCode}${year}${number}`;
}

// ---------- SIGNUP ----------
app.post("/signup", (req, res) => {
  try {
    const {
      company,
      name,
      year,
      email,
      phone,
      password,
      confirmPassword,
      role
    } = req.body;

    if (
      !company ||
      !name ||
      !year ||
      !email ||
      !phone ||
      !password ||
      !confirmPassword ||
      !role
    ) {
      return res.status(400).json({ error: "All fields including role are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const userRole = role === "admin" ? "admin" : "employee";
    const data = readData();

    const loginId = generateLoginId(
      company,
      name,
      year,
      data.users.length + 1
    );

    const user = {
      loginId,
      company,
      name,
      year,
      email,
      phone,
      role: userRole,
      status: "absent",     // ✅ default
      online: false         // ✅ default
    };

    data.users.push({ ...user, password });
    writeData(data);

    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ---------- LOGIN ----------
app.post("/login", (req, res) => {
  try {
    const { loginId, password } = req.body;
    const data = readData();

    const user = data.users.find(
      (u) => u.loginId === loginId && u.password === password
    );

    if (!user) {
      return res.status(401).json({ error: "Invalid Login ID or Password" });
    }

    return res.json({
      message: "Login successful",
      user: {
        loginId: user.loginId,
        name: user.name,
        role: user.role
      }
    });
  } catch (err) {
    return res.status(500).json({ error: "Login failed" });
  }
});

// ---------- READ-ONLY DATA FOR DASHBOARD ----------
app.get("/data.json", (req, res) => {
  const filePath = path.join(__dirname, "data.json");
  res.sendFile(filePath);
});

// ---------- UPDATE STATUS (ADDED) ----------
app.post("/update-status", (req, res) => {
  try {
    const { loginId, status, online } = req.body;

    const data = readData();
    const user = data.users.find(u => u.loginId === loginId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.status = status;
    user.online = online;

    writeData(data);
    return res.json({ message: "Status updated" });
  } catch {
    return res.status(500).json({ error: "Failed to update status" });
  }
});

// ---------- START ----------
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
