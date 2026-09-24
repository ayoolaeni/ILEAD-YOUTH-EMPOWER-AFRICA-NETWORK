import { Link } from 'react-router-dom';
import useMeta from '../lib/useMeta.js';

export default function NotFound() {
  useMeta('Page not found', 'The page you are looking for could not be found.');
  return (
    <section className="container not-found">
      <h1>404</h1>
      <h2 style={{ marginBottom: 14 }}>This page has wandered off.</h2>
      <p>The page you are looking for does not exist or has moved.</p>
      <Link to="/" className="btn btn--primary">Back to home</Link>
    </section>
  );
}
