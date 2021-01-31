import BASE_URL from '../constants/constants';

class Api {
    constructor(options) {
        this._headers = options.headers; // Передаем заголовок
        this._baseUrl = options.baseUrl; // Передаем базовый URL
    }

    _sendRequest(link, params) {
        return fetch(link, params)
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }
                return Promise.reject(`Ошибка ${res.status} - ${res.statusText}`);
          });
    }

    // редактирование профиля
    editProfileInfo(user, token) {
        return this._sendRequest(`${this._baseUrl}/users/me`, {
            method: 'PATCH',
            headers: {authorization: `Bearer ${token}`, ...this._headers},
            body: JSON.stringify({
                name: user.name,
                about: user.about
            }),
        });
    }

    // запрос данных профиля
    getProfileInfo(token) {
        return this._sendRequest(`${this._baseUrl}/users/me`, {
            headers: {authorization: `Bearer ${token}`, ...this._headers},
        });
    }

    // редактирование аватара
    editAvatar(srcLink, token) {
        return this._sendRequest(`${this._baseUrl}/users/me/avatar`, {
            method: 'PATCH',
            headers: {authorization: `Bearer ${token}`, ...this._headers},
            body: JSON.stringify({
                avatar: srcLink
            }),
        });
    }

    // отправка данных о новой карточке
    createNewCard(cardInfo, token) {
        return this._sendRequest(`${this._baseUrl}/cards`, {
            method: 'POST',
            headers: {authorization: `Bearer ${token}`,...this._headers},
            body: JSON.stringify({
                name: cardInfo.name,
                link: cardInfo.link
            }),
        });
    }

    // удаление карточки
    deleteCard(cardId, token) {
        return this._sendRequest(`${this._baseUrl}/cards/${cardId}`, {
            method: 'DELETE',
            headers: {authorization: `Bearer ${token}`, ...this._headers},
        });
    }

    // ставим лайк
    changeLikeStatus(cardId, isLiked, token) {
        return this._sendRequest(`${this._baseUrl}/cards/${cardId}/likes`, {
            method: (isLiked ? 'PUT' : 'DELETE'),
            headers: {authorization: `Bearer ${token}`, ...this._headers},
        });
    }

    // запрос массива карточек
    getInitialCards(token) {
        return this._sendRequest(`${this._baseUrl}/cards`, {
            headers: {authorization: `Bearer ${token}`, ...this._headers},
        });
    }
}

const api = new Api({
    baseUrl: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
