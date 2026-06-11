import { useEffect } from 'react';
import { CloseIcon } from '../icons.jsx';

export default function InfoModal({ onClose }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-label="About PM Accelerator" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <CloseIcon size={18} />
        </button>
        <h3>About PM Accelerator</h3>
        <p>
          The Product Manager Accelerator Program supports PM professionals at every stage of their
          career, from students looking for entry-level roles to directors growing into leadership
          positions. Through its hands-on AI learning program, real-world product practice, and a
          global community of mentors and alumni, PM Accelerator has helped hundreds of people land
          product management and AI roles at top companies.
        </p>
        <p>
          Learn more on the{' '}
          <a href="https://www.linkedin.com/school/pmaccelerator/" target="_blank" rel="noreferrer">
            Product Manager Accelerator LinkedIn page
          </a>
          .
        </p>
      </div>
    </div>
  );
}
