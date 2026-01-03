function signup() {
  const companyEl = document.getElementById('company');
  const nameEl = document.getElementById('name');
  const yearEl = document.getElementById('year');
  const emailEl = document.getElementById('email');
  const phoneEl = document.getElementById('phone');
  const passwordEl = document.getElementById('password');
  const confirmPasswordEl = document.getElementById('confirmPassword');

  // 🟢 ADDITION: get selected role (employee/admin)
  const roleEl = document.querySelector('input[name="role"]:checked');

  const payload = {
    company: companyEl.value.trim(),
    name: nameEl.value.trim(),
    year: yearEl.value.trim(),
    email: emailEl.value.trim(),
    phone: phoneEl.value.trim(),
    password: passwordEl.value,
    confirmPassword: confirmPasswordEl.value,

    // 🟢 ADDITION (safe if backend ignores it)
    role: roleEl ? roleEl.value : undefined
  };

  fetch('/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
    .then(async (res) => {
      const text = await res.text();

      if (!text) {
        throw new Error('Empty response from server');
      }

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error('Invalid JSON response from server');
      }

      if (!res.ok) {
        throw new Error(data.error || 'Signup failed');
      }

      return data;
    })
    .then((user) => {
      localStorage.setItem('newUser', JSON.stringify(user));
      window.location.href = 'success.html';
    })
    .catch((err) => {
      console.error('Signup error:', err);
      alert(err.message);
    });
}

function login() {
  const loginIdEl = document.getElementById('loginId');
  const passwordEl = document.getElementById('password');

  if (!loginIdEl.value || !passwordEl.value) {
    alert("Please enter Login ID and Password");
    return;
  }

  fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      loginId: loginIdEl.value.trim(),
      password: passwordEl.value
    })
  })
    .then(async (res) => {
      const text = await res.text();
      if (!text) throw new Error('Empty response from server');
      const data = JSON.parse(text);
      if (!res.ok) throw new Error(data.error || 'Login failed');
      return data;
    })
    .then((data) => {

      // ✅ ADDITION: store logged-in user (DO NOT REMOVE)
      localStorage.setItem("currentUser", JSON.stringify(data.user));

      // 🟢 ADDITION: role-based redirect
      if (data.user && data.user.role === 'admin') {
        window.location.href = 'admin-dashboard.html';
      } else {
        window.location.href = 'dashboard.html';
      }
    })
    .catch((err) => {
      alert(err.message);
    });
}
