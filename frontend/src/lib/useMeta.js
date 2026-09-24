import { useEffect } from 'react';
import { site } from '../data/site.js';

const setMeta = (selector, attr, value) => {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute(attr, value);
};

/** Per-page <title>, description and canonical/OG URL for the single-page app. */
export default function useMeta(title, description, path = '') {
  useEffect(() => {
    const full = title ? `${title} | ${site.name}` : `${site.name} | ${site.tagline}`;
    document.title = full;
    if (description) {
      setMeta('meta[name="description"]', 'content', description);
      setMeta('meta[property="og:description"]', 'content', description);
    }
    setMeta('meta[property="og:title"]', 'content', full);
    setMeta('meta[property="og:url"]', 'content', `${site.url}${path}`);
  }, [title, description, path]);
}
