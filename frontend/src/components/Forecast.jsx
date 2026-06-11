import { describeWeather, travelerHints } from '../weatherCodes.js';
import WeatherIcon from './WeatherIcon.jsx';
import {
  RainCloudIcon,
  AlertIcon,
  UmbrellaIcon,
  SnowflakeIcon,
  SunIcon,
  ThermometerIcon,
  WindIcon,
} from '../icons.jsx';

const toF = (c) => (c * 9) / 5 + 32;

const HINT_ICONS = {
  alert: AlertIcon,
  umbrella: UmbrellaIcon,
  snowflake: SnowflakeIcon,
  sun: SunIcon,
  thermometer: ThermometerIcon,
  wind: WindIcon,
};

export default function Forecast({ days, unit }) {
  const show = (c) => (c === null || c === undefined ? '-' : Math.round(unit === 'F' ? toF(c) : c));

  const allTemps = days.flatMap((d) => [d.tempMin, d.tempMax]).filter((t) => t !== null && t !== undefined);
  const weekMin = Math.min(...allTemps);
  const weekMax = Math.max(...allTemps);
  const span = Math.max(1, weekMax - weekMin);

  const hints = travelerHints
    ? [...new Map(days.flatMap((d) => travelerHints(d)).map((h) => [h.text, h])).values()]
    : [];

  return (
    <section className="card reveal" style={{ animationDelay: '0.2s' }}>
      <h3 className="card-title">
        <RainCloudIcon size={15} />
        Five day forecast
      </h3>
      <div className="forecast-grid">
        {days.map((d, i) => {
          const { label } = describeWeather(d.weatherCode);
          const date = new Date(`${d.date}T00:00:00`);
          const left = d.tempMin == null ? 0 : ((d.tempMin - weekMin) / span) * 100;
          const right = d.tempMax == null ? 0 : 100 - ((d.tempMax - weekMin) / span) * 100;
          return (
            <article className="day-card reveal" style={{ animationDelay: `${0.25 + i * 0.07}s` }} key={d.date}>
              <div className="day-name">{date.toLocaleDateString(undefined, { weekday: 'short' })}</div>
              <div className="day-date">{date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</div>
              <WeatherIcon code={d.weatherCode} isDay size={54} />
              <div className="day-cond">{label}</div>
              <div className="day-temps">
                <span className="hi">{show(d.tempMax)}°</span>
                <span className="lo">{show(d.tempMin)}°</span>
              </div>
              <div className="range-track" aria-hidden="true">
                <span className="range-fill" style={{ left: `${left}%`, right: `${right}%` }} />
              </div>
              <div className="day-rain">
                <RainCloudIcon size={13} />
                {d.precipitationChance ?? 0}%
              </div>
            </article>
          );
        })}
      </div>

      {hints.length > 0 && (
        <div className="tips">
          {hints.map((h) => {
            const HintIcon = HINT_ICONS[h.icon] || AlertIcon;
            return (
              <div className="tip" key={h.text}>
                <HintIcon size={16} />
                {h.text}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
