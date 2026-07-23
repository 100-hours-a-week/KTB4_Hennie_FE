# 컴파일 
FROM node:20.19.0-alpine AS build-stage

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

RUN npm run build

# 멀티 스테이지 빌드 - 최적화
FROM nginx:alpine AS final-stage

# Nginx 설정 파일
COPY nginx.conf /etc/nginx/conf.d/default.conf

# React 빌드 결과물
COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
