FROM node:alpine as build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --prod


FROM nginx:alpine as deploy
COPY --from=build /app /usr/share/nginx/html
