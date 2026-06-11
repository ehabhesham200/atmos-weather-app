import { ApiError } from './errors.js';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const MAX_RANGE_DAYS = 31;
const MAX_FORECAST_DAYS_AHEAD = 14;
const MIN_DATE = '1940-01-01';

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function parseISODate(value, label) {
  if (typeof value !== 'string' || !DATE_RE.test(value)) {
    throw new ApiError(400, `${label} must be a date in YYYY-MM-DD format`);
  }
  const d = new Date(`${value}T00:00:00Z`);
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== value) {
    throw new ApiError(400, `${label} is not a real calendar date: ${value}`);
  }
  return d;
}

export function validateDateRange(startDate, endDate) {
  const start = parseISODate(startDate, 'startDate');
  const end = parseISODate(endDate, 'endDate');

  if (start > end) {
    throw new ApiError(400, 'startDate must be on or before endDate');
  }
  const rangeDays = (end - start) / 86400000 + 1;
  if (rangeDays > MAX_RANGE_DAYS) {
    throw new ApiError(400, `Date range too large: max ${MAX_RANGE_DAYS} days, got ${rangeDays}`);
  }
  if (startDate < MIN_DATE) {
    throw new ApiError(400, `startDate cannot be before ${MIN_DATE} (no historical data available)`);
  }
  const maxFuture = new Date(Date.now() + MAX_FORECAST_DAYS_AHEAD * 86400000)
    .toISOString()
    .slice(0, 10);
  if (endDate > maxFuture) {
    throw new ApiError(
      400,
      `endDate cannot be more than ${MAX_FORECAST_DAYS_AHEAD} days in the future (forecast limit). Latest allowed: ${maxFuture}`
    );
  }
  return { startDate, endDate };
}

export function validateLocationInput(location) {
  if (typeof location !== 'string' || !location.trim()) {
    throw new ApiError(400, 'location is required (city, zip/postal code, landmark, or "lat,lon" coordinates)');
  }
  if (location.trim().length > 200) {
    throw new ApiError(400, 'location is too long (max 200 characters)');
  }
  return location.trim();
}
