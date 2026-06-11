import { useState } from 'react';
import { SearchIcon, CrosshairIcon } from '../icons.jsx';

export default function SearchBar({ onSearch, onUseMyLocation, loading }) {
  const [value, setValue] = useState('');

  function submit(e) {
    e.preventDefault();
    if (value.trim()) onSearch(value.trim());
  }

  return (
    <form className="search reveal" style={{ animationDelay: '0.05s' }} onSubmit={submit}>
      <div className="search-field">
        <SearchIcon size={19} />
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search a city, zip code, landmark, or coordinates"
          aria-label="Location"
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? <span className="spin" aria-hidden="true" /> : 'Get weather'}
        </button>
      </div>
      <div className="search-aside">
        <button type="button" className="btn btn-ghost" onClick={onUseMyLocation} disabled={loading}>
          <CrosshairIcon size={17} />
          My location
        </button>
      </div>
    </form>
  );
}
