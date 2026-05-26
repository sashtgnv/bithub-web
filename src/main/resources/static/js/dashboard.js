
requireAuth();
initProfileLink();

// document.getElementById('token-display').textContent = localStorage.getItem('jwt_token') || 'не найден';

async function loadRepos() {
    try {
        const repos = await apiFetch('/proj/my');
        const box = document.getElementById('repo-list');
        if (!repos.length) {
            box.innerHTML = '<p class="meta">У вас пока нет репозиториев.</p>';
            return;
        }
        box.innerHTML = repos.map(r => `
                <div class="repo-card">
                    <h3><a href="repo.html?id=${r.id}">${r.name}</a></h3>
                    <p class="meta">${r.description || '—'} • ${r.isPublic ? '🌐 Публичный' : '🔒 Приватный'} • Создан: ${new Date(r.createdAt).toLocaleDateString()}</p>
                </div>
            `).join('');
    } catch(err) {
        document.getElementById('repo-list').innerHTML = `<p class="error">Ошибка: ${err.message}</p>`;
    }
}
loadRepos();