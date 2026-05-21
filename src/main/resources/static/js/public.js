document.addEventListener('DOMContentLoaded', async () => {
    requireAuth();

    const listEl = document.getElementById('public-list');
    try {
        const repos = await apiFetch('/proj/public');
        if (!repos || repos.length === 0) {
            listEl.innerHTML = '<p class="meta">Публичных проектов пока нет.</p>';
            return;
        }
        // Создаём карточки и вставляем в DOM
        listEl.innerHTML = repos.map(repo => `
            <div class="repo-card">
                <h3><a href="repo.html?id=${repo.id}">${Utils.escapeHtml(repo.name)}</a></h3>
                <p class="meta">
                    ${Utils.escapeHtml(repo.description || 'Без описания')} • 
                    Владелец: ${Utils.escapeHtml(repo.owner?.username || '—')} • 
                    Создан: ${Utils.formatDate(repo.createdAt)}
                </p>
            </div>
        `).join('');
    } catch (err) {
        listEl.innerHTML = `<p class="error">Ошибка загрузки: ${err.message}</p>`;
    }
});