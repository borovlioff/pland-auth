# Указываем базовый образ
FROM node:14-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы проекта
COPY . .

# Компилируем TypeScript
RUN npm run build

# Указываем команду для запуска приложения
CMD ["node", "dist/main.js"]
