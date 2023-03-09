FROM node:lts-alpine as frontend

WORKDIR /build

COPY ./frontend ./frontend
RUN cd frontend && yarn install --frozen-lockfile && yarn build

FROM node:lts-alpine as backend

WORKDIR /build

COPY ./backend ./backend
RUN cd backend && yarn install --frozen-lockfile && yarn build

FROM node:lts-alpine as release

WORKDIR /app

# Install yarn
RUN yarn global add serve pm2

COPY --from=frontend /build/frontend/build ./frontend

COPY --from=backend /build/backend/dist ./backend/dist
COPY --from=backend /build/backend/package.json ./backend/package.json
COPY --from=backend /build/backend/yarn.lock ./backend/yarn.lock
COPY entrypoint.sh ./entrypoint.sh
RUN cd ./backend && yarn install --frozen-lockfile --production=true

CMD ["./entrypoint.sh"]