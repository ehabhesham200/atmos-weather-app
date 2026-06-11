# Hugging Face Spaces runs this container and routes traffic to port 7860.
FROM node:20

USER node
ENV HOME=/home/node
WORKDIR /home/node/app

COPY --chown=node frontend ./frontend
RUN cd frontend && npm ci && npm run build

COPY --chown=node backend ./backend
RUN cd backend && npm ci

ENV PORT=7860
EXPOSE 7860
CMD ["node", "backend/src/server.js"]
