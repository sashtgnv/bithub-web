document.addEventListener('DOMContentLoaded', () => {
    // Блокируем доступ без авторизации
    requireAuth();
    initProfileLink();

    const form = document.getElementById('create-repo-form');
    const errorEl = document.getElementById('form-error');
    const submitBtn = document.getElementById('submit-btn');

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Отменяем стандартную отправку формы
        errorEl.classList.add('hidden');

        // Блокируем кнопку на время запроса
        submitBtn.disabled = true;
        submitBtn.textContent = 'Создание...';

        // Собираем данные из полей
        const payload = {
            name: document.getElementById('repo-name').value.trim(),
            description: document.getElementById('repo-desc').value.trim(),
            isPublic: document.getElementById('repo-public').checked
        };

        try {
            // Отправляем POST запрос на бэкенд
            await apiFetch('/proj', { method: 'POST', body: JSON.stringify(payload) });

            // Успех: перенаправляем на дашборд
            window.location.href = 'dashboard.html';
        } catch (err) {
            // Ошибка: показываем сообщение и разблокируем кнопку
            errorEl.textContent = `Ошибка: ${err.message}`;
            errorEl.classList.remove('hidden');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Создать репозиторий';
        }
    });
});