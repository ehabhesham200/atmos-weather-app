import 'dotenv/config';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import express from 'express';
import cors from 'cors';
import { connectDatabase } from './db.js';
import { weatherRouter } from './routes/weather.js';
import { recordsRouter } from './routes/records.js';
import { errorHandler } from './utils/errors.js';

const PORT = process.env.PORT || 4000;

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/weather', weatherRouter);
app.use('/api/records', recordsRouter);

// In production, serve the built frontend from the same server (single URL, no CORS).
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendDist = path.join(__dirname, '..', '..', 'frontend', 'dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get(/^\/(?!api\/).*/, (req, res) => res.sendFile(path.join(frontendDist, 'index.html')));
}

app.use((req, res) => res.status(404).json({ error: `Not found: ${req.method} ${req.path}` }));
app.use(errorHandler);

connectDatabase()
  .then(() => {
    app.listen(PORT, () => console.log(`Weather API listening on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  });
