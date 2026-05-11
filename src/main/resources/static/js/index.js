// Переключение форм
document.getElementById('toggle').onclick = () => {
    const login = document.getElementById('login-form');
    const reg = document.getElementById('reg-form');
    const btn = document.getElementById('toggle');
    if (login.style.display !== 'none') {
        login.style.display = 'none';
        reg.style.display = 'block';
        btn.textContent = 'Уже есть аккаунт? Войти';
    } else {
        login.style.display = 'block';
        reg.style.display = 'none';
        btn.textContent = 'Нет аккаунта? Регистрация';
    }
};

// // Обработка входа
document.getElementById('login-form').onsubmit = async (e) => {
    e.preventDefault();
    try {
        await login(document.getElementById('l-user').value, document.getElementById('l-pass').value);
    } catch (err) {
        showMsg(err.message, 'error');
    }
};

// Обработка регистрации
document.getElementById('reg-form').onsubmit = async (e) => {
    e.preventDefault();
    try {
        await register(document.getElementById('r-user').value, document.getElementById('r-email').value,
            document.getElementById('r-pass').value);
    } catch (err) {
        showMsg(err.message, 'error');
        console.log(err)
    }
};

function showMsg(text, type) {
    const el = document.getElementById('msg');
    el.textContent = text;
    el.className = type;
}