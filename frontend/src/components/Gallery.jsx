import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
import { Img } from './ui.jsx';
import { fullSrc } from '../lib/media.js';

function Lightbox({ items, index, onClose, onIndex }) {
  const closeRef = useRef(null);
  const item = items[index];
  const prev = useCallback(() => onIndex((index - 1 + items.length) % items.length), [index, items.length, onIndex]);
  const next = useCallback(() => onIndex((index + 1) % items.length), [index, items.length, onIndex]);

  useEffect(() => {
    const opener = document.activeElement;
    closeRef.current?.focus();
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      opener?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'Tab') {
        // keep focus inside the dialog
        const focusables = document.querySelectorAll('.lightbox button');
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, prev, next]);

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={onClose}>
      <span className="lb-count" aria-live="polite">{index + 1} / {items.length}</span>
      <button ref={closeRef} className="lb-close" type="button" onClick={onClose} aria-label="Close"><X aria-hidden="true" /></button>
      <button className="lb-prev" type="button" onClick={(e) => { e.stopPropagation(); prev(); }} aria-label="Previous photo"><ChevronLeft aria-hidden="true" /></button>
      <button className="lb-next" type="button" onClick={(e) => { e.stopPropagation(); next(); }} aria-label="Next photo"><ChevronRight aria-hidden="true" /></button>
      <figure onClick={(e) => e.stopPropagation()}>
        <img src={fullSrc(item.name)} alt={item.alt} />
        <figcaption>{item.alt}</figcaption>
      </figure>
    </div>
  );
}

export default function Gallery({ items }) {
  const [open, setOpen] = useState(null);
  return (
    <>
      <div className="gallery">
        {items.map((it, i) => (
          <button key={it.name} type="button" className="gallery__item" onClick={() => setOpen(i)} aria-label={`Enlarge photo: ${it.alt}`}>
            <Img name={it.name} alt={it.alt} sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 400px" />
            <span className="gallery__zoom"><Expand aria-hidden="true" /></span>
          </button>
        ))}
      </div>
      {open !== null && <Lightbox items={items} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />}
    </>
  );
}
