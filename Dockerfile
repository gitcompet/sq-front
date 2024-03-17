FROM node:alpine as build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build --prod


FROM nginx:1.25.4-alpine3.18 as deploy
COPY --from=build /app/dist/skillquizwepapp /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# When the container starts, replace the env.js with values from environment variables
CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/env.sample.js > /usr/share/nginx/html/assets/env.js && exec nginx -g 'daemon off;'"]
