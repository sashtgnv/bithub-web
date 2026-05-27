// Редактирование профиля
document.addEventListener('DOMContentLoaded', async () => {
    initProfileLink();

    // Корректируем ссылку "Назад", чтобы она вела на профиль с правильным username
    const username = localStorage.getItem('current_username');
    // document.getElementById('back-link').href = `profile.html?username=${encodeURIComponent(username)}`;
    document.getElementById('cancel-link').href = `profile.html?username=${encodeURIComponent(username)}`;

    const form = document.getElementById('profile-form');
    const submitBtn = document.getElementById('submit-btn');

    // Загрузка текущих данных профиля
    try {
        const response = await apiFetch('/user/profile');

        document.getElementById('username').value = response.username || '';
        document.getElementById('email').value = response.email || '';
        document.getElementById('aboutMe').value = response.aboutMe || '';

    } catch (err) {
        showFormMessage(`Ошибка загрузки: ${err.message}`, 'error');
        submitBtn.disabled = true;
    }

    // Обработка сохранения
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Сохранение...';
        hideFormMessage();

        try {
            const payload = {
                aboutMe: document.getElementById('aboutMe').value
            };
            const response = await apiFetch('/user/profile', {
                method: 'POST',
                body: JSON.stringify(payload)
            });
            if (response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Ошибка сохранения');
            }

            showFormMessage('Профиль успешно обновлен!', 'success');

            // Редирект через 1.5 секунды
            setTimeout(() => {
                window.location.href = `profile.html?username=${encodeURIComponent(username)}`;
            }, 1500);

        } catch (err) {
            showFormMessage(`Ошибка сохранения: ${err.message}`, 'error');
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-save"></i> Сохранить изменения';
        }
    });
});

// Показать сообщение
function showFormMessage(text, type) {
    const formMessage = document.getElementById('formMessage');
    formMessage.textContent = text;
    formMessage.className = `form-message form-message-${type}`;
    formMessage.classList.remove('hidden');
}

// Скрыть сообщение
function hideFormMessage() {
    const formMessage = document.getElementById('formMessage');
    formMessage.classList.add('hidden');
}