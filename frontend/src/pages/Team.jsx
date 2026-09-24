import { useEffect, useRef, useState } from 'react';
import { ArrowRight, Plus, X } from 'lucide-react';
import { Img, PageHero, Reveal, SectionHead } from '../components/ui.jsx';
import { DonateBand } from '../components/Blocks.jsx';
import useMeta from '../lib/useMeta.js';
import { leadership, advisors, advisoryMandate, advisoryRoles } from '../data/team.js';

function MemberModal({ member, onClose }) {
  const closeRef = useRef(null);
  useEffect(() => {
    const opener = document.activeElement;
    closeRef.current?.focus();
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        const f = document.querySelectorAll('.modal button');
        if (f.length === 1) { e.preventDefault(); f[0].focus(); }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      opener?.focus?.();
    };
  }, [onClose]);

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="member-name" onClick={onClose}>
      <div className="modal__panel" onClick={(e) => e.stopPropagation()}>
        <button ref={closeRef} type="button" className="modal__close" onClick={onClose} aria-label="Close"><X aria-hidden="true" /></button>
        <div className="modal__photo">
          <Img name={member.photo} alt={`Portrait of ${member.name}`} sizes="(max-width: 720px) 100vw, 380px" style={{ objectPosition: member.position }} />
        </div>
        <div className="modal__body">
          <p className="member__role">{member.role}</p>
          <h3 id="member-name">{member.name}</h3>
          {member.bio.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}
        </div>
      </div>
    </div>
  );
}

function Accordion({ items }) {
  const [open, setOpen] = useState(0);
  return (
    <div className="accordion">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <div key={it.title} className={`acc${isOpen ? ' is-open' : ''}`}>
            <h3 style={{ font: 'inherit' }}>
              <button type="button" className="acc__btn" aria-expanded={isOpen} aria-controls={`acc-${i}`} onClick={() => setOpen(isOpen ? -1 : i)}>
                <span><span className="num">{String(i + 1).padStart(2, '0')}</span>{it.title}</span>
                <Plus aria-hidden="true" />
              </button>
            </h3>
            <div className="acc__panel" id={`acc-${i}`} role="region" aria-hidden={!isOpen}>
              <div><ul>{it.points.map((p) => <li key={p}>{p}</li>)}</ul></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Team() {
  useMeta('Our team', 'Meet the leadership team and Advisory Board of iLead Youth Empower Africa Network.', '/team');
  const [active, setActive] = useState(null);
  const avatarColors = ['var(--orange-strong)', 'var(--green-text)', 'var(--sky-text)', 'var(--navy)', 'var(--ink-2)'];

  return (
    <>
      <PageHero eyebrow="Our team" title={<>The people <em className="accent">behind the mission</em></>}>
        Professionals and young leaders from law, finance, communications, human resources and public service, united by a commitment to Africa’s children.
      </PageHero>

      <section className="section">
        <div className="container">
          <SectionHead eyebrow="Leadership" title="Executive team" />
          <div className="team-grid">
            {leadership.map((m, i) => (
              <Reveal key={m.id} delay={(i % 3) * 0.08}>
                <button type="button" className="member" onClick={() => setActive(m)} aria-label={`Read the profile of ${m.name}`}>
                  <div className="member__photo">
                    <Img name={m.photo} alt="" sizes="(max-width: 620px) 100vw, (max-width: 1000px) 50vw, 380px" style={{ objectPosition: m.position }} />
                  </div>
                  <div className="member__body">
                    <span className="member__role">{m.role}</span>
                    <h3>{m.name}</h3>
                    <p className="member__focus">{m.focus}</p>
                    <span className="member__more">Read profile <ArrowRight aria-hidden="true" /></span>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--sand">
        <div className="container">
          <SectionHead eyebrow="Advisory Board" title={<>Guided by <em className="accent">experienced advisers</em></>}>
            {advisoryMandate}
          </SectionHead>
          <div className="advisors">
            {advisors.map((a, i) => (
              <Reveal key={a.name} delay={i * 0.07} className="advisor" style={{ '--c': avatarColors[i % avatarColors.length] }}>
                <span className="advisor__avatar" aria-hidden="true">{a.initials}</span>
                <div className="advisor__body"><strong>{a.name}</strong><span>{a.role}</span></div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container container--narrow">
          <SectionHead eyebrow="What advisers do" title="Advisory Board responsibilities" />
          <Reveal><Accordion items={advisoryRoles} /></Reveal>
        </div>
      </section>

      <DonateBand />
      {active && <MemberModal member={active} onClose={() => setActive(null)} />}
    </>
  );
}
