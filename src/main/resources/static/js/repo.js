document.addEventListener('DOMContentLoaded', async () => {
    requireAuth();
    initProfileLink();

    document.getElementById('logout-btn').addEventListener('click', logout);

    const params = new URLSearchParams(window.location.search);
    const repoId = params.get('id');
    if (!repoId) {
        document.getElementById('repo-info').innerHTML = `<p class="error">ID репозитория не указан.</p>`;
        return;
    }

    const infoEl = document.getElementById('repo-info');
    const loadingCommits = document.getElementById('commits-loading');
    const tableEl = document.getElementById('commits-table');
    const tbodyEl = document.getElementById('commits-body');
    const emptyEl = document.getElementById('commits-empty');
    const ownerActions = document.getElementById('owner-actions');

    // Элементы модалки
    const modal = document.getElementById('delete-modal');
    const modalRepoName = document.getElementById('modal-repo-name');
    const confirmBtn = document.getElementById('confirm-delete');
    const cancelBtn = document.getElementById('cancel-delete');
    const deleteBtn = document.getElementById('delete-repo-btn');
    const modalError = document.getElementById('modal-error');

    // emptyEl.classList.remove('hidden');
    // loadingCommits.classList.remove('hidden');


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

        infoEl.innerHTML = `
            <h2>${Utils.escapeHtml(repo.name)}</h2>
            <div class="meta-row">
                <p class="badge">${repo.isPublic ? '🌐 Публичный' : '🔒 Приватный'}</p>
                <a href="profile.html?username=${Utils.escapeHtml(repo.owner?.username || '')}">
                    Владелец: ${Utils.escapeHtml(repo.owner?.username || '—')}
                </a>
                <p>Создан: ${Utils.formatDate(repo.createdAt)}</p>
            </div>
            <p class="description">${Utils.escapeHtml(repo.description || 'Без описания')}</p>
            <div class="cli-box">
                <strong>Команда для CLI:</strong>
                <code>clone /api/proj/${repo.id}</code>
            </div>
        `;

        // Проверяем владения
        const currentUserId = localStorage.getItem('user_id');
        if (currentUserId && repo.owner?.id && String(currentUserId) === String(repo.owner.id)) {
            ownerActions.classList.remove('hidden');
            modalRepoName.textContent = repo.name; // Заранее подставляем имя
        }

    } catch (err) {
        infoEl.innerHTML = `<p class="error">Ошибка загрузки: ${err.message}</p>`;
        console.error('Repo load error:', err);
    }

    // 3. Загружаем историю коммитов (параллельно или последовательно)
    try {
        const commits = await apiFetch(`/proj/${repoId}/commits`);
        loadingCommits.classList.add('hidden');

        if (!commits || commits.length === 0) {
            emptyEl.classList.remove('hidden');
        } else {
            tableEl.classList.remove('hidden');
            tbodyEl.innerHTML = commits.map(c => `
                <tr>
                    <td><code title="${Utils.escapeHtml(c.hash)}">${Utils.escapeHtml(c.hash.substring(0, 8))}</code></td>
                    <td>${Utils.escapeHtml(c.message)}</td>
                    <td>${Utils.escapeHtml(c.author)}</td>
                    <td>${Utils.formatDate(c.createdAt)}</td>
                </tr>
            `).join('');
        }
    } catch (err) {
        loadingCommits.classList.add('hidden');
        tableEl.innerHTML = `<tr><td colspan="4" class="error">Не удалось загрузить историю</td></tr>`;
    }
});