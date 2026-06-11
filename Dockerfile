# Hugging Face Spaces runs this container and routes traffic to port 7860.
FROM node:20

RUN useradd -m -u 1000 user
USER user
ENV HOME=/home/user
WORKDIR /home/user/app

COPY --chown=user frontend ./frontend
RUN cd frontend && npm ci && npm run build

COPY --chown=user backend ./backend
RUN cd backend && npm ci

ENV PORT=7860
EXPOSE 7860
CMD ["node", "backend/src/server.js"]
