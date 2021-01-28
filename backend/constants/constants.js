// регулярное выражение для валидации URL
const urlPattern = new RegExp('^(https?:\\/\\/)?(www\\.)?' // протокол
    + '(([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}' // доменное имя
    + '(\\/[a-z0-9#$:!@[]();&%_.~+=-?]*)*', 'i'); // путь
module.exports = urlPattern;

// регулярное выражение для валидации email
const emailPattern = new RegExp('[a-z0-9!#$%&\'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&\'*+/=?^_\\`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?', 'i');
module.exports = emailPattern;
