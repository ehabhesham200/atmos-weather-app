import { Router } from 'express';
import mongoose from 'mongoose';
import { Record } from '../models/Record.js';
import { ApiError, asyncHandler } from '../utils/errors.js';
import { validateDateRange, validateLocationInput } from '../utils/validate.js';
import { resolveLocation } from '../services/geocode.js';
import { getTemperaturesForRange } from '../services/weather.js';
import { EXPORTERS } from '../utils/exporters.js';

export const recordsRouter = Router();

function loadRecord(id) {
  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, `Invalid record id: ${id}`);
  }
  return Record.findById(id).then((record) => {
    if (!record) throw new ApiError(404, `Record not found: ${id}`);
    return record;
  });
}

recordsRouter.post(
  '/',
  asyncHandler(async (req, res) => {
    const input = validateLocationInput(req.body.location);
    const { startDate, endDate } = validateDateRange(req.body.startDate, req.body.endDate);
    const { match, alternatives } = await resolveLocation(input);
    const temperatures = await getTemperaturesForRange(match.latitude, match.longitude, startDate, endDate);

    const record = await Record.create({
      rawLocationInput: input,
      resolvedName: match.name,
      latitude: match.latitude,
      longitude: match.longitude,
      country: match.country,
      timezone: match.timezone,
      startDate,
      endDate,
      temperatures,
      notes: typeof req.body.notes === 'string' ? req.body.notes.slice(0, 500) : '',
    });
    res.status(201).json({ record, alternatives });
  })
);

recordsRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    const records = await Record.find().sort({ createdAt: -1 }).limit(200);
    res.json({ records });
  })
);

recordsRouter.get(
  '/export',
  asyncHandler(async (req, res) => {
    const format = String(req.query.format || 'json').toLowerCase();
    const exporter = EXPORTERS[format];
    if (!exporter) {
      throw new ApiError(400, `Unsupported export format "${format}". Use one of: ${Object.keys(EXPORTERS).join(', ')}`);
    }
    const records = await Record.find().sort({ createdAt: -1 });
    res
      .set('Content-Type', `${exporter.contentType}; charset=utf-8`)
      .set('Content-Disposition', `attachment; filename="weather-records.${exporter.ext}"`)
      .send(exporter.fn(records));
  })
);

recordsRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    res.json({ record: await loadRecord(req.params.id) });
  })
);

recordsRouter.put(
  '/:id',
  asyncHandler(async (req, res) => {
    const record = await loadRecord(req.params.id);

    const nextLocation =
      req.body.location !== undefined ? validateLocationInput(req.body.location) : record.rawLocationInput;
    const { startDate, endDate } = validateDateRange(
      req.body.startDate !== undefined ? req.body.startDate : record.startDate,
      req.body.endDate !== undefined ? req.body.endDate : record.endDate
    );

    const locationChanged = nextLocation !== record.rawLocationInput;
    const datesChanged = startDate !== record.startDate || endDate !== record.endDate;

    if (locationChanged) {
      const { match } = await resolveLocation(nextLocation);
      record.rawLocationInput = nextLocation;
      record.resolvedName = match.name;
      record.latitude = match.latitude;
      record.longitude = match.longitude;
      record.country = match.country;
      record.timezone = match.timezone;
    }
    if (locationChanged || datesChanged) {
      record.startDate = startDate;
      record.endDate = endDate;
      record.temperatures = await getTemperaturesForRange(record.latitude, record.longitude, startDate, endDate);
    }
    if (typeof req.body.notes === 'string') {
      record.notes = req.body.notes.slice(0, 500);
    }

    await record.save();
    res.json({ record });
  })
);

recordsRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const record = await loadRecord(req.params.id);
    await record.deleteOne();
    res.json({ deleted: true, id: req.params.id });
  })
);
