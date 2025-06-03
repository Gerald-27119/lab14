# 1. Bazujemy na Node.js 18 (Debian)
FROM node:18-buster

# 2. Ustawiamy katalog roboczy
WORKDIR /usr/src/app

# 3. Kopiujemy pliki package.json / package-lock.json
COPY package*.json ./

# 4. Instalujemy wszystkie dependencies (w tym devDependencies, bo potrzebne do testów w kontenerze)
RUN npm ci

# 5. Kopiujemy resztę kodu aplikacji
COPY . .

# 6. Eksponujemy port 3000
EXPOSE 3000

# 7. Domyślny command
CMD ["npm", "start"]
