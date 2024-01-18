# 기반 이미지 설정
FROM node:latest

# 작업 디렉토리 설정
WORKDIR /app

# 크롬을 설치하기 위한 패키지 업데이트 및 설치
RUN apt-get update && apt-get install -y \ 
    chromium \ 
    ttf-freefont \
    udev \
    xvfb \
    x11vnc \
    fluxbox \
    dbus \
&& rm -rf /var/lib/apt/lists/*

# 앱 소스 코드를 현재 작업 디렉토리에 복사
COPY . .

# 앱 종속성 설치
RUN npm ci

EXPOSE 3000

# 컨테이너 실행 시 실행될 명령어
CMD ["npm", "start"]
