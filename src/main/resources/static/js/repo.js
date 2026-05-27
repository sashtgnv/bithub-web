document.addEventListener('DOMContentLoaded', async () => {
    requireAuth();
    initProfileLink();

    document.getElementById('logout-btn').addEventListener('click', logout);

    const params = new URLSearchParams(window.location.search);
    const repoId = params.get('id');
    if (!repoId) {
        document.getElementById('repo-info').innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-circle"></i>
                <h3>ID репозитория не указан</h3>
                <p>Пожалуйста, выберите репозиторий из каталога.</p>
            </div>`;
        return;
    }

    const infoEl = document.getElementById('repo-info');
    const loadingCommits = document.getElementById('commits-loading');
    const commitsWrapper = document.getElementById('commits-wrapper');
    const tbodyEl = document.getElementById('commits-body');
    const emptyEl = document.getElementById('commits-empty');
    const errorEl = document.getElementById('commits-error');
    const errorMsg = document.getElementById('commits-error-msg');
    const ownerActions = document.getElementById('owner-actions');

    // Элементы модалки
    const modal = document.getElementById('delete-modal');
    const modalRepoName = document.getElementById('modal-repo-name');
    const confirmBtn = document.getElementById('confirm-delete');
    const cancelBtn = document.getElementById('cancel-delete');
    const deleteBtn = document.getElementById('delete-repo-btn');
    const modalError = document.getElementById('modal-error');


    // 1. Привязываем обработчики СРАЗУ, до запроса к API
    deleteBtn.addEventListener('click', () => {
        modal.classList.add('show');
        modalError.classList.add('hidden');
    });

    const closeModal = () => modal.classList.remove('show');
    cancelBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    confirmBtn.addEventListener('click', async () => {
        confirmBtn.disabled = true;
        confirmBtn.textContent = 'Удаление...';
        modalError.classList.add('hidden');

        try {
            await apiFetch(`/proj/${repoId}`, { method: 'DELETE' });
            window.location.href = 'dashboard.html';
        } catch (err) {
            modalError.textContent = `Ошибка: ${err.message}`;
            modalError.classList.remove('hidden');
        } finally {
            confirmBtn.disabled = false;
            confirmBtn.textContent = 'Удалить';
        }
    });

    // 2. Загружаем данные репозитория
    try {
        const repo = await apiFetch(`/proj/${repoId}`);

        const visibilityBadge = repo.isPublic
            ? '<span class="badge badge-public"><i class="fas fa-globe"></i> Публичный</span>'
            : '<span class="badge badge-private"><i class="fas fa-lock"></i> Приватный</span>';

        infoEl.innerHTML = `
            <div class="repo-header-info">
                <div class="repo-title-row">
                    <i class="fas fa-folder repo-icon"></i>
                    <h2>${Utils.escapeHtml(repo.name)}</h2>
                </div>
                <div class="repo-meta-row">
                    ${visibilityBadge}
                    <a href="profile.html?username=${Utils.escapeHtml(repo.owner?.username || '')}" class="owner-link">
                        <i class="fas fa-user"></i> ${Utils.escapeHtml(repo.owner?.username || '—')}
                    </a>
                    <span class="meta-item"><i class="fas fa-calendar"></i> ${Utils.formatDate(repo.createdAt)}</span>
                </div>
                ${repo.description ? `<p class="description">${Utils.escapeHtml(repo.description)}</p>` : ''}
            </div>
            <div class="cli-box">
                <div class="cli-header">
                    <strong><i class="fas fa-terminal"></i> Команда для клонирования:</strong>
                    <button class="btn-copy" onclick="navigator.clipboard.writeText('clone /api/proj/${repo.id}')">
                        <i class="fas fa-copy"></i> Копировать
                    </button>
                </div>
                <code>clone /api/proj/${repo.id}</code>
            </div>
        `;

        // Проверяем владения
        const currentUserId = localStorage.getItem('user_id');
        if (currentUserId && repo.owner?.id && String(currentUserId) === String(repo.owner.id)) {
            ownerActions.classList.remove('hidden');
            modalRepoName.textContent = repo.name;
        }

    } catch (err) {
        infoEl.innerHTML = `
            <div class="error-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h3>Ошибка загрузки</h3>
                <p>Не удалось загрузить информацию о репозитории: ${err.message}</p>
            </div>`;
        console.error('Repo load error:', err);
    }

    // 3. Загружаем историю коммитов
    try {
        const commits = await apiFetch(`/proj/${repoId}/commits`);
        loadingCommits.classList.add('hidden');
        console.log(commits)

        if (!commits || commits.length === 0) {
            emptyEl.classList.remove('hidden');
        } else {
            commitsWrapper.classList.remove('hidden');

            tbodyEl.innerHTML = commits.map(c => `
                <tr>
                    <td><code class="commit-hash" title="${Utils.escapeHtml(c.hash)}">${Utils.escapeHtml(c.hash)}</code></td>
                    <td class="commit-message">${Utils.escapeHtml(c.message)}</td>
                    <td class="commit-author"><i class="fas fa-user-circle"></i> ${Utils.escapeHtml(c.author)}</td>
                    <td class="commit-date"><i class="far fa-clock"></i> ${Utils.formatDate(c.createdAt)}</td>
                </tr>
            `).join('');
        }
    } catch (err) {
        loadingCommits.classList.add('hidden');
        errorEl.classList.remove('hidden');
        errorMsg.textContent = `Не удалось загрузить историю коммитов: ${err.message}`;
    }
});