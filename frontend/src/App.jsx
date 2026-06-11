import { useState } from 'react';
import { api } from './api.js';
import { themeFor } from './weatherCodes.js';
import Sky from './components/Sky.jsx';
import SearchBar from './components/SearchBar.jsx';
import CurrentWeather from './components/CurrentWeather.jsx';
import Forecast from './components/Forecast.jsx';
import MapView from './components/MapView.jsx';
import RecordsPanel from './components/RecordsPanel.jsx';
import InfoModal from './components/InfoModal.jsx';
import { InfoIcon, AlertIcon, CloseIcon } from './icons.jsx';

function BrandMark() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="10" cy="10" r="4.2" />
      <path d="M10 2.8v1.6M10 15.6v1.6M2.8 10h1.6M15.6 10h1.6M4.9 4.9l1.2 1.2M14 14l1 1" />
      <path d="M13.5 21h6.2a3 3 0 0 0 .4-6 4.6 4.6 0 0 0-8.2-2.5" fill="rgba(255,255,255,0.06)" />
    </svg>
  );
}

function HeroSkeleton() {
  return (
    <div className="hero-grid">
      <section className="card">
        <div className="skeleton sk-line" style={{ width: '40%' }} />
        <div className="skeleton sk-line" style={{ width: '60%' }} />
        <div className="skeleton sk-temp" />
        <div className="stat-strip">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="skeleton sk-block" />
          ))}
        </div>
      </section>
      <section className="card">
        <div className="skeleton sk-line" style={{ width: '30%' }} />
        <div className="skeleton" style={{ height: 260, marginTop: 12 }} />
      </section>
    </div>
  );
}

export default function App() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [unit, setUnit] = useState('C');
  const [showInfo, setShowInfo] = useState(false);

  async function search(location) {
    setLoading(true);
    setError('');
    try {
      setWeather(await api.getWeather(location));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser. Enter a location manually instead.');
      return;
    }
    setLoading(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => search(`${pos.coords.latitude.toFixed(4)},${pos.coords.longitude.toFixed(4)}`),
      (err) => {
        setLoading(false);
        setError(
          err.code === err.PERMISSION_DENIED
            ? 'Location permission denied. You can still search by city, zip, landmark, or coordinates.'
            : `Could not determine your location (${err.message}). Enter one manually instead.`
        );
      },
      { timeout: 10000 }
    );
  }

  const theme = weather ? themeFor(weather.current.weatherCode, weather.current.isDay) : 'clear-night';

  return (
    <div className={`shell theme-${theme}`}>
      <Sky theme={theme} />
      <div className="app">
        <header className="masthead reveal">
          <div className="brand">
            <span className="brand-mark">
              <BrandMark />
            </span>
            <div>
              <div className="brand-name">Atmos</div>
              <div className="brand-sub">Real-time weather · built by Ehab Hesham</div>
            </div>
          </div>
          <button className="btn btn-ghost" onClick={() => setShowInfo(true)}>
            <InfoIcon size={16} />
            About PM Accelerator
          </button>
        </header>

        <SearchBar onSearch={search} onUseMyLocation={useMyLocation} loading={loading} />

        {error && (
          <div className="banner banner-error" role="alert">
            <AlertIcon size={16} />
            {error}
            <button className="dismiss" onClick={() => setError('')} aria-label="Dismiss">
              <CloseIcon size={14} />
            </button>
          </div>
        )}

        {weather?.alternatives?.length > 0 && !loading && (
          <div className="alt-row reveal">
            <span>Not what you meant?</span>
            {weather.alternatives.map((a) => (
              <button key={`${a.latitude},${a.longitude}`} className="chip" onClick={() => search(a.name)}>
                {a.name}
              </button>
            ))}
          </div>
        )}

        {loading && <HeroSkeleton />}

        {weather && !loading && (
          <>
            <div className="hero-grid">
              <CurrentWeather data={weather} unit={unit} onUnitChange={setUnit} />
              <MapView
                latitude={weather.location.latitude}
                longitude={weather.location.longitude}
                name={weather.location.name}
              />
            </div>
            <Forecast days={weather.forecast} unit={unit} />
          </>
        )}

        <RecordsPanel defaultLocation={weather?.location?.name || ''} />

        {showInfo && <InfoModal onClose={() => setShowInfo(false)} />}

        <footer className="footer reveal">
          Weather data from Open-Meteo. Geocoding by Open-Meteo and Nominatim (OpenStreetMap).
          <br />
          Map tiles by CARTO. No API keys required. Built by Ehab Hesham for the PM Accelerator assessment.
        </footer>
      </div>
    </div>
  );
}
