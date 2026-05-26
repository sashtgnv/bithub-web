document.addEventListener('DOMContentLoaded', () => {
    // Блокируем доступ без авторизации
    requireAuth();
    initProfileLink();

    const form = document.getElementById('create-repo-form');
    const errorEl = document.getElementById('form-error');
    const submitBtn = document.getElementById('submit-btn');
    const nameInput = document.getElementById('repo-name');
    const publicCheckbox = document.getElementById('repo-public');

    // Валидация имени репозитория в реальном времени
    nameInput.addEventListener('input', (e) => {
        const value = e.target.value;
        // Разрешаем только латиницу, цифры и дефисы
        const sanitized = value.replace(/[^a-zA-Z0-9-]/g, '');
        if (value !== sanitized) {
            e.target.value = sanitized;
        }

        // Показываем подсказку если имя слишком короткое
        const helpText = e.target.parentElement.querySelector('.help-text');
        if (sanitized.length > 0 && sanitized.length < 3) {
            helpText.textContent = 'Минимум 3 символа';
            helpText.style.color = '#e74c3c';
        } else {
            helpText.textContent = 'Используйте латинские буквы, цифры и дефисы';
            helpText.style.color = '#666';
        }
    });

    // Обновление текста при переключении видимости
    publicCheckbox.addEventListener('change', (e) => {
        const toggleInfo = e.target.parentElement.querySelector('.toggle-info');
        if (e.target.checked) {
            toggleInfo.innerHTML = `
                <strong>Публичный репозиторий</strong>
                <span class="help-text-inline">Доступен всем пользователям</span>
            `;
        } else {
            toggleInfo.innerHTML = `
                <strong>Приватный репозиторий</strong>
                <span class="help-text-inline">Виден только вам</span>
            `;
        }
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); // Отменяем стандартную отправку формы
        errorEl.classList.add('hidden');

        // Валидация перед отправкой
        const name = nameInput.value.trim();
        if (name.length < 3) {
            errorEl.textContent = 'Название должно содержать минимум 3 символа';
            errorEl.classList.remove('hidden');
            nameInput.focus();
            return;
        }

        // Блокируем кнопку на время запроса
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Создание...';

        // Собираем данные из полей
        const payload = {
            name: name,
            description: document.getElementById('repo-desc').value.trim(),
            isPublic: publicCheckbox.checked
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
            submitBtn.innerHTML = '<i class="fas fa-plus-circle"></i> Создать репозиторий';
        }
    });

    // Автофокус на поле имени при загрузке
    nameInput.focus();
});