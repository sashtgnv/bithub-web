async function login(username, password) {
    // console.log(JSON.stringify({ username, password }));
    const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({username, password})
    });
    localStorage.setItem('jwt_token', data.token);
    localStorage.setItem('user_id', data.userId);

    window.location.href = 'dashboard.html';
}

async function register(username, email, password) {
    const data = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({username, email, password})
    });
    localStorage.setItem('jwt_token', data.token);
    localStorage.setItem('user_id', data.userId);
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