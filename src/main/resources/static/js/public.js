document.addEventListener('DOMContentLoaded', async () => {
    requireAuth();
    initProfileLink();

    const loadingEl = document.getElementById('public-loading');
    const emptyEl = document.getElementById('public-empty');
    const errorEl = document.getElementById('public-error');
    const errorMsg = document.getElementById('public-error-msg');
    const listEl = document.getElementById('public-list');
    const searchInput = document.getElementById('search-input');

    let allRepos = [];

    try {
        const repos = await apiFetch('/proj/public');
        loadingEl.classList.add('hidden');

        if (!repos || repos.length === 0) {
            emptyEl.classList.remove('hidden');
            return;
        }

        allRepos = repos;
        renderRepos(repos);

    } catch (err) {
        loadingEl.classList.add('hidden');
        errorEl.classList.remove('hidden');
        errorMsg.textContent = `Не удалось загрузить публичные проекты: ${err.message}`;
        console.error('Public repos load error:', err);
    }

    // Поиск/фильтрация репозиториев
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();

        if (!query) {
            renderRepos(allRepos);
            return;
        }

        const filtered = allRepos.filter(repo =>
            repo.name.toLowerCase().includes(query) ||
            (repo.description && repo.description.toLowerCase().includes(query)) ||
            (repo.owner?.username && repo.owner.username.toLowerCase().includes(query))
        );

        renderRepos(filtered);
    });

    function renderRepos(repos) {
        if (!repos || repos.length === 0) {
            listEl.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <i class="fas fa-search"></i>
                    <h3>Ничего не найдено</h3>
                    <p>По вашему запросу не найдено репозиториев.</p>
                </div>
            `;
            return;
        }

        listEl.innerHTML = repos.map(repo => {
            const visibilityBadge = repo.isPublic
                ? '<span class="badge badge-public"><i class="fas fa-globe"></i> Публичный</span>'
                : '<span class="badge badge-private"><i class="fas fa-lock"></i> Приватный</span>';

            return `
                <div class="repo-card" data-repo-id="${repo.id}">
                    <div class="repo-card-header">
                        <i class="fas fa-folder repo-card-icon"></i>
                        <h3><a href="repo.html?id=${repo.id}">${Utils.escapeHtml(repo.name)}</a></h3>
                    </div>
                    <p class="repo-description">
                        ${Utils.escapeHtml(repo.description || 'Без описания')}
                    </p>
                    <div class="repo-card-meta">
                        <span class="meta-item">
                            <i class="fas fa-user"></i>
                            ${Utils.escapeHtml(repo.owner?.username || '—')}
                        </span>
                        <span class="meta-item">
                            <i class="fas fa-calendar"></i>
                            ${Utils.formatDate(repo.createdAt)}
                        </span>
                    </div>
                    <div class="repo-card-badges">
                        ${visibilityBadge}
                    </div>
                </div>
            `;
        }).join('');

        // Добавляем обработчики клика на карточки
        listEl.querySelectorAll('.repo-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.tagName !== 'A') {
                    const repoId = card.dataset.repoId;
                    window.location.href = `repo.html?id=${repoId}`;
                }
            });
        });
    }
});