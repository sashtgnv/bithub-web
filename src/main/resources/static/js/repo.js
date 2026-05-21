// Ждём, пока браузер полностью построит DOM-дерево
document.addEventListener('DOMContentLoaded', async () => {
    // Если нет JWT — перекидываем на страницу входа
    requireAuth();

    // Привязываем обработчик клика к кнопке выхода
    document.getElementById('logout-btn').addEventListener('click', logout);

    // Читаем ID репозитория из адресной строки (например: repo.html?id=12)
    const params = new URLSearchParams(window.location.search);
    const repoId = params.get('id');

    if (!repoId) {
        document.getElementById('repo-info').innerHTML = `<p class="error">ID репозитория не указан.</p>`;
        return;
    }

    // Сохраняем ссылки на DOM-элементы, чтобы не искать их каждый раз
    const infoEl = document.getElementById('repo-info');
    const loadingCommits = document.getElementById('commits-loading');
    const tableEl = document.getElementById('commits-table');
    const tbodyEl = document.getElementById('commits-body');
    const emptyEl = document.getElementById('commits-empty');

    try {
        // 1. Получаем данные о репозитории
        const repo = await apiFetch(`/proj/${repoId}`);

        // 2. Рендерим информацию
        infoEl.innerHTML = `
            <h2>${Utils.escapeHtml(repo.name)}</h2>
            <div class="meta-row">
                <span class="badge">${repo.isPublic ? '🌐 Публичный' : '🔒 Приватный'}</span>
                <span>Владелец: ${Utils.escapeHtml(repo.owner?.username || '—')}</span>
                <span>Создан: ${Utils.formatDate(repo.createdAt)}</span>
            </div>
            <p class="description">${Utils.escapeHtml(repo.description || 'Без описания')}</p>
            <div class="cli-box">
                <strong>Команда для клонирования:</strong>
                <code>clone /api/repo/${repo.id}</code>
            </div>
        `;

        // 3. Получаем историю коммитов
        const commits = await apiFetch(`/proj/${repoId}/commits`);

        // Скрываем индикатор загрузки
        loadingCommits.classList.add('hidden');

        if (!commits || commits.length === 0) {
            emptyEl.classList.remove('hidden'); // Показываем "пусто"
        } else {
            tableEl.classList.remove('hidden'); // Показываем таблицу
            // Преобразуем массив коммитов в HTML-строки и вставляем в tbody
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
        // Если сеть упала или сервер вернул ошибку
        infoEl.innerHTML = `<p class="error">Ошибка загрузки: ${err.message}</p>`;
        loadingCommits.classList.add('hidden');
        console.error('Repo load error:', err);
    }
});