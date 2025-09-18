document.addEventListener("DOMContentLoaded", () => {
  // Register handler (sudah ada di Task 2.1)
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const username = document.getElementById("username").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      const userData = { username, email, password };

      try {
        const res = await fetch("http://localhost:5000/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(userData)
        });

        const data = await res.json();

        if (res.ok) {
          alert("Register berhasil! Silakan login.");
          window.location.href = "login.html";
        } else {
          alert("Register gagal: " + (data.message || "Terjadi kesalahan"));
        }
      } catch (err) {
        console.error("Error register:", err);
        alert("Gagal koneksi ke server");
      }
    });
  }

  // Login handler
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      const loginData = { email, password };

      try {
        const res = await fetch("http://localhost:5000/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loginData)
        });

        const data = await res.json();

        if (res.ok) {
          // Simpan token ke localStorage
          localStorage.setItem("token", data.token);
          alert("Login berhasil!");
          window.location.href = "../index.html"; // redirect ke halaman utama photobooth
        } else {
          alert("Login gagal: " + (data.message || "Email/Password salah"));
        }
      } catch (err) {
        console.error("Error login:", err);
        alert("Gagal koneksi ke server");
      }
    });
  }
});
