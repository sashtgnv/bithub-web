async function login(username, password) {
    // console.log(JSON.stringify({ username, password }));
    const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({username, password})
    });
    localStorage.setItem('jwt_token', data.token);
    localStorage.setItem('user_id', data.userId);
    localStorage.setItem('current_username', data.username);
    window.location.href = 'dashboard.html';
}

async function register(username, email, password) {
    const data = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({username, email, password})
    });
    localStorage.setItem('jwt_token', data.token);
    localStorage.setItem('user_id', data.userId);
    localStorage.setItem('current_username', data.username);
    window.location.href = 'dashboard.html';
}

function logout() {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_id');
    window.location.href = 'index.html';
}

// Защита страниц: редирект на вход, если нет токена
function requireAuth() {
    if (!localStorage.getItem('jwt_token')) {
        window.location.href = 'index.html';
    }
}

// Инициализация ссылки на профиль в шапке
function initProfileLink() {
    const profileLink = document.getElementById('profile-link');
    if (profileLink) {
        const username = localStorage.getItem('current_username');
        // Если логин есть — формируем ссылку, если нет — ставим #
        profileLink.href = username ? `profile.html?username=${encodeURIComponent(username)}` : '#';
    }
}