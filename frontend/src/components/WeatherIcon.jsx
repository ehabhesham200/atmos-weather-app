import { iconKind } from '../weatherCodes.js';

const CloudShape = ({ tone = 'front', dy = 0 }) => (
  <g className={`wi-cloud wi-cloud-${tone}`} transform={`translate(0 ${dy})`}>
    <circle cx="24" cy="36" r="10" />
    <circle cx="35" cy="30" r="12.5" />
    <circle cx="45" cy="37" r="8.5" />
    <rect x="22" y="33" width="32" height="12.5" rx="6.2" />
  </g>
);

const Sun = ({ small = false }) => (
  <g className="wi-sun" transform={small ? 'translate(14 -8) scale(0.62)' : undefined}>
    <g className="wi-sun-rays">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <line key={a} x1="32" y1="7" x2="32" y2="13" transform={`rotate(${a} 32 32)`} />
      ))}
    </g>
    <circle className="wi-sun-core" cx="32" cy="32" r="12" />
  </g>
);

const Moon = ({ small = false }) => (
  <g className="wi-moon" transform={small ? 'translate(16 -6) scale(0.6)' : undefined}>
    <path d="M39 12a20 20 0 1 0 13 28.5A16.5 16.5 0 0 1 39 12z" />
    <circle className="wi-star s1" cx="50" cy="14" r="1.6" />
    <circle className="wi-star s2" cx="56" cy="24" r="1.2" />
  </g>
);

const Drops = ({ heavy = false }) => (
  <g className="wi-drops">
    {[24, 33, 42].map((x, i) => (
      <line
        key={x}
        className={`wi-drop d${i + 1}`}
        x1={x}
        y1="48"
        x2={x - 2.5}
        y2={heavy ? 56 : 53}
      />
    ))}
  </g>
);

const Flakes = () => (
  <g className="wi-flakes">
    {[24, 33, 42].map((x, i) => (
      <circle key={x} className={`wi-flake f${i + 1}`} cx={x} cy="50" r="2.4" />
    ))}
  </g>
);

const Bolt = () => (
  <polygon className="wi-bolt" points="35,42 27,54 33,54 30,63 41,49 35,49 39,42" />
);

const FogLines = () => (
  <g className="wi-fog-lines">
    <line className="wi-fog-line l1" x1="16" y1="50" x2="46" y2="50" />
    <line className="wi-fog-line l2" x1="22" y1="56" x2="52" y2="56" />
  </g>
);

export default function WeatherIcon({ code, isDay = true, size = 56, className = '' }) {
  const kind = iconKind(code, isDay);
  return (
    <svg
      className={`wi wi-${kind} ${className}`}
      width={size}
      height={size}
      viewBox="0 0 64 64"
      role="img"
      aria-hidden="true"
      overflow="visible"
    >
      {kind === 'sun' && <Sun />}
      {kind === 'moon' && <Moon />}
      {kind === 'partly-day' && (
        <>
          <Sun small />
          <CloudShape />
        </>
      )}
      {kind === 'partly-night' && (
        <>
          <Moon small />
          <CloudShape />
        </>
      )}
      {kind === 'cloud' && (
        <>
          <CloudShape tone="back" dy={-4} />
          <CloudShape />
        </>
      )}
      {kind === 'fog' && (
        <>
          <CloudShape dy={-6} />
          <FogLines />
        </>
      )}
      {kind === 'drizzle' && (
        <>
          <CloudShape dy={-2} />
          <Drops />
        </>
      )}
      {kind === 'rain' && (
        <>
          <CloudShape dy={-2} />
          <Drops heavy />
        </>
      )}
      {kind === 'sleet' && (
        <>
          <CloudShape dy={-2} />
          <g className="wi-drops">
            <line className="wi-drop d1" x1="25" y1="48" x2="22.5" y2="53" />
          </g>
          <g className="wi-flakes">
            <circle className="wi-flake f2" cx="38" cy="50" r="2.4" />
          </g>
        </>
      )}
      {kind === 'snow' && (
        <>
          <CloudShape dy={-2} />
          <Flakes />
        </>
      )}
      {kind === 'storm' && (
        <>
          <CloudShape tone="dark" dy={-4} />
          <Bolt />
        </>
      )}
    </svg>
  );
}
