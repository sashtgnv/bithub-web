const API_BASE = 'http://localhost:8080/api';

async function apiFetch(endpoint, options = {}) {
    const token = localStorage.getItem('jwt_token');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers
    });

    // console.log(response.status);

    if (!response.ok) {
        // Безопасный парсинг ошибки (иногда сервер возвращает HTML или пустой body)
        const err = await response.json().catch(() => (
            {message: response.statusText}
        ));
        throw new Error(err.message || `HTTP ${response.status}`);
    }

    // Если сервер вернул пустой ответ (204), не вызываем .json()
    if (response.status === 204) return null;
    return response.json();
}
