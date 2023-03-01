FROM node:alpine as build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --prod


FROM nginx:alpine as deploy
COPY --from=build /app/dist/skillquizwepapp /usr/share/nginx/html
