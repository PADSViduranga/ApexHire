const TOKEN_KEY = 'apexhire_token';

export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken() {
    localStorage.removeItem(TOKEN_KEY);
}

export async function apiRequest(
    endpoint,
    options = {}
) {
    const token = getToken();

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(endpoint, {
        ...options,
        headers
    });

    let result;

    try {
        result = await response.json();
    } catch {
        result = {
            success: false,
            message:
                'The server returned an invalid response.'
        };
    }

    if (!response.ok) {
        throw new Error(
            result.message ||
            `Request failed with status ${response.status}.`
        );
    }

    return result;
}