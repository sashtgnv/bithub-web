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
        titleEl.textContent = 'Профиль';
    }

    // Загружаем проекты
    // Ожидается эндпоинт: GET /api/user/{username}/projects
    loadRepos(targetUser);
});

async function loadRepos(targetUser) {
    const repoListEl = document.getElementById('repo-list');
    const emptyState = document.getElementById('empty-state');
    const errorState = document.getElementById('error-state');

    // Показываем состояние загрузки
    repoListEl.innerHTML = `
        <div class="loading-state">
            <i class="fas fa-spinner fa-spin"></i>
            <span>Загрузка репозиториев...</span>
        </div>
    `;
    emptyState.classList.add('hidden');
    errorState.classList.add('hidden');

    try {
        const repos = await apiFetch(`/proj/${targetUser}/projects`);
        allRepos = repos;

        if (!repos.length) {
            repoListEl.innerHTML = '';
            emptyState.classList.remove('hidden');
            return;
        }

        renderRepos(repos);
    } catch(err) {
        repoListEl.innerHTML = '';
        errorState.classList.remove('hidden');
        document.getElementById('error-message').textContent = err.message;
    }
}

function renderRepos(repos) {
    const repoListEl = document.getElementById('repo-list');
    const emptyState = document.getElementById('empty-state');

    if (!repos.length) {
        repoListEl.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');
    repoListEl.innerHTML = repos.map(r => {
        const visibilityBadge = r.isPublic
            ? '<span class="badge badge-public"><i class="fas fa-globe"></i> Публичный</span>'
            : '<span class="badge badge-private"><i class="fas fa-lock"></i> Приватный</span>';

        return `
            <div class="repo-card" onclick="window.location.href='repo.html?id=${r.id}'">
                <h3><a href="repo.html?id=${r.id}">${Utils.escapeHtml(r.name)}</a></h3>
                <p class="meta">${Utils.escapeHtml(r.description || 'Описание отсутствует')}</p>
                <p class="meta">
                    <i class="far fa-calendar"></i> ${new Date(r.createdAt).toLocaleDateString('ru-RU')}
                </p>
                <div class="badges">
                    ${visibilityBadge}
                </div>
            </div>
        `;
    }).join('');
}