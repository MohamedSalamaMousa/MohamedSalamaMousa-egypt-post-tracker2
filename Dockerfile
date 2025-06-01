# استخدم صورة خفيفة من Node.js
FROM node:18-slim

# تثبيت المتطلبات اللازمة لتشغيل Puppeteer في بيئة خالية من الرأس (Headless)
RUN apt-get update && apt-get install -y \
    wget \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    --no-install-recommends && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# تحديد مجلد العمل داخل الحاوية
WORKDIR /app

# نسخ ملفات المشروع الأساسية
COPY package*.json ./

# منع تحميل Chromium تلقائيًا من Puppeteer (سنستخدم النسخة المثبتة على النظام)
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# تثبيت الحزم باستخدام npm install بدلًا من ci
RUN npm install

# نسخ باقي ملفات المشروع
COPY . .

# فتح المنفذ 3000
EXPOSE 3000

# الأمر الذي يتم تنفيذه لتشغيل التطبيق
CMD ["npm", "start"]
