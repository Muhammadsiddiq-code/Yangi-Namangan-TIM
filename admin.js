// API so'rov yuborish uchun umumiy funksiya
async function apiRequest(endpoint, options = {}) {
    const url = `http://localhost:3000${endpoint}`;
    const headers = { 'Content-Type': 'application/json' };
  
    const response = await fetch(url, { ...options, headers });
    if (!response.ok) throw new Error(`HTTP xato! status: ${response.status}`);
    return await response.json();
  }
  
  // Toast xabarlarini ko'rsatish
  function showToast(type, title, message) {
    const toastContainer = document.getElementById("toast-container") || createToastContainer();
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerHTML = `<strong>${title}</strong><p>${message}</p>`;
    toastContainer.appendChild(toast);
  
    setTimeout(() => toast.remove(), 3000);
  }
  
  function createToastContainer() {
    const container = document.createElement("div");
    container.id = "toast-container";
    document.body.appendChild(container);
    return container;
  }
  
  // Yangiliklarni yuklash
  async function loadNews() {
    try {
      const news = await apiRequest("/news");
      displayNews(news);
    } catch (error) {
      console.error("Yangiliklarni yuklashda xato:", error);
      showToast("error", "Xato!", "Yangiliklarni yuklashda xato yuz berdi");
    }
  }
  
  // Yangilik qo'shish/yangilash
  async function handleNewsSubmit(e) {
    e.preventDefault();
  
    const newsId = document.getElementById("newsId").value;
    const title = document.getElementById("newsTitle").value.trim();
    const category = document.getElementById("newsCategory").value;
    const content = document.getElementById("newsContent").value.trim();
    const published = document.getElementById("newsPublished").checked;
  
    if (!title || !content) {
      showToast("error", "Xato!", "Barcha maydonlarni to'ldiring");
      return;
    }
  
    const currentUser = JSON.parse(localStorage.getItem("currentUser")) || {
      name: "Admin",
    };
  
    const newsData = {
      id: newsId || Date.now().toString(),
      title,
      category,
      content,
      published,
      author: currentUser.name,
      date: new Date().toISOString(),
      views: 0,
    };
  
    try {
      if (newsId) {
        // Yangilash
        await apiRequest(`/news/${newsId}`, {
          method: "PUT",
          body: JSON.stringify(newsData),
        });
        showToast("success", "Muvaffaqiyatli!", "Yangilik muvaffaqiyatli yangilandi");
      } else {
        // Qo'shish
        await apiRequest("/news", {
          method: "POST",
          body: JSON.stringify(newsData),
        });
        showToast("success", "Muvaffaqiyatli!", "Yangilik muvaffaqiyatli qo'shildi");
      }
  
      closeNewsModal();
      loadNews(); // Serverdan yangi ro'yxatni yuklash
    } catch (error) {
      console.error("Yangilik saqlashda xato:", error);
      showToast("error", "Xato!", "Yangilikni saqlashda xato yuz berdi");
    }
  }
  
  // Yangiliklarni o'chirish
  async function deleteNews(newsId) {
    try {
      const newsItem = await apiRequest(`/news/${newsId}`);
      showConfirmModal("Yangilikni o'chirish", `"${newsItem.title}" yangiligini o'chirishni xohlaysizmi?`, async () => {
        await apiRequest(`/news/${newsId}`, { method: "DELETE" });
        showToast("success", "O'chirildi!", "Yangilik muvaffaqiyatli o'chirildi");
        loadNews();
      });
    } catch (error) {
      console.error("O'chirishda xato:", error);
      showToast("error", "Xato!", "Yangilikni o'chirishda xato yuz berdi");
    }
  }
  
  // Foydalanuvchi kiritish formasi
  async function handleUserSubmit(e) {
    e.preventDefault();
  
    const userId = document.getElementById("userId").value;
    const name = document.getElementById("userName").value.trim();
    const email = document.getElementById("userEmail").value.trim();
    const role = document.getElementById("userRole").value;
  
    if (!name || !email || !role) {
      showToast("error", "Xato!", "Barcha majburiy maydonlarni to'ldiring");
      return;
    }
  
    const user = { id: userId || Date.now().toString(), name, email, role };
    try {
      if (userId) {
        await apiRequest(`/users/${userId}`, { method: "PUT", body: JSON.stringify(user) });
        showToast("success", "Tahrirlandi", "Foydalanuvchi muvaffaqiyatli tahrirlandi");
      } else {
        await apiRequest("/users", { method: "POST", body: JSON.stringify(user) });
        showToast("success", "Qo'shildi", "Foydalanuvchi muvaffaqiyatli qo'shildi");
      }
      closeUserModal();
      loadUsers();
    } catch (error) {
      console.error("Foydalanuvchini saqlashda xato:", error);
      showToast("error", "Xato!", "Foydalanuvchini saqlashda xato yuz berdi");
    }
  }
  
  // Foydalanuvchilarni yuklash
  async function loadUsers() {
    try {
      const users = await apiRequest("/users");
      displayUsers(users);
    } catch (error) {
      console.error("Foydalanuvchilarni yuklashda xato:", error);
      showToast("error", "Xato!", "Foydalanuvchilarni yuklashda xato yuz berdi");
    }
  }
  
  // Izohlarni yuklash
  async function loadComments() {
    try {
      const comments = await apiRequest("/comments");
      displayComments(comments);
    } catch (error) {
      console.error("Izohlarni yuklashda xato:", error);
      showToast("error", "Xato!", "Izohlarni yuklashda xato yuz berdi");
    }
  }
  
  // Aktivitlarni yuklash
  async function loadActivities() {
    try {
      const activities = await apiRequest("/activities");
      displayActivities(activities);
    } catch (error) {
      console.error("Aktivitlarni yuklashda xato:", error);
      showToast("error", "Xato!", "Aktivitlarni yuklashda xato yuz berdi");
    }
  }
  
  // Boshqa funksiyalar (displayNews, displayUsers, displayComments, displayActivities)
  // Shu yerda DOMga ma'lumotlarni joylaydigan funksiyalar bo'ladi
  
  function displayNews(newsList) {
    const newsListEl = document.getElementById("newsList");
    if (!newsListEl) return;
  
    newsListEl.innerHTML = "";
    if (newsList.length === 0) {
      newsListEl.innerHTML = "<p>Yangiliklar yo'q</p>";
      return;
    }
  
    newsList.forEach((news) => {
      const div = document.createElement("div");
      div.className = "news-item";
      div.innerHTML = `<strong>${news.title}</strong> - ${news.category} <button onclick="deleteNews('${news.id}')">O'chirish</button>`;
      newsListEl.appendChild(div);
    });
  }
  
  function displayUsers(users) {
    const usersListEl = document.getElementById("usersList");
    usersListEl.innerHTML = "";
    users.forEach((user) => {
      const div = document.createElement("div");
      div.innerHTML = `${user.name} (${user.email}) - ${user.role} <button onclick="deleteUser('${user.id}')">O'chirish</button>`;
      usersListEl.appendChild(div);
    });
  }
  
  function displayComments(comments) {
    const commentsListEl = document.getElementById("commentsList");
    commentsListEl.innerHTML = "";
    comments.forEach((comment) => {
      const div = document.createElement("div");
      div.innerHTML = `<strong>${comment.author}</strong>: ${comment.content} <button onclick="approveComment('${comment.id}')">Tasdiqlash</button>`;
      commentsListEl.appendChild(div);
    });
  }
  
  function displayActivities(activities) {
    const activityListEl = document.getElementById("activityList");
    activityListEl.innerHTML = "";
    activities.forEach((act) => {
      const div = document.createElement("div");
      div.innerHTML = `<small>${act.time}</small> <strong>${act.type}</strong>: ${act.description}`;
      activityListEl.appendChild(div);
    });
  }
  
  // Login funksiyasi
  async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
  
    try {
      const users = await apiRequest("/users");
      const user = users.find(u => u.username === username && u.password === password);
  
      if (!user) {
        showToast("error", "Xato!", "Noto'g'ri foydalanuvchi nomi yoki parol");
        return;
      }
  
      localStorage.setItem("currentUser", JSON.stringify(user));
      showToast("success", "Muvaffaqiyatli!", "Tizimga kirildi");
      window.location.href = "dashboard.html"; // Yoki shu yerda DOMga o'tkazish
    } catch (error) {
      console.error("Kirishda xato:", error);
      showToast("error", "Xato!", "Tizimga kirishda xato");
    }
  }