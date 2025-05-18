document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Silakan login sebagai admin.');
    window.location.href = '/admin/login.html';
    return;
  }

  const form = document.getElementById('create-news-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', document.getElementById('title').value);
    formData.append('content', document.getElementById('content').value);
    formData.append('category_id', document.getElementById('categoryId').value);
     formData.append('image', document.getElementById('image').files[0]);
     
    const imageFile = document.getElementById('image').files[0];
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      const response = await fetch('/api/news', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
          // Jangan pakai Content-Type di sini, FormData akan otomatis set
        },
        body: formData
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Gagal tambah berita');

      alert('Berita berhasil ditambahkan!');
      form.reset();
      loadNews();
    } catch (err) {
      console.error(err);
      alert('Error: ' + err.message);
    }
  });

  async function loadNews() {
    try {
      const res = await fetch('/api/news');
      const newsList = await res.json();

      const container = document.getElementById('news-list');
      container.innerHTML = '';

      newsList.forEach(news => {
        const div = document.createElement('div');
        div.innerHTML = `
          <h3>${news.title}</h3>
          <p>${news.content}</p>
          ${news.image_url ? `<img src="${news.image_url}" alt="Gambar" width="200">` : ''}
          <hr>
        `;
        container.appendChild(div);
      });
    } catch (err) {
      console.error('Gagal ambil berita:', err.message);
    }
  }

  // Load saat halaman pertama kali dibuka
  loadNews();
});
