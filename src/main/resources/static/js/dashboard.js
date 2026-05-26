requireAuth();
initProfileLink();

// Поиск репозиториев
let allRepos = [];

async function loadRepos() {
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
        const repos = await apiFetch('/proj/my');
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

// Фильтрация репозиториев
function filterRepos(searchTerm) {
    const filtered = allRepos.filter(repo => {
        const searchLower = searchTerm.toLowerCase();
        return repo.name.toLowerCase().includes(searchLower) ||
            (repo.description && repo.description.toLowerCase().includes(searchLower));
    });
    renderRepos(filtered);
}

// Инициализация поиска
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('repo-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterRepos(e.target.value);
        });
    }
});

loadRepos();