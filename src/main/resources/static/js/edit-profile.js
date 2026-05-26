document.addEventListener('DOMContentLoaded', async () => {
    requireAuth();

    // Корректируем ссылку "Назад", чтобы она вела на профиль с правильным username
    const username = localStorage.getItem('current_username');
    document.getElementById('back-link').href = `profile.html?username=${encodeURIComponent(username)}`;
    document.getElementById('cancel-link').href = `profile.html?username=${encodeURIComponent(username)}`;

    const form = document.getElementById('profile-form');
    const submitBtn = document.getElementById('submit-btn');
    const errorEl = document.getElementById('form-error');

    // 1. Загружаем текущие данные профиля
    try {
        const data = await apiFetch('/user/profile');
        document.getElementById('username').value = data.username || '';
        document.getElementById('email').value = data.email || '';
        document.getElementById('aboutMe').value = data.aboutMe || '';
    } catch (err) {
        errorEl.textContent = `Ошибка загрузки: ${err.message}`;
        errorEl.classList.remove('hidden');
    }

    // 2. Обработка сохранения
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        submitBtn.disabled = true;
        submitBtn.textContent = 'Сохранение...';
        errorEl.classList.add('hidden');

        try {
            const payload = {
                aboutMe: document.getElementById('aboutMe').value
            };
            await apiFetch('/user/profile', {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            // Успех → редирект обратно в профиль
            window.location.href = `profile.html?username=${encodeURIComponent(username)}`;
        } catch (err) {
            errorEl.textContent = `Ошибка сохранения: ${err.message}`;
            errorEl.classList.remove('hidden');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Сохранить';
        }
    });
});