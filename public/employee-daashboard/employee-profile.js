const params = new URLSearchParams(window.location.search);
const loginId = params.get("loginId");

function goBack() {
  window.location.href = "dashboard.html";
}

fetch("/data.json")
  .then(res => res.json())
  .then(data => {
    const user = data.users.find(u => u.loginId === loginId);
    if (!user) {
      document.getElementById("profileBox").innerText = "User not found";
      return;
    }

    document.getElementById("profileBox").innerHTML = `
      <p><b>Name:</b> ${user.name}</p>
      <p><b>Company:</b> ${user.company}</p>
      <p><b>Email:</b> ${user.email}</p>
      <p><b>Phone:</b> ${user.phone}</p>
      <p><b>Role:</b> ${user.role}</p>
      <p><b>Status:</b> ${user.status || "absent"}</p>
    `;
  });
