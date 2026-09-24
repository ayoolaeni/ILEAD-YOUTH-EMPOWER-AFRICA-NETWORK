import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Send } from 'lucide-react';
import { sendContact } from '../lib/api.js';

const TYPES = [
  { value: 'general', label: 'General enquiry' },
  { value: 'volunteer', label: 'I want to volunteer' },
  { value: 'partnership', label: 'Partnership or sponsorship' },
  { value: 'donation', label: 'Donation support' },
  { value: 'media', label: 'Media & press' },
];

const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

export default function ContactForm() {
  const [params] = useSearchParams();
  const initialType = TYPES.some((t) => t.value === params.get('type')) ? params.get('type') : 'general';

  const [values, setValues] = useState({ type: initialType, name: '', email: '', phone: '', message: '' });
  const [hp, setHp] = useState('');
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ state: 'idle', message: '' });
  const [openedAt] = useState(() => Date.now());

  const set = (k) => (e) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  function validate() {
    const er = {};
    if (values.name.trim().length < 2) er.name = 'Please tell us your name.';
    if (!emailOk(values.email.trim())) er.email = 'Please enter a valid email address.';
    if (values.message.trim().length < 10) er.message = 'Please write a short message (at least 10 characters).';
    return er;
  }

  async function onSubmit(e) {
    e.preventDefault();
    const er = validate();
    setErrors(er);
    if (Object.keys(er).length) {
      document.getElementById(`cf-${Object.keys(er)[0]}`)?.focus();
      return;
    }
    setStatus({ state: 'loading', message: '' });
    try {
      const res = await sendContact({ ...values, website: hp, elapsed: Date.now() - openedAt });
      setStatus({ state: 'ok', message: res.message });
    } catch (err) {
      setErrors(err.fields || {});
      setStatus({ state: 'err', message: err.message });
    }
  }

  if (status.state === 'ok') {
    return (
      <div className="form-card success" role="status">
        <div className="icon-badge"><CheckCircle2 aria-hidden="true" /></div>
        <h3>Thank you, {values.name.split(' ')[0]}!</h3>
        <p>{status.message}</p>
        <button
          className="btn btn--ghost btn--sm"
          type="button"
          onClick={() => {
            setValues({ type: 'general', name: '', email: '', phone: '', message: '' });
            setStatus({ state: 'idle', message: '' });
          }}
        >
          Send another message
        </button>
      </div>
    );
  }

  const field = (id, label, control, required = false) => (
    <div className={`field${errors[id] ? ' has-error' : ''}`}>
      <label htmlFor={`cf-${id}`}>{label}{required && <span aria-hidden="true"> *</span>}</label>
      {control}
      {errors[id] && <span className="err" id={`cf-${id}-err`} role="alert">{errors[id]}</span>}
    </div>
  );
  const a11y = (id) => ({ id: `cf-${id}`, 'aria-invalid': !!errors[id], 'aria-describedby': errors[id] ? `cf-${id}-err` : undefined });

  return (
    <div className="form-card">
      <h2>Send us a message</h2>
      <p>We read every message and reply as soon as we can.</p>
      <form className="form" onSubmit={onSubmit} noValidate>
        {field('type', 'How can we help?',
          <select {...a11y('type')} value={values.type} onChange={set('type')}>
            {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>)}
        <div className="form__row">
          {field('name', 'Full name',
            <input {...a11y('name')} type="text" autoComplete="name" value={values.name} onChange={set('name')} required maxLength={100} />, true)}
          {field('email', 'Email address',
            <input {...a11y('email')} type="email" autoComplete="email" value={values.email} onChange={set('email')} required maxLength={150} />, true)}
        </div>
        {field('phone', 'Phone (optional)',
          <input {...a11y('phone')} type="tel" autoComplete="tel" value={values.phone} onChange={set('phone')} maxLength={30} />)}
        {field('message', 'Your message',
          <textarea {...a11y('message')} value={values.message} onChange={set('message')} required maxLength={4000} />, true)}

        <div className="hp" aria-hidden="true">
          <label>Leave this empty<input tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} /></label>
        </div>

        {status.state === 'err' && (
          <div className="alert alert--err" role="alert"><AlertCircle aria-hidden="true" /><span>{status.message}</span></div>
        )}
        <button className="btn btn--primary" type="submit" disabled={status.state === 'loading'}>
          {status.state === 'loading' ? 'Sending…' : <>Send message <Send aria-hidden="true" /></>}
        </button>
      </form>
    </div>
  );
}
