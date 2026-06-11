import { ApiError } from '../utils/errors.js';

const NOMINATIM_HEADERS = {
  'User-Agent': 'weather-app-tech-assessment/1.0 (PM Accelerator intern assessment)',
};

const COORD_RE = /^\s*(-?\d{1,3}(?:\.\d+)?)\s*,\s*(-?\d{1,3}(?:\.\d+)?)\s*$/;

async function fetchJson(url, { headers } = {}) {
  let res;
  try {
    res = await fetch(url, { headers, signal: AbortSignal.timeout(10000) });
  } catch (err) {
    throw new ApiError(502, 'Geocoding service is unreachable. Please try again.', String(err));
  }
  if (!res.ok) {
    throw new ApiError(502, `Geocoding service returned an error (HTTP ${res.status})`);
  }
  return res.json();
}

async function searchOpenMeteo(query) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`;
  const data = await fetchJson(url);
  return (data.results || []).map((r) => ({
    name: [r.name, r.admin1, r.country].filter(Boolean).join(', '),
    latitude: r.latitude,
    longitude: r.longitude,
    country: r.country || '',
    timezone: r.timezone || 'auto',
    source: 'open-meteo',
  }));
}

async function searchNominatim(query) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=jsonv2&limit=5&addressdetails=1`;
  const data = await fetchJson(url, { headers: NOMINATIM_HEADERS });
  return (data || []).map((r) => ({
    name: r.display_name,
    latitude: Number(r.lat),
    longitude: Number(r.lon),
    country: r.address?.country || '',
    timezone: 'auto',
    source: 'nominatim',
  }));
}

async function reverseNominatim(lat, lon) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=jsonv2&zoom=10`;
    const data = await fetchJson(url, { headers: NOMINATIM_HEADERS });
    if (data?.display_name) {
      return { name: data.display_name, country: data.address?.country || '' };
    }
  } catch {}
  return { name: `${lat.toFixed(4)}, ${lon.toFixed(4)}`, country: '' };
}

export async function resolveLocation(input) {
  const coordMatch = input.match(COORD_RE);
  if (coordMatch) {
    const lat = Number(coordMatch[1]);
    const lon = Number(coordMatch[2]);
    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      throw new ApiError(400, 'Coordinates out of range: latitude must be -90..90 and longitude -180..180');
    }
    const place = await reverseNominatim(lat, lon);
    return {
      match: { name: place.name, latitude: lat, longitude: lon, country: place.country, timezone: 'auto', source: 'coordinates' },
      alternatives: [],
    };
  }

  let results = await searchOpenMeteo(input);
  if (results.length === 0) {
    results = await searchNominatim(input);
  }
  if (results.length === 0) {
    throw new ApiError(404, `Location not found: "${input}". Try a city name, zip/postal code, landmark, or "lat,lon" coordinates.`);
  }
  return { match: results[0], alternatives: results.slice(1) };
}
