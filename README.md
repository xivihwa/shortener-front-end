# URL Shortener

Цей проєкт містить два компоненти:

- **Frontend:** React-додаток, розташований у репозиторії.
- **Backend:** Сервер, що працює в Docker-контейнері.

## Запуск проєкту

### Загальні вимоги

Для запуску обох компонентів проєкту необхідно:
- Встановлений `Docker` для backend.
- `Node.js` та `npm` для frontend.

### Backend

1. Перейдіть до директорії `app`:
   ```bash
   cd shortener-front-end/app
   ```
2. Побудуйте Docker-образ і запустіть контейнер:
   ```bash
   docker build -t localhost/shortener -f Dockerfile .
   docker run --rm -it -p 8000:8000 localhost/shortener
   ```

Відкрийте сторінку [http://localhost:8000](http://localhost:8000) у своєму браузері.
На головній сторінці доступні посилання на API документацію:

- [Swagger UI](http://localhost:8000/docs) — інтерактивна документація API.
- [Документація у форматі ReDoc](http://localhost:8000/redoc).
- [Схема у форматі OpenAPI](http://localhost:8000/openapi.json).

> **Примітка:** Проєкт зберігає всі дані у пам'яті, тому після перезапуску дані будуть втрачені. Проєкт містить заздалегідь створених трьох користувачів: `user_1`, `user_2`, `user_3` з паролем `12345678`.

### Frontend

1. Перейдіть до директорії `client`:
   ```bash
   cd shortener-front-end/client
   ```
2. Встановіть залежності:
   ```bash
   npm install
   ```
3. Запустіть React-додаток:
   ```bash
   npm start
   ```

Відкрийте сторінку [http://localhost:3000](http://localhost:3000) у браузері, щоб взаємодіяти з додатком.
