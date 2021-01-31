import BASE_URL from '../constants/constants';

export const authorize = (email, password) => {
    return fetch(`${BASE_URL}/signin`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(res => {
        if (res.status === 400) {
            throw new Error('Не передано одно из полей')
        } else if (res.status === 401) {
            throw new Error('Неверные имя пользователя или пароль')
        } else
        return res.json()
    })
}

export const register = (email, password) => {
    return fetch(`${BASE_URL}/signup`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => {
        if (response.status === 400) throw new Error('Некорректно заполнено одно из полей')
        if (response.status === 409) throw new Error(`Пользователь ${email} уже зарегистрирован`)
        if (response.status === 500) throw new Error(`Внутрення ошибка на сервере`) 
        return response.json()
    })
    .then(res => res)
}
export const tokenCheck = (token) => {
    return fetch(`${BASE_URL}/users/me`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        }
    })
    .then(res => {
        if (res.status === 400) {
            throw new Error('Токен не передан или передан не в том формате')
        } else if (res.status === 401) {
            throw new Error('Передан некоррекный токен')
        } else
        return res.json()
    })
    .then(res => res)
}