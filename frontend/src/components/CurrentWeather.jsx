import { describeWeather, uvLabel } from '../weatherCodes.js';
import { useCountUp } from '../hooks.js';
import WeatherIcon from './WeatherIcon.jsx';
import {
  DropletIcon,
  WindIcon,
  GaugeIcon,
  RainCloudIcon,
  SunriseIcon,
  SunsetIcon,
  SunIcon,
  GlobeIcon,
  PinIcon,
  ClockIcon,
} from '../icons.jsx';

const toF = (c) => (c * 9) / 5 + 32;
const toMph = (kmh) => kmh * 0.621371;

function formatLocalTime(isoTime) {
  const d = new Date(isoTime);
  return d.toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function Stat({ icon, label, value, suffix }) {
  return (
    <div className="stat">
      <div className="stat-label">
        {icon}
        {label}
      </div>
      <div className="stat-value">
        {value}
        {suffix && <small>{suffix}</small>}
      </div>
    </div>
  );
}

export default function CurrentWeather({ data, unit, onUnitChange }) {
  const { location, current, units } = data;
  const { label } = describeWeather(current.weatherCode);

  const tempC = current.temperature;
  const shownTemp = useCountUp(Math.round(unit === 'F' ? toF(tempC) : tempC));
  const feels = Math.round(unit === 'F' ? toF(current.feelsLike) : current.feelsLike);
  const wind = Math.round(unit === 'F' ? toMph(current.windSpeed) : current.windSpeed);

  return (
    <section className="card reveal" style={{ animationDelay: '0.1s' }}>
      <div className="hero-top">
        <div>
          <h2 className="place-name">{location.name}</h2>
          <div className="place-meta">
            <span>
              <PinIcon size={14} />
              {location.latitude.toFixed(3)}, {location.longitude.toFixed(3)}
            </span>
            <span>
              <ClockIcon size={14} />
              {formatLocalTime(current.time)} local
            </span>
            <span>
              <GlobeIcon size={14} />
              {data.timezone}
            </span>
          </div>
        </div>
        <div className="seg" role="group" aria-label="Temperature unit">
          <span className={`seg-thumb ${unit === 'F' ? 'right' : ''}`} aria-hidden="true" />
          <button type="button" className={unit === 'C' ? 'on' : ''} onClick={() => onUnitChange('C')}>
            C
          </button>
          <button type="button" className={unit === 'F' ? 'on' : ''} onClick={() => onUnitChange('F')}>
            F
          </button>
        </div>
      </div>

      <div className="hero-main">
        <div className="temp-block">
          <div className="temp-value">
            {shownTemp}
            <sup>°{unit}</sup>
          </div>
          <div className="temp-cond">{label}</div>
          <div className="temp-feels">
            Feels like {feels}°{unit}
          </div>
        </div>
        <WeatherIcon className="hero-icon" code={current.weatherCode} isDay={current.isDay} size={150} />
      </div>

      <div className="stat-strip">
        <Stat icon={<DropletIcon size={14} />} label="Humidity" value={current.humidity} suffix="%" />
        <Stat
          icon={<WindIcon size={14} />}
          label="Wind"
          value={wind}
          suffix={unit === 'F' ? 'mph' : units.windSpeed}
        />
        <Stat icon={<GaugeIcon size={14} />} label="Pressure" value={Math.round(current.pressure)} suffix={units.pressure} />
        <Stat icon={<RainCloudIcon size={14} />} label="Precip" value={current.precipitation} suffix="mm" />
        <Stat icon={<SunriseIcon size={14} />} label="Sunrise" value={current.sunrise?.slice(11, 16) || '-'} />
        <Stat icon={<SunsetIcon size={14} />} label="Sunset" value={current.sunset?.slice(11, 16) || '-'} />
        <Stat
          icon={<SunIcon size={14} />}
          label="UV index"
          value={current.uvIndexMax ?? '-'}
          suffix={uvLabel(current.uvIndexMax)}
        />
      </div>
    </section>
  );
}
