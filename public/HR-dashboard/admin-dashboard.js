function openEmployee() {
  const id = document.getElementById("loginId").value.trim();
  const pwd = document.getElementById("password").value.trim();

  if (!id || !pwd) {
    alert("Enter Employee Login ID and Password");
    return;
  }

  // Password validation can be added later
  window.location.href = `admin-employee.html?loginId=${id}`;
}
