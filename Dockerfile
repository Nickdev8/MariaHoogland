# syntax=docker/dockerfile:1.7

FROM node:20-bookworm AS builder
WORKDIR /work
ENV NPM_CONFIG_PRODUCTION=false
ENV NPM_CONFIG_OMIT=
COPY app/package*.json ./
RUN npm ci --include=dev --production=false
COPY app/ ./
RUN npm run build

FROM node:20-bookworm AS runtime
RUN useradd -r -s /usr/sbin/nologin nodeuser
WORKDIR /app
COPY app/package*.json ./
RUN npm ci --omit=dev
COPY app/defaults.json ./defaults.json
COPY --from=builder /work/build ./build
RUN chown nodeuser:nodeuser defaults.json && chown -R nodeuser:nodeuser build
USER nodeuser
ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000
CMD ["node", "build"]
