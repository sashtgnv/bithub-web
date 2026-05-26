// Переключение между формами входа и регистрации
document.getElementById('toggle-to-reg').addEventListener('click', function() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('reg-form').classList.remove('hidden');
    document.getElementById('msg').textContent = '';
    document.getElementById('msg').className = '';
});

document.getElementById('toggle-to-login').addEventListener('click', function() {
    document.getElementById('reg-form').classList.add('hidden');
    document.getElementById('login-form').classList.remove('hidden');
    document.getElementById('msg').textContent = '';
    document.getElementById('msg').className = '';
});

// Обработка входа
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