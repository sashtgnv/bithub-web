document.addEventListener('DOMContentLoaded', function() {
    const usernameElement = document.getElementById('username');
    const fullNameDisplay = document.getElementById('fullNameDisplay');
    const bioDisplay = document.getElementById('bioDisplay');
    const repoCount = document.getElementById('repoCount');
    const publicRepoCount = document.getElementById('publicRepoCount');
    const privateRepoCount = document.getElementById('privateRepoCount');
    const reposList = document.getElementById('reposList');
    const activityFeed = document.getElementById('activityFeed');
    const logoutBtn = document.getElementById('logoutBtn');

    // Загрузка профиля пользователя
    async function loadUserProfile() {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                window.location.href = 'login.html';
                return;
            }

            const response = await fetch('/api/user/profile', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Ошибка загрузки профиля');
            }

            const userData = await response.json();

            // Отображение информации профиля
            document.getElementById('username').textContent = userData.username;
            fullNameDisplay.textContent = userData.fullName || userData.username;
            bioDisplay.textContent = userData.bio || 'Пользователь не добавил информацию о себе.';

            // Загрузка репозиториев
            loadUserRepos(userData.id);

            // Отображение статистики
            displayStats(userData.repos || []);
        } catch (error) {
            console.error('Ошибка при загрузке профиля:', error);
        }
    }

    // Загрузка репозиториев пользователя
    async function loadUserRepos(userId) {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`/api/users/${userId}/repos`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Ошибка загрузки репозиториев');
            }

            const repos = await response.json();
            renderRepos(repos);
        } catch (error) {
            console.error('Ошибка при загрузке репозиториев:', error);
        }
    }

    // Отображение статистики репозиториев
    function displayStats(repos) {
        const total = repos.length;
        const publicCount = repos.filter(repo => !repo.private).length;
        const privateCount = repos.filter(repo => repo.private).length;

        repoCount.textContent = total;
        publicRepoCount.textContent = publicCount;
        privateRepoCount.textContent = privateCount;
    }

    // Рендеринг карточек репозиториев
    function renderRepos(repos) {
        if (repos.length === 0) {
            reposList.innerHTML = '<div class="empty-state"><i class="fas fa-folder-open"></i><p>У вас пока нет репозиториев</p></div>';
            return;
        }

        reposList.innerHTML = repos.map(repo => `
            <div class="repo-card">
                <h4><i class="fas fa-code-branch"></i> ${escapeHtml(repo.name)}</h4>
                <p>${escapeHtml(repo.description || '')}</p>
                <div class="repo-meta">
                    <span class="repo-language">${repo.language ? escapeHtml(repo.language) : 'Не указан'}</span>
                    <span class="repo-stars"><i class="fas fa-star"></i> ${repo.stars || 0}</span>
                    <span class="repo-forks"><i class="fas fa-code-branch"></i> ${repo.forks || 0}</span>
                </div>
                <div class="repo-actions">
                    <a href="repo.html?id=${repo.id}" class="btn btn-small btn-outline">Открыть</a>
                </div>
            </div>
        `).join('');
    }

    // Рендеринг последней активности (заглушка)
    function renderActivity() {
        const activities = [
            { action: 'создал репозиторий', target: 'my-project', time: '2 часа назад' },
            { action: 'обновил репозиторий', target: 'my-project', time: '5 часов назад' },
            { action: 'создал ветку', target: 'feature/new-feature', time: '1 день назад' }
        ];

        if (activities.length === 0) {
            activityFeed.innerHTML = '<div class="empty-state"><i class="fas fa-history"></i><p>Нет активности</p></div>';
            return;
        }

        activityFeed.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <i class="fas fa-circle"></i>
                <div class="activity-content">
                    <p><strong>${activity.action}</strong> ${activity.target}</p>
                    <small class="text-muted">${activity.time}</small>
                </div>
            </div>
        `).join('');
    }

    // Функция для экранирования HTML
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Обработчик выхода
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('authToken');
        window.location.href = 'login.html';
    });

    // Загрузка данных при инициализации
    loadUserProfile();
    renderActivity();
});