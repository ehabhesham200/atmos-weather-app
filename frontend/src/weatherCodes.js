const GROUPS = [
  { codes: [0, 1], label: ['Clear sky', 'Mainly clear'], kind: 'clear', theme: 'clear' },
  { codes: [2], label: ['Partly cloudy'], kind: 'partly', theme: 'cloudy' },
  { codes: [3], label: ['Overcast'], kind: 'cloud', theme: 'cloudy' },
  { codes: [45, 48], label: ['Fog', 'Rime fog'], kind: 'fog', theme: 'fog' },
  { codes: [51, 53, 55], label: ['Light drizzle', 'Drizzle', 'Dense drizzle'], kind: 'drizzle', theme: 'rain' },
  { codes: [56, 57], label: ['Freezing drizzle', 'Dense freezing drizzle'], kind: 'sleet', theme: 'rain' },
  { codes: [61, 63, 65], label: ['Light rain', 'Rain', 'Heavy rain'], kind: 'rain', theme: 'rain' },
  { codes: [66, 67], label: ['Freezing rain', 'Heavy freezing rain'], kind: 'sleet', theme: 'rain' },
  { codes: [71, 73, 75], label: ['Light snow', 'Snow', 'Heavy snow'], kind: 'snow', theme: 'snow' },
  { codes: [77], label: ['Snow grains'], kind: 'snow', theme: 'snow' },
  { codes: [80, 81, 82], label: ['Light showers', 'Showers', 'Violent showers'], kind: 'rain', theme: 'rain' },
  { codes: [85, 86], label: ['Snow showers', 'Heavy snow showers'], kind: 'snow', theme: 'snow' },
  { codes: [95], label: ['Thunderstorm'], kind: 'storm', theme: 'storm' },
  { codes: [96, 99], label: ['Thunderstorm with hail', 'Severe thunderstorm'], kind: 'storm', theme: 'storm' },
];

function findGroup(code) {
  return GROUPS.find((g) => g.codes.includes(code));
}

export function describeWeather(code) {
  const g = findGroup(code);
  if (!g) return { label: 'Unknown conditions' };
  const i = g.codes.indexOf(code);
  return { label: g.label[i] || g.label[0] };
}

export function iconKind(code, isDay = true) {
  const g = findGroup(code);
  if (!g) return isDay ? 'sun' : 'moon';
  if (g.kind === 'clear') return isDay ? 'sun' : 'moon';
  if (g.kind === 'partly') return isDay ? 'partly-day' : 'partly-night';
  return g.kind;
}

export function themeFor(code, isDay = true) {
  const g = findGroup(code);
  const theme = g ? g.theme : 'clear';
  if (theme === 'clear') return isDay ? 'clear-day' : 'clear-night';
  return theme;
}

export function travelerHints({ weatherCode, tempMax, tempMin, uvIndexMax, windSpeedMax, precipitationChance }) {
  const hints = [];
  if ([95, 96, 99].includes(weatherCode)) {
    hints.push({ icon: 'alert', text: 'Thunderstorms expected. Check for flight and travel delays.' });
  }
  if ((precipitationChance ?? 0) >= 50 || [61, 63, 65, 80, 81, 82].includes(weatherCode)) {
    hints.push({ icon: 'umbrella', text: 'Rain likely. Pack an umbrella or a rain jacket.' });
  }
  if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
    hints.push({ icon: 'snowflake', text: 'Snow expected. Bring warm layers and waterproof shoes.' });
  }
  if ((uvIndexMax ?? 0) >= 8) {
    hints.push({ icon: 'sun', text: 'Very high UV. Sunscreen and sunglasses recommended.' });
  }
  if ((tempMax ?? 0) >= 35) {
    hints.push({ icon: 'thermometer', text: 'Extreme heat. Stay hydrated and plan indoor breaks.' });
  }
  if ((tempMin ?? 99) <= 0) {
    hints.push({ icon: 'snowflake', text: 'Freezing temperatures. Roads and sidewalks may be icy.' });
  }
  if ((windSpeedMax ?? 0) >= 50) {
    hints.push({ icon: 'wind', text: 'Strong winds. Outdoor plans may be affected.' });
  }
  return hints;
}

export function uvLabel(v) {
  if (v == null) return '';
  if (v < 3) return 'Low';
  if (v < 6) return 'Moderate';
  if (v < 8) return 'High';
  if (v < 11) return 'Very high';
  return 'Extreme';
}
