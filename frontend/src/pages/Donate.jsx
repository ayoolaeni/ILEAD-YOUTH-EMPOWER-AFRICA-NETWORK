import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Copy, ShieldCheck } from 'lucide-react';
import { PageHero, Reveal, SectionHead } from '../components/ui.jsx';
import { Icon } from '../components/Blocks.jsx';
import useMeta from '../lib/useMeta.js';
import { site } from '../data/site.js';

function CopyButton({ text, label }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for older browsers / non-secure contexts
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch { /* ignore */ }
      ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }
  return (
    <button type="button" className={`copy-btn${copied ? ' copied' : ''}`} onClick={copy} aria-label={`Copy ${label}`}>
      {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
      <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
    </button>
  );
}

const uses = [
  { icon: 'Package', title: 'Learning materials', text: 'Books, stationery and school supplies for pupils in underserved communities.', c: 'var(--orange)' },
  { icon: 'School', title: 'School outreaches', text: 'Volunteer-led outreaches that bring encouragement and resources straight to schools.', c: 'var(--sky)' },
  { icon: 'GraduationCap', title: 'Back to school', text: 'Grants and sponsorship that help out-of-school children return to the classroom.', c: 'var(--green)' },
  { icon: 'Compass', title: 'Youth leadership', text: 'Training and mentorship that grow young people into leaders of character.', c: 'var(--navy)' },
];

export default function Donate() {
  useMeta('Donate', 'Support iLead Youth Empower Africa Network. Give by bank transfer in Naira or US Dollars and help put learning materials in the hands of children who need them.', '/donate');

  return (
    <>
      <PageHero eyebrow="Donate" title={<>Your gift helps a child <em className="accent">learn and lead</em></>}>
        No amount is too small. Every naira and every dollar goes toward learning materials, school outreaches and youth leadership programmes.
      </PageHero>

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Give by bank transfer" title="Our official accounts" center>
            Please transfer to the account below. Always check that the account name reads exactly as shown.
          </SectionHead>
          <div className="accounts">
            {site.accounts.map((a, i) => (
              <Reveal key={a.currency} delay={i * 0.1} className="account" style={{ '--c': i === 0 ? 'var(--orange-strong)' : 'var(--sky-text)' }}>
                <div className="account__cur"><b>{a.currency}</b> {a.label}</div>
                <div className="account__num">
                  <code aria-label={`Account number ${a.number.split('').join(' ')}`}>{a.number}</code>
                  <CopyButton text={a.number} label={`${a.currency} account number`} />
                </div>
                <dl>
                  <div><dt>Account name</dt><dd>{site.accountName}</dd></div>
                  <div><dt>Bank</dt><dd>{site.bank}</dd></div>
                  <div><dt>Currency</dt><dd>{a.currency === 'NGN' ? 'Nigerian Naira (₦)' : 'US Dollar ($)'}</dd></div>
                </dl>
              </Reveal>
            ))}
          </div>
          <p style={{ textAlign: 'center', marginTop: 32, display: 'flex', gap: 10, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
            <ShieldCheck aria-hidden="true" style={{ width: 20, color: 'var(--green-text)' }} />
            <span>{site.name} is registered with the Corporate Affairs Commission ({site.cac}).</span>
          </p>
          <p style={{ textAlign: 'center' }}>
            Made a gift? <Link to="/contact?type=donation" className="link-arrow">Let us know so we can thank you <ArrowRight aria-hidden="true" /></Link>
          </p>
        </div>
      </section>

      <section className="section section--sand">
        <div className="container">
          <SectionHead eyebrow="Where your gift goes" title={<>Turning giving into <em className="accent">opportunity</em></>} />
          <div className="impact-list">
            {uses.map((u, i) => (
              <Reveal key={u.title} delay={i * 0.08} className="impact-item">
                <span className="icon-badge" style={{ '--c': u.c }}><Icon name={u.icon} /></span>
                <h3>{u.title}</h3>
                <p>{u.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--ink">
        <div className="container">
          <SectionHead eyebrow="Other ways to help" title={<>More than a <em className="accent">donation</em></>} center>
            Sponsorship, adverts, donations in kind or your time: talk to us and we will find the right fit.
          </SectionHead>
          <div className="ways">
            {[
              { icon: 'Handshake', title: 'Sponsor an outreach', text: 'Put your organisation’s name behind a school outreach and reach hundreds of pupils.', to: '/contact?type=partnership' },
              { icon: 'Package', title: 'Give in kind', text: 'Books, stationery and school materials are always welcome. Tell us what you would like to give.', to: '/contact?type=donation' },
              { icon: 'Users', title: 'Volunteer with us', text: 'Join an outreach team and see the difference first-hand.', to: '/contact?type=volunteer' },
            ].map((w, i) => (
              <Reveal key={w.title} delay={i * 0.1}>
                <Link to={w.to} className="way" style={{ height: '100%' }}>
                  <span className="icon-badge"><Icon name={w.icon} /></span>
                  <h3>{w.title}</h3>
                  <p>{w.text}</p>
                  <span className="link-arrow">Get in touch <ArrowRight aria-hidden="true" /></span>
                </Link>
              </Reveal>
            ))}
          </div>
          <p style={{ textAlign: 'center', marginTop: 40, color: 'rgba(255,255,255,0.75)' }}>
            Prefer to call? {site.phones.map((p, i) => (
              <span key={p.tel}>{i > 0 && ' · '}<a href={`tel:${p.tel}`} style={{ color: '#fff', fontWeight: 700 }}>{p.label}</a></span>
            ))}
          </p>
        </div>
      </section>
    </>
  );
}
