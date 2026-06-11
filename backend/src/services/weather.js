import { ApiError } from '../utils/errors.js';
import { todayISO } from '../utils/validate.js';

async function fetchJson(url) {
  let res;
  try {
    res = await fetch(url, { signal: AbortSignal.timeout(10000) });
  } catch (err) {
    throw new ApiError(502, 'Weather service is unreachable. Please try again.', String(err));
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(502, `Weather service error: ${data.reason || `HTTP ${res.status}`}`);
  }
  return data;
}

export async function getCurrentAndForecast(latitude, longitude) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: [
      'temperature_2m',
      'apparent_temperature',
      'relative_humidity_2m',
      'weather_code',
      'wind_speed_10m',
      'wind_direction_10m',
      'surface_pressure',
      'is_day',
      'precipitation',
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_probability_max',
      'sunrise',
      'sunset',
      'uv_index_max',
      'wind_speed_10m_max',
    ].join(','),
    timezone: 'auto',
    forecast_days: '6',
  });
  const data = await fetchJson(`https://api.open-meteo.com/v1/forecast?${params}`);

  const c = data.current;
  const d = data.daily;
  return {
    timezone: data.timezone,
    utcOffsetSeconds: data.utc_offset_seconds,
    current: {
      time: c.time,
      temperature: c.temperature_2m,
      feelsLike: c.apparent_temperature,
      humidity: c.relative_humidity_2m,
      weatherCode: c.weather_code,
      windSpeed: c.wind_speed_10m,
      windDirection: c.wind_direction_10m,
      pressure: c.surface_pressure,
      isDay: c.is_day === 1,
      precipitation: c.precipitation,
      sunrise: d.sunrise[0],
      sunset: d.sunset[0],
      uvIndexMax: d.uv_index_max[0],
    },
    forecast: d.time.slice(1, 6).map((date, i) => ({
      date,
      weatherCode: d.weather_code[i + 1],
      tempMax: d.temperature_2m_max[i + 1],
      tempMin: d.temperature_2m_min[i + 1],
      precipitationChance: d.precipitation_probability_max[i + 1],
      windSpeedMax: d.wind_speed_10m_max[i + 1],
      uvIndexMax: d.uv_index_max[i + 1],
    })),
    units: {
      temperature: data.current_units?.temperature_2m || '°C',
      windSpeed: data.current_units?.wind_speed_10m || 'km/h',
      pressure: data.current_units?.surface_pressure || 'hPa',
    },
  };
}

function mapDaily(data) {
  const d = data?.daily;
  if (!d?.time) return [];
  return d.time.map((date, i) => ({
    date,
    tempMax: d.temperature_2m_max?.[i] ?? null,
    tempMin: d.temperature_2m_min?.[i] ?? null,
    tempMean: d.temperature_2m_mean?.[i] ?? null,
  }));
}

const DAILY_TEMPS = 'temperature_2m_max,temperature_2m_min,temperature_2m_mean';

export async function getTemperaturesForRange(latitude, longitude, startDate, endDate) {
  const archiveCutoff = new Date(Date.now() - 6 * 86400000).toISOString().slice(0, 10);
  const results = [];

  if (startDate < archiveCutoff) {
    const archiveEnd = endDate < archiveCutoff ? endDate : archiveCutoff;
    const params = new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude),
      start_date: startDate,
      end_date: archiveEnd,
      daily: DAILY_TEMPS,
      timezone: 'auto',
    });
    results.push(...mapDaily(await fetchJson(`https://archive-api.open-meteo.com/v1/archive?${params}`)));
  }

  if (endDate >= archiveCutoff) {
    const forecastStart = startDate > archiveCutoff ? startDate : archiveCutoff;
    const params = new URLSearchParams({
      latitude: String(latitude),
      longitude: String(longitude),
      start_date: forecastStart,
      end_date: endDate,
      daily: DAILY_TEMPS,
      timezone: 'auto',
    });
    results.push(...mapDaily(await fetchJson(`https://api.open-meteo.com/v1/forecast?${params}`)));
  }

  const seen = new Set();
  const merged = results.filter((r) => {
    if (seen.has(r.date) || r.date < startDate || r.date > endDate) return false;
    seen.add(r.date);
    return true;
  });
  const usable = merged.filter((r) => r.tempMax !== null || r.tempMin !== null || r.tempMean !== null);
  if (usable.length === 0) {
    throw new ApiError(502, 'No temperature data available for that location and date range.');
  }
  return usable;
}

export { todayISO };
