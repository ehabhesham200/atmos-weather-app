import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { PinIcon } from '../icons.jsx';

const TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

const markerIcon = L.divIcon({
  className: 'atmos-marker',
  html: `<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#f2b04b" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 21s-6.5-5.4-6.5-10.2A6.5 6.5 0 0 1 12 4.3a6.5 6.5 0 0 1 6.5 6.5C18.5 15.6 12 21 12 21z" fill="rgba(242,176,75,.18)"/>
    <circle cx="12" cy="10.8" r="2.3" fill="#f2b04b" stroke="none"/>
  </svg>`,
  iconSize: [34, 34],
  iconAnchor: [17, 30],
  popupAnchor: [0, -28],
});

export default function MapView({ latitude, longitude, name }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map(containerRef.current, { zoomControl: true }).setView([latitude, longitude], 10);
      L.tileLayer(TILE_URL, { attribution: ATTRIBUTION, subdomains: 'abcd', maxZoom: 20 }).addTo(mapRef.current);
      markerRef.current = L.marker([latitude, longitude], { icon: markerIcon }).addTo(mapRef.current);
    } else {
      mapRef.current.flyTo([latitude, longitude], 10, { duration: 1.2 });
      markerRef.current.setLatLng([latitude, longitude]);
    }
    markerRef.current.bindPopup(name).openPopup();
  }, [latitude, longitude, name]);

  useEffect(
    () => () => {
      mapRef.current?.remove();
      mapRef.current = null;
    },
    []
  );

  return (
    <section className="card map-card reveal" style={{ animationDelay: '0.15s' }}>
      <h3 className="card-title">
        <PinIcon size={15} />
        Location map
      </h3>
      <div ref={containerRef} className="map-frame" />
    </section>
  );
}
