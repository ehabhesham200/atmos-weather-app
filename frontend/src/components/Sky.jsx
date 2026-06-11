import { useMemo } from 'react';

function seededRandoms(count, seed = 7) {
  let s = seed;
  const out = [];
  for (let i = 0; i < count; i++) {
    s = (s * 16807) % 2147483647;
    out.push(s / 2147483647);
  }
  return out;
}

function Particles({ theme }) {
  const drops = useMemo(() => {
    const r = seededRandoms(180, theme.length + 11);
    const make = (n, offset) =>
      Array.from({ length: n }, (_, i) => ({
        left: r[(i * 3 + offset) % r.length] * 100,
        delay: r[(i * 3 + 1 + offset) % r.length] * 6,
        duration: 0.7 + r[(i * 3 + 2 + offset) % r.length] * 0.8,
        scale: 0.6 + r[(i * 5 + offset) % r.length] * 0.8,
      }));
    if (theme === 'rain' || theme === 'storm') return { kind: 'rain', items: make(46, 0) };
    if (theme === 'snow') return { kind: 'snow', items: make(34, 2) };
    if (theme === 'clear-night') return { kind: 'stars', items: make(40, 4) };
    if (theme === 'cloudy' || theme === 'fog') return { kind: 'haze', items: make(4, 6) };
    return { kind: 'none', items: [] };
  }, [theme]);

  if (drops.kind === 'none') return null;

  return (
    <div className={`sky-particles sky-${drops.kind}`} aria-hidden="true">
      {drops.kind === 'rain' &&
        drops.items.map((d, i) => (
          <span
            key={i}
            className="p-rain"
            style={{
              left: `${d.left}%`,
              animationDelay: `${d.delay}s`,
              animationDuration: `${d.duration}s`,
              height: `${10 + d.scale * 14}px`,
            }}
          />
        ))}
      {drops.kind === 'snow' &&
        drops.items.map((d, i) => (
          <span
            key={i}
            className="p-snow"
            style={{
              left: `${d.left}%`,
              animationDelay: `${d.delay}s`,
              animationDuration: `${4 + d.scale * 5}s`,
              width: `${2 + d.scale * 3}px`,
              height: `${2 + d.scale * 3}px`,
            }}
          />
        ))}
      {drops.kind === 'stars' &&
        drops.items.map((d, i) => (
          <span
            key={i}
            className="p-star"
            style={{
              left: `${d.left}%`,
              top: `${(d.delay / 6) * 55}%`,
              animationDelay: `${d.delay}s`,
              width: `${1 + d.scale * 1.6}px`,
              height: `${1 + d.scale * 1.6}px`,
            }}
          />
        ))}
      {drops.kind === 'haze' &&
        drops.items.map((d, i) => (
          <span
            key={i}
            className="p-haze"
            style={{
              top: `${8 + i * 16}%`,
              animationDelay: `${i * -14}s`,
              animationDuration: `${60 + d.scale * 40}s`,
            }}
          />
        ))}
    </div>
  );
}

export default function Sky({ theme }) {
  return (
    <div className="sky" aria-hidden="true">
      <Particles theme={theme} />
    </div>
  );
}
