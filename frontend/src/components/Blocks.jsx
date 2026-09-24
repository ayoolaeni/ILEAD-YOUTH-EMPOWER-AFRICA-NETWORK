import { Link } from 'react-router-dom';
import {
  ArrowRight, BookOpen, Circle, Compass, GraduationCap, HandHeart, Handshake, HeartPulse, Landmark,
  Package, Sprout, ShieldCheck, Users, Megaphone, School, Newspaper, ExternalLink,
} from 'lucide-react';
import { Img, Reveal, SectionHead } from './ui.jsx';
import { programs, press } from '../data/content.js';

// Only the icons we use are imported, so the bundle stays small.
const Icons = { BookOpen, Compass, GraduationCap, HandHeart, Handshake, HeartPulse, Landmark, Package, Sprout, ShieldCheck, Users, Megaphone, School };

/** Look up a lucide icon by name so content files stay plain data. */
export function Icon({ name, ...props }) {
  const C = Icons[name] || Circle;
  return <C aria-hidden="true" {...props} />;
}

export function ProgramsGrid() {
  return (
    <div className="cards-4">
      {programs.map((p, i) => (
        <Reveal key={p.id} delay={i * 0.08} className="program-wrap" style={{ height: '100%' }}>
          <article className="program">
            <div className="program__img">
              <Img name={p.image} alt="" sizes="(max-width: 600px) 100vw, (max-width: 1100px) 50vw, 300px" style={{ objectPosition: p.position }} />
            </div>
            <div className="program__body">
              <span className={`program__icon ${p.color}`}><Icon name={p.icon} /></span>
              <h3>{p.title}</h3>
              <p>{p.blurb}</p>
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}

export function GetInvolved({ dark = true }) {
  const items = [
    { icon: 'HandHeart', title: 'Give', text: 'Fund learning materials, school outreaches and leadership training for children who need it most.', to: '/donate', cta: 'See how to give' },
    { icon: 'Users', title: 'Volunteer', text: 'Join our outreach teams and mentor young people in your community or across our state chapters.', to: '/contact?type=volunteer', cta: 'Offer your time' },
    { icon: 'Handshake', title: 'Partner', text: 'Sponsor an outreach or collaborate with us as an organisation, school or government agency.', to: '/contact?type=partnership', cta: 'Start a conversation' },
  ];
  return (
    <section className={`section ${dark ? 'section--ink' : ''}`}>
      <div className="container">
        <SectionHead eyebrow="Get involved" title={<>Every child deserves a <em className="accent">chance to lead</em></>} center>
          There are many ways to stand with us. Pick the one that fits you.
        </SectionHead>
        <div className="ways">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={i * 0.1}>
              <Link to={it.to} className="way" style={{ height: '100%' }}>
                <span className="icon-badge"><Icon name={it.icon} /></span>
                <h3>{it.title}</h3>
                <p>{it.text}</p>
                <span className="link-arrow">{it.cta} <ArrowRight aria-hidden="true" /></span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function DonateBand() {
  return (
    <section style={{ paddingBlock: 'clamp(40px, 6vw, 72px)' }}>
      <div className="container">
        <Reveal className="cta-band">
          <div>
            <h2>Help us put a book in every child’s hands.</h2>
            <p>Your gift funds learning materials, school outreaches and youth leadership programmes across Nigeria.</p>
          </div>
          <div className="cta-band__actions">
            <Link to="/donate" className="btn btn--primary">Donate now <ArrowRight className="arrow" aria-hidden="true" /></Link>
            <Link to="/contact" className="btn btn--outline-light">Talk to us</Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function PressFeature() {
  return (
    <div className="press-list">
      {press.map((a) => (
        <Reveal key={a.url}>
          <a className="press" href={a.url} target="_blank" rel="noopener noreferrer">
            <div className="press__img">
              <Img name={a.image} alt="" sizes="(max-width: 800px) 100vw, 420px" style={{ objectPosition: '50% 40%' }} />
            </div>
            <div className="press__body">
              <span className="press__outlet"><Newspaper aria-hidden="true" /> {a.outlet} · {a.date}</span>
              <h3>{a.title}</h3>
              <p>{a.summary}</p>
              <span className="link-arrow">Read the full story on {a.outlet} <ExternalLink aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></span>
            </div>
          </a>
        </Reveal>
      ))}
    </div>
  );
}
