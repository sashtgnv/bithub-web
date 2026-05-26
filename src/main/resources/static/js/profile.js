document.addEventListener('DOMContentLoaded', async () => {
    // Берём username из URL: profile.html?username=ivan
    const params = new URLSearchParams(window.location.search);
    const targetUser = params.get('username');

    if (!targetUser) {
        document.getElementById('username-display').textContent = 'Пользователь не указан';
        return;
    }

    // Элементы DOM
    const usernameEl = document.getElementById('username-display');
    const aboutEl = document.getElementById('about-me-display');
    const loadingEl = document.getElementById('repos-loading');
    const reposEl = document.getElementById('user-repos');
    const editBtn = document.getElementById('edit-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const titleEl = document.getElementById('page-title');

    try {
        const user = await apiFetch(`/user/profile/${targetUser}`);
        aboutEl.textContent = Utils.escapeHtml(user.aboutMe);
    } catch (err) {
        aboutEl.textContent = '';
    }
    usernameEl.textContent = targetUser;

    // Проверяем, наш ли это профиль
    const currentUsername = localStorage.getItem('current_username');
    if (currentUsername === targetUser) {
        titleEl.textContent = 'Мой профиль';
        editBtn.classList.remove('hidden');
        logoutBtn.classList.remove('hidden');
    } else {
        titleEl.textContent = 'Профиль пользователя';
    }

    // Загружаем проекты
    // Ожидается эндпоинт: GET /api/user/{username}/projects
    try {
        const repos = await apiFetch(`/proj/${targetUser}/projects`);
        loadingEl.classList.add('hidden');
        reposEl.classList.remove('hidden');

        if (!repos || repos.length === 0) {
            reposEl.innerHTML = '<p class="meta">У пользователя пока нет проектов.</p>';
        } else {
            reposEl.innerHTML = repos.map(r => `
                <div class="repo-card">
                    <h3><a href="repo.html?id=${r.id}">${Utils.escapeHtml(r.name)}</a></h3>
                    <p class="meta">
                        ${Utils.escapeHtml(r.description || '—')} • 
                        ${r.isPublic ? '🌐 Публичный' : '🔒 Приватный'} • 
                        Создан: ${Utils.formatDate(r.createdAt)}
                    </p>
                </div>
            `).join('');
        }
    } catch (err) {
        loadingEl.classList.add('hidden');
        reposEl.innerHTML = `<p class="error">Ошибка загрузки проектов: ${err.message}</p>`;
    }
});