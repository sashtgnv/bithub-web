// Редактирование профиля
document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('profileForm');
    const submitBtn = document.getElementById('submitBtn');
    const formMessage = document.getElementById('formMessage');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const fullNameInput = document.getElementById('fullName');
    const bioInput = document.getElementById('bio');

    // Загрузка текущих данных профиля
    try {
        const response = await fetch('/api/user/profile');
        if (!response.ok) {
            if (response.status === 401) {
                window.location.href = '/';
                return;
            }
            throw new Error('Ошибка загрузки профиля');
        }

        const user = await response.json();

        usernameInput.value = user.username || '';
        emailInput.value = user.email || '';
        fullNameInput.value = user.fullName || '';
        bioInput.value = user.bio || '';

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
                fullName: fullNameInput.value.trim(),
                bio: bioInput.value.trim()
            };

            const response = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Ошибка сохранения');
            }

            showFormMessage('Профиль успешно обновлен!', 'success');

            // Редирект через 1.5 секунды
            setTimeout(() => {
                window.location.href = '/profile';
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