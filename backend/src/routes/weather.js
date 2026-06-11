import { Router } from 'express';
import { asyncHandler } from '../utils/errors.js';
import { validateLocationInput } from '../utils/validate.js';
import { resolveLocation } from '../services/geocode.js';
import { getCurrentAndForecast } from '../services/weather.js';

export const weatherRouter = Router();

weatherRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const input = validateLocationInput(req.query.location);
    const { match, alternatives } = await resolveLocation(input);
    const weather = await getCurrentAndForecast(match.latitude, match.longitude);
    res.json({ location: match, alternatives, ...weather });
  })
);
