document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  // Validasi sederhana
  if (!email || !password) {
    return alert('Email dan password wajib diisi.');
  }

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login gagal. Coba lagi.');
    }

    // Cek apakah token tersedia
    if (!data.token) {
      throw new Error('Token tidak ditemukan di response. Pastikan backend mengembalikan token.');
    }

    // Simpan token ke localStorage
    localStorage.setItem('token', data.token);

    alert('Login berhasil!');
    window.location.href = '/admin/dashboard.html'; // Arahkan ke halaman utama admin
  } catch (error) {
    console.error('Login error:', error);
    alert('Error: ' + error.message);
  }
});
