import { useEffect, useState } from 'react';
import { api } from '../api.js';
import {
  DatabaseIcon,
  DownloadIcon,
  PencilIcon,
  TrashIcon,
  ChevronIcon,
  CloseIcon,
  AlertIcon,
  CheckIcon,
} from '../icons.jsx';

const EXPORT_FORMATS = ['json', 'csv', 'xml', 'markdown'];
const emptyForm = { location: '', startDate: '', endDate: '', notes: '' };

export default function RecordsPanel({ defaultLocation }) {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  async function refresh() {
    try {
      const { records } = await api.listRecords();
      setRecords(records);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    if (defaultLocation && !editingId) {
      setForm((f) => ({ ...f, location: defaultLocation }));
    }
  }, [defaultLocation, editingId]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    try {
      if (editingId) {
        await api.updateRecord(editingId, form);
        setNotice('Record updated and temperatures refreshed.');
      } else {
        await api.createRecord(form);
        setNotice('Record saved with real temperatures for your date range.');
      }
      setForm(emptyForm);
      setEditingId(null);
      await refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  function startEdit(record) {
    setEditingId(record._id);
    setForm({
      location: record.rawLocationInput,
      startDate: record.startDate,
      endDate: record.endDate,
      notes: record.notes || '',
    });
    setNotice('');
    setError('');
  }

  async function remove(id) {
    setBusy(true);
    setError('');
    try {
      await api.deleteRecord(id);
      if (editingId === id) {
        setEditingId(null);
        setForm(emptyForm);
      }
      await refresh();
      setNotice('Record deleted.');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="card reveal" style={{ animationDelay: '0.3s' }}>
      <h3 className="card-title">
        <DatabaseIcon size={15} />
        Saved weather requests
      </h3>
      <p className="records-intro">
        Store a location with a date range. The server validates both, pulls real temperatures for
        the range, and keeps everything in the database. Records can be read, edited, deleted, and
        exported by anyone.
      </p>

      <form className="record-form" onSubmit={submit}>
        <div className="field">
          <span className="field-label">Location</span>
          <input
            type="text"
            placeholder="City, zip, landmark, or coordinates"
            value={form.location}
            onChange={set('location')}
            required
          />
        </div>
        <div className="field">
          <span className="field-label">From</span>
          <input type="date" value={form.startDate} onChange={set('startDate')} required />
        </div>
        <div className="field">
          <span className="field-label">To</span>
          <input type="date" value={form.endDate} onChange={set('endDate')} required />
        </div>
        <div className="field">
          <span className="field-label">Notes</span>
          <input type="text" placeholder="Optional" value={form.notes} onChange={set('notes')} />
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy ? <span className="spin" aria-hidden="true" /> : editingId ? 'Update' : 'Save'}
          </button>
          {editingId && (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {error && (
        <div className="banner banner-error" role="alert">
          <AlertIcon size={16} />
          {error}
          <button className="dismiss" onClick={() => setError('')} aria-label="Dismiss">
            <CloseIcon size={14} />
          </button>
        </div>
      )}
      {notice && (
        <div className="banner banner-ok">
          <CheckIcon size={16} />
          {notice}
          <button className="dismiss" onClick={() => setNotice('')} aria-label="Dismiss">
            <CloseIcon size={14} />
          </button>
        </div>
      )}

      <div className="export-row">
        <span className="export-label">
          <DownloadIcon size={14} />
          Export database
        </span>
        {EXPORT_FORMATS.map((f) => (
          <a key={f} className="export-link" href={api.exportUrl(f)} download>
            {f === 'markdown' ? 'MD' : f.toUpperCase()}
          </a>
        ))}
      </div>

      {records.length === 0 ? (
        <p className="empty-note">No records yet. Save one above to see it here.</p>
      ) : (
        <ul className="record-list">
          {records.map((r, i) => (
            <li key={r._id} className="record" style={{ animationDelay: `${i * 0.05}s` }}>
              <div className="record-head">
                <div>
                  <div className="record-title">{r.resolvedName}</div>
                  <div className="record-meta">
                    {r.startDate} to {r.endDate} · searched as "{r.rawLocationInput}"
                    {r.notes ? ` · ${r.notes}` : ''}
                  </div>
                </div>
                <div className="record-actions">
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => setExpandedId(expandedId === r._id ? null : r._id)}
                    aria-expanded={expandedId === r._id}
                  >
                    <ChevronIcon
                      size={14}
                      style={{
                        transform: expandedId === r._id ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.3s',
                      }}
                    />
                    Temps
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={() => startEdit(r)} disabled={busy}>
                    <PencilIcon size={14} />
                    Edit
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => remove(r._id)} disabled={busy}>
                    <TrashIcon size={14} />
                    Delete
                  </button>
                </div>
              </div>
              <div className={`record-detail ${expandedId === r._id ? 'open' : ''}`}>
                <div>
                  <table className="temp-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Max</th>
                        <th>Min</th>
                        <th>Mean</th>
                      </tr>
                    </thead>
                    <tbody>
                      {r.temperatures.map((t) => (
                        <tr key={t.date}>
                          <td>{t.date}</td>
                          <td>{t.tempMax ?? '-'}°C</td>
                          <td>{t.tempMin ?? '-'}°C</td>
                          <td>{t.tempMean ?? '-'}°C</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
