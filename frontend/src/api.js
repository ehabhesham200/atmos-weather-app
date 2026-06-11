async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(path, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw new Error('Cannot reach the weather server. Is the backend running on port 4000?');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed (HTTP ${res.status})`);
  }
  return data;
}

export const api = {
  getWeather: (location) => request(`/api/weather?location=${encodeURIComponent(location)}`),
  listRecords: () => request('/api/records'),
  createRecord: (body) => request('/api/records', { method: 'POST', body: JSON.stringify(body) }),
  updateRecord: (id, body) => request(`/api/records/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteRecord: (id) => request(`/api/records/${id}`, { method: 'DELETE' }),
  exportUrl: (format) => `/api/records/export?format=${format}`,
};
