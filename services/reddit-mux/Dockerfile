FROM node:22-bookworm-slim

ENV NODE_ENV=production
ENV PORT=8788

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev --no-audit --no-fund

COPY lib.mjs server.mjs ./

USER node

EXPOSE 8788

CMD ["node", "server.mjs"]
