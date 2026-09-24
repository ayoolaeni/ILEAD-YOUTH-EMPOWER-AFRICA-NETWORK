import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { subscribe } from '../lib/api.js';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [hp, setHp] = useState('');
  const [state, setState] = useState({ status: 'idle', message: '' });

  async function onSubmit(e) {
    e.preventDefault();
    setState({ status: 'loading', message: '' });
    try {
      const res = await subscribe({ email, website: hp });
      setState({ status: 'ok', message: res.message });
      setEmail('');
    } catch (err) {
      setState({ status: 'err', message: err.fields?.email || err.message });
    }
  }

  return (
    <form className="newsletter" onSubmit={onSubmit} noValidate>
      <label htmlFor="nl-email" className="sr-only">Email address</label>
      <div className="newsletter__row">
        <input
          id="nl-email"
          type="email"
          placeholder="Your email address"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button className="btn btn--primary btn--sm" type="submit" disabled={state.status === 'loading'} aria-label="Subscribe">
          <ArrowRight aria-hidden="true" />
        </button>
      </div>
      {/* honeypot: real visitors never see or fill this */}
      <div className="hp" aria-hidden="true">
        <label>Website<input tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} /></label>
      </div>
      <p className={`msg ${state.status === 'ok' ? 'ok' : state.status === 'err' ? 'err' : ''}`} role="status" aria-live="polite">
        {state.status === 'loading' ? 'Subscribing…' : state.message}
      </p>
    </form>
  );
}
