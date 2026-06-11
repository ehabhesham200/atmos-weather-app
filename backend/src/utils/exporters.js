function recordToPlain(r) {
  return {
    id: String(r._id),
    rawLocationInput: r.rawLocationInput,
    resolvedName: r.resolvedName,
    latitude: r.latitude,
    longitude: r.longitude,
    country: r.country || '',
    startDate: r.startDate,
    endDate: r.endDate,
    temperatureUnit: r.temperatureUnit,
    temperatures: r.temperatures.map((t) => ({
      date: t.date,
      tempMax: t.tempMax,
      tempMin: t.tempMin,
      tempMean: t.tempMean,
    })),
    notes: r.notes || '',
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
  };
}

export function toJSON(records) {
  return JSON.stringify(records.map(recordToPlain), null, 2);
}

function csvEscape(value) {
  const s = value === null || value === undefined ? '' : String(value);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function toCSV(records) {
  const header = [
    'record_id', 'location_input', 'resolved_name', 'latitude', 'longitude',
    'country', 'start_date', 'end_date', 'date', 'temp_max', 'temp_min',
    'temp_mean', 'unit', 'notes', 'created_at',
  ];
  const rows = [header.join(',')];
  for (const r of records.map(recordToPlain)) {
    const base = [r.id, r.rawLocationInput, r.resolvedName, r.latitude, r.longitude, r.country, r.startDate, r.endDate];
    for (const t of r.temperatures) {
      rows.push(
        [...base, t.date, t.tempMax, t.tempMin, t.tempMean, r.temperatureUnit, r.notes, new Date(r.createdAt).toISOString()]
          .map(csvEscape)
          .join(',')
      );
    }
  }
  return rows.join('\r\n');
}

function xmlEscape(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function toXML(records) {
  const lines = ['<?xml version="1.0" encoding="UTF-8"?>', '<weatherRecords>'];
  for (const r of records.map(recordToPlain)) {
    lines.push('  <record>');
    lines.push(`    <id>${xmlEscape(r.id)}</id>`);
    lines.push(`    <locationInput>${xmlEscape(r.rawLocationInput)}</locationInput>`);
    lines.push(`    <resolvedName>${xmlEscape(r.resolvedName)}</resolvedName>`);
    lines.push(`    <latitude>${r.latitude}</latitude>`);
    lines.push(`    <longitude>${r.longitude}</longitude>`);
    lines.push(`    <country>${xmlEscape(r.country)}</country>`);
    lines.push(`    <startDate>${r.startDate}</startDate>`);
    lines.push(`    <endDate>${r.endDate}</endDate>`);
    lines.push(`    <unit>${xmlEscape(r.temperatureUnit)}</unit>`);
    lines.push(`    <notes>${xmlEscape(r.notes)}</notes>`);
    lines.push('    <temperatures>');
    for (const t of r.temperatures) {
      lines.push(`      <day date="${t.date}" max="${t.tempMax}" min="${t.tempMin}" mean="${t.tempMean}" />`);
    }
    lines.push('    </temperatures>');
    lines.push('  </record>');
  }
  lines.push('</weatherRecords>');
  return lines.join('\n');
}

export function toMarkdown(records) {
  const out = ['# Weather Records Export', ''];
  for (const r of records.map(recordToPlain)) {
    out.push(`## ${r.resolvedName}`);
    out.push('');
    out.push(`- **Searched as:** ${r.rawLocationInput}`);
    out.push(`- **Coordinates:** ${r.latitude}, ${r.longitude}`);
    out.push(`- **Date range:** ${r.startDate} to ${r.endDate}`);
    if (r.notes) out.push(`- **Notes:** ${r.notes}`);
    out.push('');
    out.push(`| Date | Max (${r.temperatureUnit}) | Min (${r.temperatureUnit}) | Mean (${r.temperatureUnit}) |`);
    out.push('|------|------|------|------|');
    for (const t of r.temperatures) {
      out.push(`| ${t.date} | ${t.tempMax ?? '-'} | ${t.tempMin ?? '-'} | ${t.tempMean ?? '-'} |`);
    }
    out.push('');
  }
  return out.join('\n');
}

export const EXPORTERS = {
  json: { fn: toJSON, contentType: 'application/json', ext: 'json' },
  csv: { fn: toCSV, contentType: 'text/csv', ext: 'csv' },
  xml: { fn: toXML, contentType: 'application/xml', ext: 'xml' },
  markdown: { fn: toMarkdown, contentType: 'text/markdown', ext: 'md' },
};
